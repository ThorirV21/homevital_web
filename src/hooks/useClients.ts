import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Client, RawClient } from "@/types/clientTypes";
import { PatientMeasurement } from "@/types/types";
import { api } from "@/lib/api";

const refetchInterval = 1000 * 15;

const useClients = () => {
  const { data, error, isLoading } = useQuery<RawClient>({
    queryKey: ["clients"],
    queryFn: () => api.get("patients"),
    staleTime: 10000,
  });

  return { data, error, isLoading };
};

const useClientMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (client: Client) => api.post("patients", client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (client: Client) => api.patch(`patients/${client.id}`, client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`patients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
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
    queryFn: () => api.get(`patients/${id}`),

    staleTime: 60000,
  });

  return {
    patientDetails: patientDetails as Client,
    error,
    isLoading,
    refetch,
  };
};

const useClientMeasurements = (id: string) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["clientMeasurements", id],
    queryFn: () => api.get(`measurements/${id}`),
    staleTime: 10000,
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

export {
  useClients,
  useClientDetails,
  useClientMeasurements,
  useClientMutations,
};
