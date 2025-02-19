"use client";
import { useSearchParams } from "next/navigation";
import { useClientDetails } from "@/hooks/useClients";

const ClientDetailsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("id");
  const idString = clientId ? clientId : "";
  const clientDetails = useClientDetails(idString);

  console.log(clientDetails);

  if (!clientId) {
    return <></>;
  }

  return (
    <div className="">
      <h1>Client Details {clientId}</h1>
    </div>
  );
};

export default ClientDetailsPage;
