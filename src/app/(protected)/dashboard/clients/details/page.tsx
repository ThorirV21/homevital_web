"use client";
import { useSearchParams } from "next/navigation";
import { useClientDetails } from "@/hooks/useClients";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Measurements from "@/components/client_info/measurements";
import Treatment from "@/components/client_info/treatment";
import Warnings from "@/components/client_info/warnings";
import Vitals from "@/components/client_info/vitals";
import Bell from "@/components/icons/bell";
import Loading from "@/components/loading";
import { redirect } from "next/navigation";

const ClientDetailsContent: React.FC = () => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("id");
  const idString = clientId ? clientId : "";
  const { patientDetails, isLoading, error } = useClientDetails(idString);
  const [currentView, setCurrentView] = useState("vitals"); // TODO: change this back to "measurements"

  if (!clientId) {
    return <></>;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { name, address, teamID } = patientDetails;

  const handleExit = () => {
    redirect("/dashboard/clients/list");
  };

  return (
    <div className="flex flex-col h-full" key={patientDetails?.id || "default"}>
      <div className="flex flex-shrink-0">
        <div className="p-4 w-1/3">
          <h1 className="font-bold">Nafn:</h1>
          <p>{name}</p>
        </div>
        <div className="p-4 w-1/3">
          <h1 className="font-bold">Heimilisfang:</h1>
          <p>{address}</p>
        </div>
        <div className="p-4 w-1/3 flex with-auto justify-between">
          <div className="w-full">
            <Badge className="bg-white text-foreground border-foreground">
              <p className="text-base">{teamID}</p>
            </Badge>
          </div>
          <div className="flex flex-col w-full items-end">
            <Button
              className="bg-transparent border-none shadow-none hover:bg-transparent p-0"
              onClick={handleExit}
            >
              <Image
                src="/nav_icons/Close.svg"
                alt="Close"
                width={25}
                height={25}
              />
            </Button>
            {/*             <Image
              src="/alarm_icons/Bell.svg"
              alt="alarm"
              width={25}
              height={25}
              className="fill-current"
            /> */}
            <Bell className="w-7 h-7" />
          </div>
        </div>
      </div>

      <div className="flex overflow-hidden justify-between bg-background ">
        <button
          className={`border border-black w-1/4 h-full p-1 shadow-black ${currentView === "measurements" ? "shadow-inner" : "hover:shadow-md"}`}
          onClick={() => setCurrentView("measurements")}
        >
          Mælingar
        </button>
        <button
          className={`border border-black w-1/4 h-full p-1 shadow-black ${currentView === "treatment" ? "shadow-inner" : "hover:shadow-md"}`}
          onClick={() => setCurrentView("treatment")}
        >
          Meðferðaráætlun
        </button>
        <button
          className={`border border-black w-1/4 h-full p-1 shadow-black ${currentView === "warnings" ? "shadow-inner" : "hover:shadow-md"}`}
          onClick={() => setCurrentView("warnings")}
        >
          Viðvaranir
        </button>
        <button
          className={`border border-black w-1/4 h-full p-1 shadow-black ${currentView === "vitals" ? "shadow-inner" : "hover:shadow-md"}`}
          onClick={() => setCurrentView("vitals")}
        >
          Lífsmörk
        </button>
      </div>
      {currentView === "measurements" && <Measurements id={clientId} />}
      {currentView === "treatment" && <Treatment />}
      {currentView === "warnings" && <Warnings />}
      {currentView === "vitals" && <Vitals />}
    </div>
  );
};

const ClientDetailsPage: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ClientDetailsContent />
    </Suspense>
  );
};

export default ClientDetailsPage;
