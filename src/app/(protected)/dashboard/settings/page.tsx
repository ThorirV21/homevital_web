"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import StaffView from "@/components/settings/staff";
import Loading from "@/components/loading";
import Teams from "@/components/settings/teams";
import ClientsView from "@/components/settings/clients";

const views = [
  { name: "Starfsmenn", value: "staff" },
  { name: "Teymi", value: "team" },
  { name: "Skjólstæðingar", value: "clients" },
  { name: "Annað", value: "other" },
];

export default function Settings() {
  const [view, setView] = useState(views[0].value);

  return (
    <div className="flex w-full h-full flex-col bg-white">
      <div className="flex flex-col w-full px-4 pb-4 border-b">
        <div className="flex flex-row gap-2 pt-3">
          {views.map((v) => (
            <Button
              key={v.value}
              className={`rounded-none ${view === v.value ? "" : "opacity-50"}`}
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
        {view === "other" && (
          <div className="flex flex-col w-3/4">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
}
