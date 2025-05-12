import { useTeams } from "@/hooks/useTeams";
import Loading from "@/components/loading";
import { Team } from "@/types/teamTypes";
import { useMemo, useState } from "react";
import TeamForm from "./teamForm";

import { Button } from "../ui/button";
import DataTable from "../dataTable/dataTable";
import { teamColumns, TeamRow } from "../dataTable/teamColumns";
import { useHealthcareWorkers } from "@/hooks/useWorkers";
import { WorkerDTO } from "@/types/types";
import { useClients } from "@/hooks/useClients";
import { Client } from "@/types/clientTypes";
import { TeamConfig } from "@/components/settings/teamForm";

const Teams = () => {
  const { teams, teamsLoading, teamsError } = useTeams();
  const [open, setOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<TeamConfig>({
    header: "Teymi",
    infoText: "Breyta upplýsingum og vistaðu breytingar.",
    team: null,
    workers: [],
  });
  const {
    data,
    isLoading: workersLoading,
    error: workersError,
  } = useHealthcareWorkers();
  const {
    data: clientsData,
    isLoading: clientsLoading,
    error: clientsError,
  } = useClients();

  const workers = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const clients = useMemo(() => {
    return clientsData?.data || [];
  }, [clientsData]);

  if (teamsLoading || workersLoading || clientsLoading) {
    return <Loading />;
  }

  if (teamsError || workersError || clientsError) {
    return (
      <div>
        Error:{" "}
        {teamsError?.message || workersError?.message || clientsError?.message}
      </div>
    );
  }

  const handleTeamClick = (team: TeamRow) => {
    const teamData = teams?.find((t: Team) => t.id === team.id);

    setDialogConfig({
      header: "Breyta teymi",
      infoText: "Breyttu upplýsingum um teymið og vistaðu.",
      team: teamData || null,
      workers: workers.sort((a, b) => a.name.localeCompare(b.name)),
    });
    setOpen(true);
  };

  const handleClickCreate = () => {
    setDialogConfig({
      header: "Teymi",
      infoText: "Skráðu inn upplýsingar um teymið og vistaðu.",
      team: null,
      workers: workers.sort((a, b) => a.name.localeCompare(b.name)),
    });
    setOpen(true);
  };

  const teamRows: TeamRow[] =
    teams?.map((team: Team) => ({
      id: team.id,
      name: team.name,
      workers: team.workerIDs.map(
        (worker: number) =>
          workers?.find((w: WorkerDTO) => w.id === worker)?.name || ""
      ),
      patients: team.patientIDs.map(
        (patient: number) =>
          clients?.find((c: Client) => c.id === patient)?.name || ""
      ),
    })) || [];

  return (
    <div className="flex flex-col w-full h-full">
      <DataTable
        columns={teamColumns}
        data={teamRows}
        name="Teymi"
        onRowClick={handleTeamClick}
      />
      <TeamForm open={open} setOpen={setOpen} config={dialogConfig} />
      <div className="ms-auto mt-auto p-4">
        <Button className="mt-4" onClick={handleClickCreate}>
          Bæta við teymi
        </Button>
      </div>
    </div>
  );
};

export default Teams;
