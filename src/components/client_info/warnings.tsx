import { useClientMeasurements } from "@/hooks/useClients";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PatientMeasurement } from "@/types/types";
import { Circle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import BloodSugar from "../icons/bloodSugar";
import Scale from "../icons/scale";
import Heart from "../icons/heart";
import BodyTemp from "../icons/bodyTemp";
import Sitting from "../icons/sitting";
import InBed from "../icons/inBed";
import Hand from "../icons/hand";
import { Percent } from "lucide-react";

import TooltipInfo from "../tooltipInfo";

const Warnings = ({ id }: { id: string }) => {
  const { measurements, isLoading, error } = useClientMeasurements(id);

  if (isLoading) return <Loading />;

  if (error) return <Error />;

  const warnings: PatientMeasurement[] = measurements.filter(
    (measurement: PatientMeasurement) =>
      measurement.measurementValues.status.toLowerCase() !== "normal"
  );

  return (
    <div className="flex flex-col">
      <div>
        <ScrollArea className="w-full h-full max-h-[calc(100vh-23rem)] border border-primary rounded-md">
          <Table>
            <TableBody>
              {warnings.map((item) => {
                const type = item.measurementType;
                const values = item.measurementValues;
                const date = new Date(item.measurementDate);
                const dateString = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
                const icon =
                  type === "BodyTemperature" ? (
                    <BodyTemp />
                  ) : type === "BodyWeight" ? (
                    <Scale />
                  ) : type === "BloodSugar" ? (
                    <BloodSugar />
                  ) : type === "BloodPressure" ? (
                    <Heart />
                  ) : type === "OxygenSaturation" ? (
                    <Percent />
                  ) : (
                    ""
                  );
                return (
                  <TableRow key={item.id.toString() + type}>
                    <TableCell>{dateString}</TableCell>
                    <TableCell>{icon}</TableCell>
                    <TableCell>
                      {type === "BodyTemperature" ? (
                        `${values.temperature} °C`
                      ) : type === "OxygenSaturation" ? (
                        `${values.oxygenSaturation} %`
                      ) : type === "BodyWeight" ? (
                        `${values.weight} Kg`
                      ) : type === "BloodSugar" ? (
                        `${values.bloodSugar} mmól/L`
                      ) : type === "BloodPressure" ? (
                        <div className="flex gap-6">
                          <p>SYS {values.systolic}</p>
                          <p>DIA {values.diastolic}</p>
                          <p>Púls {values.bpm}</p>
                          <div className="ml-auto flex">
                            {values.bodyPosition === "Sitting" ? (
                              <Sitting className="" />
                            ) : values.bodyPosition === "Laying" ? (
                              <InBed className="" />
                            ) : null}
                            <TooltipInfo
                              info={
                                values.measureHand === "Right"
                                  ? "Hægri"
                                  : values.measureHand === "Left"
                                    ? "Vinstri"
                                    : ""
                              }
                            >
                              <Hand
                                className={`mx-2 ${values.measureHand === "Right" ? "flip-horizontal" : ""}`}
                              />
                            </TooltipInfo>
                          </div>
                        </div>
                      ) : null}
                    </TableCell>
                    {values.status !== "" && values.status !== "Invalid" ? (
                      <TableCell className="p-0">
                        <TooltipInfo info={values.status}>
                          <Circle className={values.status} />
                        </TooltipInfo>
                      </TableCell>
                    ) : (
                      <></>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Warnings;
