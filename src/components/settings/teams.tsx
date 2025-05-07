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

const Teams = () => {
  const { teams, teamsLoading, teamsError } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [open, setOpen] = useState(false);
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
    setSelectedTeam(teamData || null);
    setOpen(true);
  };

  const handleClickCreate = () => {
    setSelectedTeam(null);
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
      <TeamForm open={open} setOpen={setOpen} team={selectedTeam} />
      <div className="ms-auto mt-auto p-4">
        <Button className="mt-4" onClick={handleClickCreate}>
          Bæta við teymi
        </Button>
      </div>
    </div>
  );
};

export default Teams;
