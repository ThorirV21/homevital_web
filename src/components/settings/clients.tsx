import { useMemo, useState } from "react";
import ClientForm, { DialogConfig } from "./clientForm";
import { useClients } from "@/hooks/useClients";
import Loading from "../loading";
import { useTeams } from "@/hooks/useTeams";
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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { session } = useSession();
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    showSsn: true,
    client: null,
    header: "Bæta við sjúklingi",
    infoText: "Breyta upplýsingum og vistaðu breytingar.",
  });

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
    setDialogConfig({
      showSsn: false,
      client: clientDTO || null,
      header: "Breyta sjúklingi",
      infoText: "Breyttu upplýsingum um sjúklinginn og vistaðu.",
    });
    setOpen(true);
  };

  const handleClickCreate = () => {
    setDialogConfig({
      showSsn: true,
      client: null,
      header: "Bæta við sjúklingi",
      infoText: "Skráðu inn upplýsingar um sjúklinginn og vistaðu.",
    });
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
      <div className="h-[calc(100vh-17rem)] overflow-scroll">
        <DataTable
          columns={clientInfoColumns}
          data={clientRows}
          name="Sjúklingar"
          buttons={buttons}
          onRowClick={handleClickClient}
        />
      </div>
      <div className="flex flex-row w-full justify-end py-4 px-4 mt-auto">
        <Button onClick={handleClickCreate}>Bæta við</Button>
      </div>
      <ClientForm config={dialogConfig} open={open} setOpen={setOpen} />
    </div>
  );
};

export default ClientsView;
