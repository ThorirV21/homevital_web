import { useMemo, useState } from "react";
import ClientForm from "./clientForm";
import { useClients } from "@/hooks/useClients";
import Loading from "../loading";
import { useTeams } from "@/hooks/useTeams";
import { Client } from "@/types/clientTypes";
import { Button } from "../ui/button";
import {
  clientInfoColumns,
  ClientInfoRow,
} from "../dataTable/clientInfoColumns";
import DataTable from "../dataTable/dataTable";
import { ColumnFiltersState } from "@tanstack/react-table";
import useSession from "@/hooks/useSession";

const ClientsView = () => {
  const [open, setOpen] = useState(false);
  const { data: rawClients, isLoading, error } = useClients();
  const { teams, teamsLoading, teamsError } = useTeams();
  const [activeButton, setActiveButton] = useState<string>("Allt");
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { session } = useSession();

  const patients = useMemo(() => {
    return rawClients ? rawClients.data : [];
  }, [rawClients]);

  if (isLoading || teamsLoading) {
    return <Loading />;
  }

  if (error || teamsError) {
    return <div>Error: {error?.message || teamsError?.message}</div>;
  }

  const handleClickClient = (client: ClientInfoRow) => {
    const clientDTO = patients.find((p) => p.id === client.id);
    setCurrentClient(clientDTO || null);
    setOpen(true);
  };

  const handleClickCreate = () => {
    setCurrentClient(null);
    setOpen(true);
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
        setColumnFilters([{ id: "team", value: teamNames }]);
        console.log(columnFilters);
      },
    },
  ];

  const clientRows: ClientInfoRow[] = patients.map((patient) => ({
    ...patient,
    team: teams?.find((team) => team.id === patient.teamID)?.name || "",
  }));

  return (
    <div className="flex flex-col h-full">
      <DataTable
        columns={clientInfoColumns}
        data={clientRows}
        name="Sjúklingar"
        buttons={buttons}
        onRowClick={handleClickClient}
      />
      <div className="flex flex-row w-full justify-end py-4 px-4 mt-auto">
        <Button onClick={handleClickCreate}>Bæta við</Button>
      </div>
      <ClientForm open={open} setOpen={setOpen} client={currentClient} />
    </div>
  );
};

export default ClientsView;
