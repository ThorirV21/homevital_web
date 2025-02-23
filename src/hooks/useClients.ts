import { useQuery } from "@tanstack/react-query";
import {
  fetchClients,
  fetchClientDetails,
  fetchClientMeasurements,
} from "@/services/api";

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
  } = useQuery({
    queryKey: ["clientDetails", id],
    queryFn: () => (id ? fetchClientDetails(id) : Promise.resolve(null)),
    staleTime: 60000,
  });
  if (error) {
    return { patientDetails: null, error, isLoading };
  }
  return { patientDetails, error, isLoading };
};

const useClientMeasurements = (id: string) => {
  const {
    data: measurements,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["clientMeasurements", id],
    queryFn: () => (id ? fetchClientMeasurements(id) : Promise.resolve(null)),
  });
  if (error) {
    return { measurements: null, error, isLoading };
  }
  return { measurements, error, isLoading };
};

export { useClients, useClientDetails, useClientMeasurements };
