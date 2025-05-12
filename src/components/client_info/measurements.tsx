import { useClientMeasurements } from "@/hooks/useClients";
import { useState } from "react";
import Loading from "@/components/loading";
import DataTable from "../dataTable/dataTable";
import {
  MeasurementColumns,
  MeasurementRow,
} from "../dataTable/measurementsColumns";
import Modal from "../ui/modal"; // Import the Modal component

const Measurements = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useClientMeasurements(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);

  const handleOpenModal = (row: MeasurementRow) => {
    // check if notes is empty
    const notes =
      typeof row.resolutionNotes === "string"
        ? row.resolutionNotes
        : "No notes available";
    if (!notes) {
      alert("No notes available");
      return;
    }
    setSelectedNotes(notes);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedNotes(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const measurements = data ? data.data : [];

  const rows: MeasurementRow[] = measurements.map((measurement) => ({
    id: measurement.id,
    isAcknowledged: measurement.measurementValues.isAcknowledged,
    measurementDate: measurement.measurementDate,
    measurementType: measurement.measurementType,
    measurementValues: measurement.measurementValues,
    status: measurement.measurementValues.status,
    resolutionNotes: measurement.measurementValues.resolutionNotes || false, // Ensure resolutionNotes is mapped correctly
  }));

  const columns = [
    ...MeasurementColumns,
    {
      id: "notes",
      header: "Meðhöndlun",
      cell: ({ row }: { row: { original: MeasurementRow } }) => {
        const item = row.original;
        const hasNotes = item.resolutionNotes;
        const isWarning = item.status === "High" || item.status === "Raised";
        const isNotAcked = !item.isAcknowledged;

        return (
          <button
            className={`px-2 py-1 rounded ${
              isNotAcked && isWarning
                ? "bg-destructive text-white"
                : hasNotes
                  ? "bg-primary text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => handleOpenModal(item)}
            disabled={!hasNotes}
          >
            {hasNotes ? "Meðhöndlun" : "Meðhöndlun"}
          </button>
        );
      },
    },
  ];

  console.table(rows);

  return (
    <div className="flex flex-col h-full">
      <DataTable columns={columns} data={rows} name={""} />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Meðhöndlun">
        <p>{selectedNotes}</p>
      </Modal>
    </div>
  );
};

export default Measurements;
