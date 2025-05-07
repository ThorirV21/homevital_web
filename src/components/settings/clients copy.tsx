import { useMemo, useState } from "react";
import ClientForm from "./clientForm";
import { useClients } from "@/hooks/useClients";
import { ScrollArea } from "../ui/scroll-area";
import Loading from "../loading";
import { useTeams } from "@/hooks/useTeams";
import { Team } from "@/types/teamTypes";
import { Client } from "@/types/clientTypes";
import { Button } from "../ui/button";

const ClientsView = () => {
  const [open, setOpen] = useState(false);
  const { data: rawClients, isLoading, error } = useClients();
  const { teams, teamsLoading, teamsError } = useTeams();
  const [hoveredPatient, setHoveredPatient] = useState<Client | null>(null);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);

  const patients = useMemo(() => {
    return rawClients ? rawClients.data : [];
  }, [rawClients]);

  if (isLoading || teamsLoading) {
    return <Loading />;
  }

  if (error || teamsError) {
    return <div>Error: {error?.message || teamsError?.message}</div>;
  }

  const handleClickClient = (client: Client) => {
    setCurrentClient(client);
    setOpen(true);
  };

  const handleClickCreate = () => {
    setCurrentClient(null);
    setOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row items-center text-left justify-between border-b border-gray-300 p-3">
        <h3 className="w-1/5 font-bold">Nafn</h3>
        <h3 className="w-1/5 font-bold">Heimilisfang</h3>
        <h3 className="w-1/5 font-bold">Sími</h3>
        <h3 className="w-1/5 font-bold">Staða</h3>
        <h3 className="w-1/5 font-bold">Teymi</h3>
      </div>
      <ScrollArea className="overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            {patients.map((patient) => {
              return (
                <tr
                  key={patient.id}
                  className={`flex flex-row items-center justify-between border-b border-gray-300 p-3 ${hoveredPatient?.id === patient.id ? "bg-gray-100" : ""}`}
                  onMouseEnter={() => setHoveredPatient(patient)}
                  onMouseLeave={() => setHoveredPatient(null)}
                  onClick={() => handleClickClient(patient)}
                >
                  <td className="w-1/5">{patient.name}</td>
                  <td className="w-1/5">{patient.address}</td>
                  <td className="w-1/5">{patient.phone}</td>
                  <td className="w-1/5">{patient.status}</td>
                  <td className="w-1/5">
                    {
                      teams?.find((team: Team) => team.id === patient.teamID)
                        ?.name
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollArea>
      <div className="flex flex-row w-full justify-end py-4 px-4 mt-auto">
        <Button onClick={handleClickCreate}>Bæta við</Button>
      </div>
      <ClientForm open={open} setOpen={setOpen} client={currentClient} />
    </div>
  );
};

export default ClientsView;
