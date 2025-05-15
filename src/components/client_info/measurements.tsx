import { useClientMeasurements } from "@/hooks/useClients";
import { useState } from "react";
import Loading from "@/components/loading";
import DataTable from "../dataTable/dataTable";
import {
  MeasurementColumns,
  MeasurementRow,
} from "../dataTable/measurementsColumns";
import Modal from "../ui/modal"; // Import the Modal component
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

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
        const hasNotes = !!item.resolutionNotes;
        const isWarning = item.status === "High" || item.status === "Raised";
        const isNotAcked = !item.isAcknowledged;

        return (
          <>
            {!isWarning ? (
              <></>
            ) : isNotAcked && !hasNotes ? (
              <Badge variant="outline">Óskráð</Badge>
            ) : (
              <Button
                style={{ height: "1.5rem" }}
                size={"sm"}
                onClick={() => handleOpenModal(item)}
              >
                Sýna
              </Button>
            )}
          </>
        );
      },
    },
  ];

  console.table(rows);

  return (
    <div className="flex-col h-full flex-1 overflow-hidden">
      <div className="h-[calc(100vh-18rem)] overflow-auto border border-muted rounded-md min-w-full">
        <DataTable
          columns={columns}
          data={rows}
          name={""}
          showHeader={false}
          maxTableHeight=""
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Meðhöndlun">
        <p>{selectedNotes}</p>
      </Modal>
    </div>
  );
};

export default Measurements;
