"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import StaffView from "@/components/settings/staff";
import Loading from "@/components/loading";

const views = [
  { name: "Starfsmenn", value: "staff" },
  { name: "Teymi", value: "team" },
  { name: "Annað", value: "other" },
];

export default function Settings() {
  const [view, setView] = useState(views[0].value);

  return (
    <div className="flex h-full bg-white">
      <div className="flex flex-col w-1/4 border-r border-black">
        <div className="flex items-center justify-center p-4 border-b border-gray-300">
          <h2 className="text-2xl font-bold">Stillingar</h2>
        </div>
        <div className="flex flex-col pt-3">
          {views.map((v) => (
            <Button
              key={v.value}
              className="rounded-none"
              onClick={() => setView(v.value)}
            >
              {v.name}
            </Button>
          ))}
        </div>
      </div>
      {view === "staff" && <StaffView />}
      {view === "team" && (
        <div className="flex flex-col w-3/4">
          <h2>Teymi</h2>
        </div>
      )}
      {view === "other" && (
        <div className="flex flex-col w-3/4">
          <Loading />
        </div>
      )}
    </div>
  );
}
