"use client";
import { useWarnings } from "@/hooks/useWarnings";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { warningColumns, Warning } from "@/components/dataTable/warningColumns";
import DataTable from "@/components/dataTable/dataTable";
import { useClients } from "@/hooks/useClients";
import { WarningList } from "@/types/clientTypes";
import { useTeams } from "@/hooks/useTeams";
import { Team } from "@/types/teamTypes";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useState, useMemo } from "react";
import useSession from "@/hooks/useSession";

const Alarms = () => {
  const { data: rawWarnings, isLoading, error } = useWarnings();
  const {
    data: rawClients,
    isLoading: isLoadingClients,
    error: errorClients,
  } = useClients();
  const { teams, teamsLoading, teamsError } = useTeams();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { session } = useSession();

  const patients = useMemo(() => {
    return rawClients ? rawClients.data : [];
  }, [rawClients]);

  const data = useMemo(() => {
    return rawWarnings ? rawWarnings.data : [];
  }, [rawWarnings]);

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
        setColumnFilters([
          {
            id: "team",
            value: session?.user?.groups.map(
              (group) => teams?.find((team) => team.id === group)?.name
            ),
          },
        ]),
    },
    {
      label: "Rétt yfir mörkum",
      selected: false,
      onClick: () => setColumnFilters([{ id: "status", value: ["Raised"] }]),
    },
    {
      label: "Utan marka",
      selected: false,
      onClick: () =>
        setColumnFilters([{ id: "status", value: ["High", "Critical"] }]),
    },
  ];

  const warnings: Warning[] = (data ?? []).map((alarm: WarningList) => {
    const client = patients?.find((patient) => patient.id === alarm.patientID);
    const team = teams?.find((team: Team) => team.id === client?.teamID);
    return {
      ...alarm,
      clientName: client?.name,
      team: team?.name ?? "",
      name: client?.name ?? "",
      status: alarm.measurementValues.status,
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
