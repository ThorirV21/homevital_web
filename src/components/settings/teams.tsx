import { useTeams } from "@/hooks/useTeams";
import Loading from "@/components/loading";
import { Team } from "@/types/teamTypes";
import { useState } from "react";
import TeamForm from "./teamForm";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";

const Teams = () => {
  const { teams, teamsLoading, teamsError } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [hoveredTeam, setHoveredTeam] = useState<Team | null>(null);
  const [open, setOpen] = useState(false);
  if (teamsLoading) {
    return <Loading />;
  }

  if (teamsError) {
    return <div>Error: {teamsError.message}</div>;
  }

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setOpen(true);
  };

  const handleClickCreate = () => {
    setSelectedTeam(null);
    setOpen(true);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row items-center text-left justify-between border-b border-gray-300 p-3">
        <h3 className="font-bold w-1/3">Starfsmenn</h3>
        <h3 className="font-bold w-1/3">Fjöldi starfsmanna</h3>
        <h3 className="font-bold w-1/3">Fjöldi sjúklinga</h3>
      </div>
      <ScrollArea className="overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            {teams.map((team: Team) => (
              <tr
                key={team.id}
                className={`flex flex-row items-center justify-between border-b border-gray-300 p-3 ${hoveredTeam?.id === team.id ? "bg-gray-100" : ""}`}
                onMouseEnter={() => setHoveredTeam(team)}
                onMouseLeave={() => setHoveredTeam(null)}
                onClick={() => handleTeamClick(team)}
              >
                <td className="w-1/3">{team.name}</td>
                <td className="w-1/3">{team.workerIDs.length}</td>
                <td className="w-1/3">{team.patientIDs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
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
