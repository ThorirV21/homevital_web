import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useClientMeasurements } from "@/hooks/useClients";
import { PatientMeasurement } from "@/types/types";

import { Button } from "../ui/button";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import BloodSugar from "../icons/bloodSugar";
import Scale from "../icons/scale";
import Heart from "../icons/heart";
import BodyTemp from "../icons/bodyTemp";
import Sitting from "../icons/sitting";
import InBed from "../icons/inBed";
import Hand from "../icons/hand";
import { Percent } from "lucide-react";

const Measurements = ({ id }: { id: string }) => {
  const { measurements, error, isLoading } = useClientMeasurements(id);
  const [view, setView] = useState("registered");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!measurements) {
    return <div>No measurements found</div>;
  }

  const mm: PatientMeasurement[] = measurements;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 p-4">
        <Button
          className={`text-md rounded-e-none w-32 place-content-center ${view === "unregistered" ? "opacity-50" : ""}`}
          onClick={() => setView("registered")}
        >
          Skráðar
        </Button>
        <Button
          className={`text-md rounded-e-none w-32 place-content-center ${view === "registered" ? "opacity-50" : ""}`}
          onClick={() => setView("unregistered")}
        >
          Óskráðar
        </Button>
      </div>
      <div className="p-4 flex-grow overflow-hidden">
        <ScrollArea className="w-full h-full border border-primary rounded-md">
          <Table>
            <TableBody>
              {mm.map((item) => {
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
                            <Hand className="mx-2" />
                          </div>
                        </div>
                      ) : null}
                    </TableCell>
                    {/* <TableCell className="p-0">
                      <Circle className="text-good" />
                    </TableCell> */}
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

export default Measurements;
