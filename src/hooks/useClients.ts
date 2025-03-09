import { useQuery } from "@tanstack/react-query";
import {
  fetchClients,
  fetchClientDetails,
  fetchClientMeasurements,
} from "@/services/api";

const refetchInterval = 1000;

const useClients = () => {
  const {
    data: patients,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
    staleTime: 60000,
  });
  if (error) {
    console.log("Error fetching clients: ", error);
    return { patients: [], error, isLoading };
  }

  return { patients, error, isLoading };
};

const useClientDetails = (id: string) => {
  const {
    data: patientDetails,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["clientDetails", id],
    queryFn: () => (id ? fetchClientDetails(id) : Promise.resolve(null)),
    staleTime: 60000,
  });

  return { patientDetails, error, isLoading, refetch };
};

const useClientMeasurements = (id: string) => {
  const {
    data: measurements,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["clientMeasurements", id],
    queryFn: () => (id ? fetchClientMeasurements(id) : Promise.resolve(null)),
    staleTime: 0,
    refetchInterval: refetchInterval,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    select: (data) => {
      console.log("New Data from Query:", data);
      return data;
    },
  });
  if (error) {
    return { measurements: null, error, isLoading, refetch };
  }

  return { measurements, error, isLoading, refetch };
};

export { useClients, useClientDetails, useClientMeasurements };
