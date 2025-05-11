import { useState, useMemo } from "react";
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
import TooltipInfo from "../tooltipInfo";
import React from "react";
import useSession from "@/hooks/useSession";

const Warnings = ({ id }: { id: string }) => {
  const { data, isLoading, error } = useClientMeasurements(id);
  const [selectedMeasurement, setSelectedMeasurement] =
    useState<PatientMeasurement | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>("");
  const { session } = useSession();
  const measurements = useMemo(() => {
    return data ? data.data : [];
  }, [data]);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  const warnings: PatientMeasurement[] = measurements.filter(
    (measurement: PatientMeasurement) =>
      measurement.measurementValues.status.toLowerCase() !== "normal" &&
      !measurement.isAcknowledged
  );

  const handleSelectClick = (measurement: PatientMeasurement) => {
    if (selectedMeasurement?.id === measurement.id) {
      setSelectedMeasurement(null); // Toggle off if already selected
    } else {
      setSelectedMeasurement(measurement);
      setResolutionNotes(""); // Clear notes when selecting a new measurement
    }
  };

  //   const handleSubmit = (id: number) => {
  //     console.log(`Submitting resolution notes for measurement ${id}:`, resolutionNotes);
  //     setSelectedMeasurement(null);
  //   };
  const handleSubmit = async () => {
    if (!selectedMeasurement || !resolutionNotes.trim() || !session?.user)
      return;

    const requestData = {
      measurementType: selectedMeasurement.measurementType,
      measurementID: selectedMeasurement.id,
      workerID: session.user.id, // Get the worker ID from session context
      resolutionNotes: resolutionNotes,
    };

    try {
      const response = await fetch(
        "https://homevitaldev-app.azurewebsites.net/api/measurements/acknowledge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response status text:", response.statusText);

      if (response.ok) {
        // Success
        console.log("Measurement acknowledged successfully");
        setSelectedMeasurement(null);
        setResolutionNotes("");
        await response.json(); // Await the response to ensure it's fully processed
      } else {
        // Handle error
        console.error("Failed to acknowledge measurement");
        // Try to get error details from response
        try {
          const errorData = await response.json();
          console.error("Error details:", errorData);
        } catch (error) {
          console.error("Could not parse error response", error);
        }
      }
    } catch (error) {
      console.error("Error acknowledging measurement:", error);
    }
  };

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
                  ) : null;

                const isSelected = selectedMeasurement?.id === item.id;

                return (
                  <React.Fragment key={`${item.id}-${type}`}>
                    {/* Measurement Row */}
                    <TableRow>
                      <TableCell>{dateString}</TableCell>
                      <TableCell>{icon}</TableCell>
                      <TableCell>
                        {type === "BodyTemperature" ? (
                          `${values.temperature} °C`
                        ) : type === "BodyWeight" ? (
                          `${values.weight} Kg`
                        ) : type === "BloodSugar" ? (
                          `${values.bloodSugar} mmól/L`
                        ) : type === "BloodPressure" ? (
                          <div className="flex gap-6">
                            <p>SYS {values.systolic}</p>
                            <p>DIA {values.diastolic}</p>
                            <p>Púls {values.bpm}</p>
                          </div>
                        ) : null}
                      </TableCell>
                      {values.status !== "" && values.status !== "Invalid" ? (
                        <TableCell className="p-0">
                          <TooltipInfo info={values.status}>
                            <Circle className={values.status} />
                          </TooltipInfo>
                        </TableCell>
                      ) : null}
                      <TableCell>
                        <button
                          className="px-8 py-1 bg-primary text-white rounded-md"
                          onClick={() => handleSelectClick(item)}
                        >
                          {isSelected ? "Loka" : "Skrá Meðhöndlun"}
                        </button>
                      </TableCell>
                    </TableRow>

                    {/* Input Field and Submit Button Row */}
                    {isSelected && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="flex flex-col gap-2">
                            <textarea
                              className="w-full p-2 border rounded-md"
                              placeholder="Skráning höndlunar"
                              value={resolutionNotes}
                              onChange={(e) =>
                                setResolutionNotes(e.target.value)
                              }
                            />
                            <button
                              className="self-end px-4 py-2 bg-primary text-white rounded-md"
                              onClick={() => handleSubmit()}
                            >
                              Skrá
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
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
