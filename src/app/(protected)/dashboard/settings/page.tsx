"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import StaffView from "@/components/settings/staff";
import Teams from "@/components/settings/teams";
import ClientsView from "@/components/settings/clients";

const views = [
  { name: "Starfsmenn", value: "staff" },
  { name: "Teymi", value: "team" },
  { name: "Skjólstæðingar", value: "clients" },
];

export default function Settings() {
  const [view, setView] = useState(views[0].value);

  return (
    <div className="flex w-full h-full flex-col bg-background">
      <div className="flex flex-col w-full px-4 pb-4 border-b">
        <div className="flex flex-row mt-3 p-1 rounded-md bg-buttoncontainer max-w-3xl shadow-md">
          {views.map((v) => (
            <Button
              key={v.value}
              className={`flex-1 shadow-none h-7 ${view === v.value ? "" : "bg-opacity-100"}`}
              onClick={() => setView(v.value)}
            >
              {v.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col h-full">
        {view === "staff" && <StaffView />}
        {view === "team" && <Teams />}
        {view === "clients" && <ClientsView />}
      </div>
    </div>
  );
}
