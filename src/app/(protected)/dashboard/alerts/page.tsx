"use client";
import { useAlarms } from "@/hooks/useAlarms";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { warningColumns, Warning } from "@/components/dataTable/warningColumns";
import DataTable from "@/components/dataTable/dataTable";
import { useClients } from "@/hooks/useClients";
import { RawWarning } from "@/types/clientTypes";
import { useTeams } from "@/hooks/useTeams";
import { Team } from "@/types/teamTypes";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useState } from "react";

const Alarms = () => {
  const { data, isLoading, error } = useAlarms();
  const {
    patients,
    isLoading: isLoadingClients,
    error: errorClients,
  } = useClients();
  const { teams, teamsLoading, teamsError } = useTeams();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  if (isLoading || isLoadingClients || teamsLoading) {
    return <Loading />;
  }

  if (error || errorClients || teamsError) {
    return <Error />;
  }

  const buttons = [
    {
      label: "Allt",
      selected: false,
      onClick: () => setColumnFilters([]),
    },
    {
      label: "Mín teymi",
      selected: false,
      onClick: () =>
        setColumnFilters([{ id: "team", value: ["Team A", "Team B"] }]),
    },
    {
      label: "Utan marka",
      selected: false,
      onClick: () => setColumnFilters([{ id: "team", value: ["Utan marka"] }]),
    },
  ];

  const warnings: Warning[] = data?.map((alarm: RawWarning) => {
    const client = patients?.find((patient) => patient.id === alarm.patientID);
    const team = teams?.find((team: Team) => team.id === client?.teamID);
    return {
      ...alarm,
      clientName: client?.name,
      team: team?.name,
      name: client?.name,
    };
  });

  console.log(warnings);

  return (
    <div className="flex flex-row bg-background p-4 h-full">
      <DataTable
        columns={warningColumns}
        data={warnings}
        name="Viðvaranir"
        buttons={buttons}
        setColumnFilters={setColumnFilters}
        columnFilters={columnFilters}
      />
    </div>
  );
};

export default Alarms;
