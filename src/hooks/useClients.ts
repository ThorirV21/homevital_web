import { useQuery } from "@tanstack/react-query";
import {
  fetchClients,
  fetchClientDetails,
  fetchClientMeasurements,
} from "@/services/api";
import { Client } from "@/types/clientTypes";
import { PatientMeasurement } from "@/types/types";

const refetchInterval = 10000;

const useClients = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
    staleTime: 10000,
  });
  if (error) {
    return { patients: [], error, isLoading };
  }

  const patients = data as Client[];

  return { patients, error, isLoading };
};

// TODO: Check if this is needed
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
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["clientMeasurements", id],
    queryFn: () => (id ? fetchClientMeasurements(id) : Promise.resolve(null)),
    staleTime: 0,
    refetchInterval: refetchInterval,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const measurements = data as PatientMeasurement[];

  if (error) {
    return { measurements: null, error, isLoading, refetch };
  }

  return { measurements, error, isLoading, refetch };
};

export { useClients, useClientDetails, useClientMeasurements };
