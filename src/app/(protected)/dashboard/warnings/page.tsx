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
import { PaginationParams } from "@/hooks/useWarnings";

const Alarms = () => {
  // Add a key to force re-render when pagination changes
  const [paginationKey, setPaginationKey] = useState(0);

  const [pagination, setPagination] = useState<PaginationParams>({
    pageSize: 10,
    pageNumber: 1,
  });

  // Log pagination state to track changes
  console.log("Current pagination state:", pagination);

  const {
    data: rawWarnings,
    isLoading,
    error,
    refetch,
  } = useWarnings(pagination);
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

  // Get the total count from the API response
  const totalCount = rawWarnings?.totalCount || 0;

  // Calculate the total number of pages
  const pageCount = Math.ceil(totalCount / (pagination.pageSize || 10));

  console.log(
    "Page count:",
    pageCount,
    "Total count:",
    totalCount,
    "Current page:",
    pagination.pageNumber
  );

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

  // Handle pagination changes from the DataTable
  const handlePageChange = async (pageIndex: number, pageSize: number) => {
    console.log(`Page changed to index ${pageIndex}, size ${pageSize}`);

    const newPagination = {
      pageNumber: pageIndex + 1, // DataTable is 0-indexed, our API is 1-indexed
      pageSize: pageSize,
    };

    console.log("Setting new pagination:", newPagination);

    // Update the pagination state
    setPagination(newPagination);

    // Force a re-render
    setPaginationKey((prevKey) => prevKey + 1);

    // Explicitly refetch data with the new pagination
    setTimeout(() => {
      refetch();
    }, 0);
  };

  return (
    <div className="flex flex-row bg-background p-4 h-full" key={paginationKey}>
      <DataTable
        columns={warningColumns}
        data={warnings}
        name="Viðvaranir"
        buttons={buttons}
        setColumnFilters={setColumnFilters}
        columnFilters={columnFilters}
        usePagination={true}
        onPageChange={handlePageChange}
        totalCount={totalCount}
        initialPage={(pagination.pageNumber || 1) - 1} // Convert 1-indexed to 0-indexed
        initialPageSize={pagination.pageSize || 10}
        manualPagination={true} // Use manual pagination
        pageCount={pageCount} // Provide the explicit page count
      />
    </div>
  );
};

export default Alarms;
