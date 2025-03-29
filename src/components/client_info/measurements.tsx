import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useClientMeasurements } from "@/hooks/useClients";
import { PatientMeasurement } from "@/types/types";
import { Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import BloodSugar from "../icons/bloodSugar";
import Scale from "../icons/scale";
import Heart from "../icons/heart";
import BodyTemp from "../icons/bodyTemp";
import Sitting from "../icons/sitting";
import InBed from "../icons/inBed";
import Hand from "../icons/hand";
import { Percent } from "lucide-react";
import Loading from "@/components/loading";
import NewFilter from "../newFilter";
import { FilterProps } from "@/types/filterTypes";

const items: FilterProps = {
  header: "Sía",
  description: "Sía eftir tegundum mælinga",
  items: [
    {
      id: "BloodPressure",
      name: "Blóðþrýstingur",
      checked: true,
    },
    {
      id: "BloodSugar",
      name: "Blóðsykur",
      checked: true,
    },
    {
      id: "BodyTemperature",
      name: "Hiti",
      checked: true,
    },
    {
      id: "BodyWeight",
      name: "Þyngd",
      checked: true,
    },
    {
      id: "OxygenSaturation",
      name: "Súrefnismettun",
      checked: true,
    },
    {
      id: "allt",
      name: "Allar tegundir mælinga",
      checked: true,
    },
  ],
};

const Measurements = ({ id }: { id: string }) => {
  const { measurements, error, isLoading } = useClientMeasurements(id);
  //const [view, setView] = useState("registered");
  const [currentData, setCurrentData] = useState<PatientMeasurement[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [filters, setFilters] = useState<FilterProps>(items);

  useEffect(() => {
    setCurrentData(
      measurements?.filter(
        (measurement) =>
          filters.items.find(
            (filter) => filter.id === measurement.measurementType
          )?.checked
      ) || []
    );
  }, [measurements, filters]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!measurements) {
    return <div>No measurements found</div>;
  }

  //const mm: PatientMeasurement[] = measurements;

  if (!currentData) {
    setCurrentData(measurements);
  }

  console.log(currentData);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full flex justify-between p-4">
        {/*
        <Button
          className={`text-md rounded-e-none w-32 place-content-center ${view === "unregistered" ? "opacity-50" : ""}`}
          onClick={() => setView("registered")}
        >
          Skráðar
        </Button>
        <Button
          className={`text-md rounded-s-none w-32 place-content-center ${view === "registered" ? "opacity-50" : ""}`}
          onClick={() => setView("unregistered")}
        >
          <div className="flex flex-row">
            <p>Óskráðar</p>
            <p className="pl-2 text-primary-foreground">
              0
            </p>
          </div>
        </Button>
        */}
        <div className="ml-auto pr-4">
          <NewFilter
            setPopoverOpen={setPopoverOpen}
            filters={filters}
            setFilters={setFilters}
            popoverOpen={popoverOpen}
          />
        </div>
      </div>
      <div className="p-4 flex-grow overflow-hidden">
        <ScrollArea className="w-full h-full border border-primary rounded-md">
          <Table>
            <TableBody>
              {currentData.map((item) => {
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
                    {values.status !== "" && values.status !== "Invalid" ? (
                      <TableCell className="p-0">
                        <Circle className={values.status} />
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

export default Measurements;
