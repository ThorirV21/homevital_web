import { useState, useMemo } from "react";
import { useClientMeasurements } from "@/hooks/useClients";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { ColumnDef } from "@tanstack/react-table"; // Ensure this matches your import
import { PatientMeasurement } from "@/types/types";
import { ScrollArea } from "../ui/scroll-area";
import useSession from "@/hooks/useSession";
import DataTable from "../dataTable/dataTable";
import {
  MeasurementColumns,
  MeasurementRow,
} from "../dataTable/measurementsColumns";
import Modal from "../ui/modal"; // Import the Modal component
import { Textarea } from "../ui/textarea"; // Import the Textarea component
import { useClientWarningAcknowledge } from "@/hooks/useClients";

const Warnings = ({ id }: { id: string }) => {
  const { data, isLoading, error } = useClientMeasurements(id);
  const [selectedMeasurement, setSelectedMeasurement] =
    useState<PatientMeasurement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [resolutionNotes, setResolutionNotes] = useState<string>("");
  const { session } = useSession();
  const { acknowledgeMutation } = useClientWarningAcknowledge(id);

  const measurements = useMemo(() => {
    return data ? data.data : [];
  }, [data]);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  const warnings: PatientMeasurement[] = measurements.filter(
    (measurement: PatientMeasurement) =>
      measurement.measurementValues.status.toLowerCase() !== "normal" &&
      !measurement.measurementValues.isAcknowledged
  );

  const handleSelectClick = (measurement: PatientMeasurement) => {
    console.log("Selected measurement:", measurement);
    setSelectedMeasurement(measurement);
    setResolutionNotes(""); // Clear notes when opening the modal
    setIsModalOpen(true); // Open the modal
  };

  const handleSubmit = async () => {
    if (!selectedMeasurement || !resolutionNotes.trim() || !session?.user)
      return;
    console.log("the measurement:", selectedMeasurement);
    const requestData = {
      measurementType: selectedMeasurement.measurementType,
      measurementID: selectedMeasurement.id,
      workerID: parseInt(session?.user?.id),
      resolutionNotes: resolutionNotes,
    };
    console.log("Request data:", requestData);

    acknowledgeMutation(requestData);

    // Optionally, you can handle the response here
    console.log("Acknowledgment request sent");

    // Close the modal
    setIsModalOpen(false);
  };

  //     try {
  //       const response = await fetch(
  //         "https://homevitaldev-app.azurewebsites.net/api/measurements/acknowledge",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(requestData),
  //         }
  //       );

  //       if (response.ok) {
  //         console.log("Measurement acknowledged successfully");
  //         setSelectedMeasurement(null);
  //         setResolutionNotes("");
  //         setIsModalOpen(false); // Close the modal
  //         await response.json();
  //       } else {
  //         console.error("Failed to acknowledge measurement");
  //         try {
  //           const errorData = await response.json();
  //           console.error("Error details:", errorData);
  //         } catch (error) {
  //           console.error("Could not parse error response", error);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error acknowledging measurement:", error);
  //     }
  //   };

  const rows: MeasurementRow[] = warnings.map((item) => ({
    id: item.id,
    measurementDate: item.measurementDate,
    measurementType: item.measurementType,
    measurementValues: item.measurementValues,
    date: new Date(item.measurementDate).toLocaleDateString(),
    type: item.measurementType,
    values: item.measurementValues,
    status: item.measurementValues.status,
    isAcknowledged: item.isAcknowledged,
    onSelect: () => handleSelectClick(item),
    isSelected: selectedMeasurement?.id === item.id,
  }));

  const updatedColumns: ColumnDef<MeasurementRow, unknown>[] = [
    ...MeasurementColumns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original as unknown as PatientMeasurement;
        return (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => handleSelectClick(item)}
          >
            Resolve
          </button>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col">
      <ScrollArea className="w-full h-full max-h-[calc(100vh-23rem)] border border-primary rounded-md">
        <DataTable columns={updatedColumns} data={rows} name={""} />
      </ScrollArea>

      {/* Modal for resolution notes */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Resolution Notes"
      >
        <div className="flex flex-col space-y-4">
          <Textarea
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Enter resolution notes here..."
            className="w-full h-32 border border-gray-300 rounded-md p-2"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSubmit}
            disabled={!resolutionNotes.trim()}
          >
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Warnings;
