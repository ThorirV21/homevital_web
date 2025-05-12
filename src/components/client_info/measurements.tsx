import { useClientMeasurements } from "@/hooks/useClients";
import { PatientMeasurement } from "@/types/types";
import { useMemo, useState } from "react";
import Loading from "@/components/loading";
import DataTable from "../dataTable/dataTable";
import {
  MeasurementColumns,
  MeasurementRow,
} from "../dataTable/measurementsColumns";

const Measurements = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useClientMeasurements(id);
  //const [view, setView] = useState("registered");
  const [currentData, setCurrentData] = useState<PatientMeasurement[]>([]);

  const measurements = useMemo(() => {
    return data ? data.data : [];
  }, [data]);

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
  const rows: MeasurementRow[] = measurements.map((measurement) => ({
    id: measurement.id,
    measurementDate: measurement.measurementDate,
    measurementType: measurement.measurementType,
    measurementValues: measurement.measurementValues,
    status: measurement.measurementValues.status,
  }));

  if (!currentData) {
    setCurrentData(measurements);
  }

  console.table(rows);

  return (
    <div className="flex flex-col h-full">
      <DataTable columns={MeasurementColumns} data={rows} name="Mælingar" />
    </div>
  );
};

export default Measurements;
