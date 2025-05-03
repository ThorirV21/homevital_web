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

const Alarms = () => {
  const { data, isLoading, error } = useAlarms();
  const {
    patients,
    isLoading: isLoadingClients,
    error: errorClients,
  } = useClients();
  const { teams, teamsLoading, teamsError } = useTeams();

  if (isLoading || isLoadingClients || teamsLoading) {
    return <Loading />;
  }

  if (error || errorClients || teamsError) {
    return <Error />;
  }

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
      <DataTable columns={warningColumns} data={warnings} name="Viðvaranir" />
    </div>
  );
};

export default Alarms;
