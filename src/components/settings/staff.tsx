import { useHealthcareWorkers } from "@/hooks/useWorkers";

import { WorkerDTO } from "@/types/types";
import { Button } from "@/components/ui/button";
import Loading from "../loading";
import { useMemo, useState } from "react";
import StaffForm from "./staffForm";
import { useTeams } from "@/hooks/useTeams";
import { Team } from "@/types/teamTypes";
import DataTable from "../dataTable/dataTable";
import { workerColumns, WorkerRow } from "../dataTable/workerColumns";
import { ColumnFiltersState } from "@tanstack/react-table";
import useSession from "@/hooks/useSession";
const StaffView = () => {
  const { data: rawWorkers, error, isLoading } = useHealthcareWorkers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [worker, setWorker] = useState<WorkerDTO | null>(null);
  const { teams, teamsLoading } = useTeams();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [activeButton, setActiveButton] = useState<string>("Allt");
  const { session } = useSession();
  const data = useMemo(() => {
    return rawWorkers ? rawWorkers.data : [];
  }, [rawWorkers]);

  if (isLoading || teamsLoading) {
    return <Loading />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No staff found</div>;
  }

  const handleClickWorker = (worker: WorkerRow) => {
    const workerDTO = data.find((w: WorkerDTO) => w.id === worker.id);
    setWorker(workerDTO || null);
    setDialogOpen(true);
  };

  const handleClickCreate = () => {
    setWorker(null);
    setDialogOpen(true);
  };

  const buttons = [
    {
      label: "Allt",
      selected: activeButton === "Allt",
      onClick: () => {
        setActiveButton("Allt");
        if (columnFilters.length > 0) {
          setColumnFilters([]);
        }
      },
    },
    {
      label: "Mín teymi",
      selected: activeButton === "Mín teymi",
      onClick: () => {
        setActiveButton("Mín teymi");
        const teamNames = session?.user?.groups.map(
          (group) => teams?.find((team) => team.id === group)?.name
        );
        console.log(teamNames);
        setColumnFilters([{ id: "teamNames", value: teamNames }]);
        console.log(columnFilters);
      },
    },
  ];

  const workerRows: WorkerRow[] = data.map((worker: WorkerDTO) => ({
    ...worker,
    teamNames: worker.teamIDs.map(
      (team: number) => teams?.find((t: Team) => t.id === team)?.name || ""
    ),
  }));

  return (
    <div className="flex flex-col h-full">
      <DataTable
        columns={workerColumns}
        data={workerRows}
        name="Starfsfólk"
        buttons={buttons}
        setColumnFilters={setColumnFilters}
        columnFilters={columnFilters}
        onRowClick={handleClickWorker}
      />
      <div className="ms-auto mt-auto p-4">
        <Button className="mt-4" onClick={handleClickCreate}>
          Bæta við starfsfólki
        </Button>
      </div>
      <StaffForm open={dialogOpen} setOpen={setDialogOpen} staff={worker} />
    </div>
  );
};

export default StaffView;
