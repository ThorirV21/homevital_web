import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useClientMeasurements } from "@/hooks/useClients";
import { MeasurementTypes, PatientMeasurement } from "@/types/types";

import { Button } from "../ui/button";
import Image from "next/image";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

const testMeasurements = [
  {
    id: 1,
    patientID: 35,
    bloodPressure: [
      {
        id: 506,
        patientID: 35,
        measureHand: "Left",
        bodyPosition: "Lying Down",
        systolic: 120,
        diastolic: 73,
        pulse: 89,
        date: "2024-03-07T20:51:51.080934",
        status: "Normal",
      },
    ],
    bloodSugar: [
      {
        id: 155,
        patientID: 35,
        bloodsugarLevel: 9.0,
        date: "2024-10-20T20:51:51.080957",
      },
    ],
    bodyWeight: [
      {
        id: 732,
        patientID: 35,
        weight: 81.5,
        date: "2024-09-27T20:51:51.080965",
      },
    ],
    bodyTemperature: [
      {
        id: 512,
        patientID: 35,
        temperature: 38.6,
        date: "2024-07-16T20:51:51.080971",
      },
    ],
  },
  {
    id: 2,
    patientID: 35,
    bloodPressure: [
      {
        id: 702,
        patientID: 35,
        measureHand: "Right",
        bodyPosition: "Sitting",
        systolic: 113,
        diastolic: 74,
        pulse: 64,
        date: "2024-04-23T20:51:51.080980",
        status: "Normal",
      },
    ],
    bloodSugar: [
      {
        id: 353,
        patientID: 35,
        bloodsugarLevel: 6.4,
        date: "2024-09-20T20:51:51.080987",
      },
    ],
    bodyWeight: [
      {
        id: 344,
        patientID: 35,
        weight: 64.6,
        date: "2024-08-11T20:51:51.080992",
      },
    ],
    bodyTemperature: [
      {
        id: 533,
        patientID: 35,
        temperature: 37.8,
        date: "2024-06-17T20:51:51.080998",
      },
    ],
  },
];

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

  const data: PatientMeasurement[] = testMeasurements;
  const mm: MeasurementTypes[] = [];
  data.map((item) => {
    mm.push(
      ...item.bloodPressure,
      ...item.bloodSugar,
      ...item.bodyTemperature,
      ...item.bodyWeight
    );
  });
  console.table(mm);

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
                const date = new Date(item.date);
                const dateString = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
                const imgPath =
                  "temperature" in item
                    ? "/measurements_icons/BodyTemp.svg"
                    : "weight" in item
                      ? "/measurements_icons/Scale.svg"
                      : "bloodsugarLevel" in item
                        ? "/measurements_icons/Bloodsugar.svg"
                        : "systolic" in item &&
                            "diastolic" in item &&
                            "pulse" in item
                          ? "/measurements_icons/Heart.svg"
                          : "";
                return (
                  <TableRow key={item.id}>
                    <TableCell>{dateString}</TableCell>
                    <TableCell>
                      <Image alt="Type" src={imgPath} width={20} height={20} />
                    </TableCell>
                    <TableCell>
                      {"temperature" in item ? (
                        `${item.temperature} °C`
                      ) : "weight" in item ? (
                        `${item.weight} Kg`
                      ) : "bloodsugarLevel" in item ? (
                        `${item.bloodsugarLevel} mmól/L`
                      ) : "systolic" in item &&
                        "diastolic" in item &&
                        "pulse" in item ? (
                        <div className="flex gap-6">
                          <p>SYS {item.systolic}</p>
                          <p>DIA {item.diastolic}</p>
                          <p>Púls {item.pulse}</p>
                        </div>
                      ) : null}
                    </TableCell>
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
