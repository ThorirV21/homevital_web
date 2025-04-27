import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  createHealthcareWorker,
  fetchHealthcareWorkers,
  updateHealthcareWorker,
  deleteHealthcareWorker,
  fetchHealthcareWorker,
} from "@/services/api";

const useHealthcareWorkers = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["workers"],
    queryFn: fetchHealthcareWorkers,
    staleTime: 60000,
  });
  if (error) {
    return { data: [], error, isLoading };
  }

  return { data, error, isLoading, refetch };
};

const useHealthcareWorkerMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createHealthcareWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateHealthcareWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
    onError: (error) => {
      console.error("Error updating worker:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHealthcareWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};

const useHealthcareWorker = (id: string) => {
  const {
    data: worker,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["workers", id],
    queryFn: () => fetchHealthcareWorker(id),
  });
  if (error) {
    return { worker: null, error, isLoading };
  }
  return { worker, error, isLoading };
};

export {
  useHealthcareWorkers,
  useHealthcareWorkerMutations,
  useHealthcareWorker,
};
