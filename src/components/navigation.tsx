"use client";

import React from "react";
import NavButton from "./navButton";
import { useTeams } from "@/hooks/useTeams";
import useSession from "@/hooks/useSession";
import { Team } from "@/types/teamTypes";
import { Skeleton } from "@/components/ui/skeleton";

const elem = [
  {
    name: "Skjólstæðingar",
    logo_path: "/nav_icons/People.svg",
    dashboard_path: "/dashboard/clients",
  },
  {
    name: "Viðvaranir",
    logo_path: "/nav_icons/Alarm.svg",
    dashboard_path: "/dashboard/alerts",
  },
  {
    name: "Stillingar",
    logo_path: "/nav_icons/Settings.svg",
    dashboard_path: "/dashboard/settings",
  },
  {
    name: "Leiðbeiningar",
    logo_path: "/nav_icons/Info.svg",
    dashboard_path: "/dashboard/guidelines",
  },
  {
    name: "Útskrá",
    logo_path: "/nav_icons/Shutdown.svg",
    dashboard_path: "/",
  },
];

const Navigation: React.FC = () => {
  //  const session = await getSession();
  const { session, sessionLoading, sessionError } = useSession();
  const { teams, teamsLoading, teamsError } = useTeams();

  if (sessionError || teamsError) {
    return <div>Error: {sessionError?.message || teamsError?.message}</div>;
  }

  return (
    <nav className="flex justify-between flex-col h-full">
      <ul>
        {elem.map((item, index) => {
          return (
            <NavButton
              key={index}
              title={item.name}
              logo_path={item.logo_path}
              dashboard_path={item.dashboard_path}
            />
          );
        })}
      </ul>
      <div className="p-8 flex flex-col gap-6">
        <div>
          <h6 className="font-bold">Innskráður notandi:</h6>
          {sessionLoading ? (
            <Skeleton className="w-20 h-4" />
          ) : (
            <p>{session?.user?.name}</p>
          )}
        </div>
        <div>
          <h6 className="font-bold">Teymi:</h6>
          {sessionLoading || teamsLoading ? (
            <Skeleton className="w-20 h-4" />
          ) : (
            <p>
              {teams
                .filter((team: Team) => session?.user?.groups.includes(team.id))
                .map((team: Team) => team.name)
                .join(", ")}
            </p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
