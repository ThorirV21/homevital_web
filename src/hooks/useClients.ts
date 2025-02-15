import { useQuery } from "@tanstack/react-query";
import { fetchClients, fetchClientDetails } from "@/services/api";

const useClients = () => {
  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
    staleTime: 60000,
  });
  return clients;
};

const useClientDetails = (id: string) => {
  const { data: clientDetails } = useQuery({
    queryKey: ["clientDetails", id],
    queryFn: () => fetchClientDetails(id),
    staleTime: 60000,
  });
  return clientDetails;
};

export { useClients, useClientDetails };
