"use client";

import * as React from "react";
import { useClients } from "@/hooks/useClients";
import Loading from "@/components/loading";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Error from "@/components/error";
import { Suspense } from "react";
import { useTeams } from "@/hooks/useTeams";
import { Team } from "@/types/teamTypes";
import { clientColumns, ClientRow } from "@/components/dataTable/clientColumns";
import DataTable from "@/components/dataTable/dataTable";
import { ColumnFiltersState } from "@tanstack/react-table";
import useSession from "@/hooks/useSession";

const ClientListContent = () => {
  const router = useRouter();
  const { data: rawClients, error, isLoading } = useClients();
  const { teams, teamsLoading, teamsError } = useTeams();
  const { session } = useSession();

  const patients = useMemo(() => {
    return rawClients ? rawClients.data : [];
  }, [rawClients]);

  const [selectedPatient, setSelectedPatient] = useState<ClientRow | null>(
    null
  );
  const searchParams = useSearchParams();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setSelectedPatient(
        (patients?.find(
          (patient) => patient.id === parseInt(id as string)
        ) as ClientRow) || null
      );
    }
  }, [searchParams, patients]);

  if (isLoading || teamsLoading) {
    return <Loading />;
  }

  if (error || teamsError) {
    return <Error />;
  }

  const buttons = [
    {
      label: "Allt",
      selected: false,
      className: "bg-accent",
      onClick: () => {
        if (columnFilters.length === 0) return;
        setColumnFilters([]);
      },
    },
    {
      label: "Mín teymi",
      selected: false,
      className: "bg-accent",
      onClick: () => {
        const teamValues =
          session?.user?.groups.map(
            (groupID: number) =>
              teams?.find((team: Team) => team.id === groupID)?.name
          ) || [];

        const currentTeamFilter = columnFilters.find(
          (filter) => filter.id === "team"
        );
        if (
          currentTeamFilter &&
          JSON.stringify(currentTeamFilter.value) === JSON.stringify(teamValues)
        ) {
          return;
        }

        setColumnFilters([
          {
            id: "team",
            value: teamValues,
          },
        ]);
      },
    },
  ];

  const handleClickPatient = (patient: ClientRow) => {
    setSelectedPatient(patient);
    router.push(`?id=${patient.id}`, { scroll: false });
  };

  const clientRows: ClientRow[] = patients?.map((patient) => ({
    ...patient,
    team: teams?.find((team: Team) => team.id === patient.teamID)?.name || "",
  }));

  console.table(clientRows);

  return (
    <div className="flex flex-row bg-background h-full">
      <DataTable
        columns={clientColumns}
        data={clientRows}
        name="Skjólstæðingar"
        onRowClick={handleClickPatient}
        selectedRow={selectedPatient}
        buttons={buttons}
        setColumnFilters={setColumnFilters}
        columnFilters={columnFilters}
      />
    </div>
  );
};

const Clients = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ClientListContent />
    </Suspense>
  );
};

export default Clients;
