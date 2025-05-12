import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Client, RawClient } from "@/types/clientTypes";
import { api } from "@/lib/api";
import { RawPatientMeasurements } from "@/types/types";

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
  const { data, error, isLoading, refetch } = useQuery<RawPatientMeasurements>({
    queryKey: ["clientMeasurements", id],
    queryFn: () => api.get(`measurements/${id}`),
    staleTime: 10000,
    refetchInterval: refetchInterval,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  return { data, error, isLoading, refetch };
};

const useClientWarningAcknowledge = (id: string) => {
  const queryClient = useQueryClient();

  const { mutate: acknowledgeMutation, isSuccess } = useMutation({
    mutationFn: (data: {
      measurementType: string;
      measurementID: number;
      workerID: number;
      resolutionNotes: string;
    }) => {
      console.log("Data sent:", data);
      return api.post("measurements/acknowledge", data).then((response) => {
        console.log("API response:", response);
        return response;
      });
    },
    onSuccess: () => {
      console.log("Acknowledgment successful", isSuccess);
      queryClient.invalidateQueries({ queryKey: ["clientMeasurements", id] });
    },
  });

  return { acknowledgeMutation };
};

export {
  useClients,
  useClientDetails,
  useClientMeasurements,
  useClientMutations,
  useClientWarningAcknowledge,
};
