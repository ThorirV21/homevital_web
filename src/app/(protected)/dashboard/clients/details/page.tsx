"use client";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchClientDetails } from "@/services/api";
import { Suspense } from "react";

const ClientDetails = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Details />
    </Suspense>
  );
};

const Details = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data, error, isLoading } = useQuery({
    queryKey: ["clientDetails", id],
    queryFn: () => fetchClientDetails(String(id)),
    staleTime: 60000,
  });

  if (!id) return null;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // dummy use data to get rid of unused variable warning
  console.log(data);

  return (
    <>
      <div>
        <div>
          <p>Nafn:</p>
          <p>Heimilisfang:</p>
        </div>
      </div>
      <div>
        <h1>prufa</h1>
      </div>
    </>
  );
};

export default ClientDetails;
