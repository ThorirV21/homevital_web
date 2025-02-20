"use client";
import { useSearchParams } from "next/navigation";
import { useClientDetails } from "@/hooks/useClients";
import { Suspense } from "react";

const ClientDetailsContent: React.FC = () => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("id");
  const idString = clientId ? clientId : "";
  const clientDetails = useClientDetails(idString);

  if (!clientId) {
    return <></>;
  }

  console.log(clientDetails);

  return (
    <div className="">
      <h1>Client Details {clientId}</h1>
    </div>
  );
};

const ClientDetailsPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientDetailsContent />
    </Suspense>
  );
};

export default ClientDetailsPage;
