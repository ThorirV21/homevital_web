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
    // console.log("Selected measurement:", measurement);
    setSelectedMeasurement(measurement);
    setResolutionNotes(""); // Clear notes when opening the modal
    setIsModalOpen(true); // Open the modal
  };

  const handleSubmit = async () => {
    if (!selectedMeasurement || !resolutionNotes.trim() || !session?.user)
      return;
    // console.log("the measurement:", selectedMeasurement);
    const requestData = {
      measurementType: selectedMeasurement.measurementType,
      measurementID: selectedMeasurement.id,
      workerID: parseInt(session?.user?.id),
      resolutionNotes: resolutionNotes,
    };
    // console.log("Request data:", requestData);

    acknowledgeMutation(requestData);

    // Optionally, you can handle the response here
    // console.log("Acknowledgment request sent");

    // Close the modal
    setIsModalOpen(false);
  };

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
    resolutionNotes: item.resolutionNotes || "No notes available", // Assuming `resolutionNotes` exists in the API response
  }));

  const updatedColumns: ColumnDef<MeasurementRow, unknown>[] = [
    ...MeasurementColumns,
    {
      id: "actions",
      header: "Meðhöndlun",
      cell: ({ row }) => {
        const item = row.original as unknown as PatientMeasurement;
        return (
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
            onClick={() => handleSelectClick(item)}
          >
            Skrá meðhöndlun
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
        title="Bæta við meðhöndlun"
      >
        <div className="flex flex-col space-y-4">
          <Textarea
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Skrifaðu meðhöndlun hér..."
            className="w-full h-32 border border-gray-300 rounded-md p-2"
          />
          <button
            className="px-4 py-2 bg-primary text-white rounded"
            onClick={handleSubmit}
            disabled={!resolutionNotes.trim()}
          >
            Skrá
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Warnings;
