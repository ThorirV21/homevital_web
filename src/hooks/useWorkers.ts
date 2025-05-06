import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { WorkerDTO, RawWorker } from "@/types/types";

const useHealthcareWorkers = () => {
  const { data, error, isLoading, refetch } = useQuery<RawWorker>({
    queryKey: ["workers"],
    queryFn: () => api.get("/healthcareworkers"),
    staleTime: 60000,
  });

  return { data, error, isLoading, refetch };
};

const useHealthcareWorkerMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (worker: WorkerDTO) => api.post("healthcareworkers", worker),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (worker: WorkerDTO) =>
      api.patch(`healthcareworkers/${worker.id}`, worker),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
    onError: (error) => {
      console.error("Error updating worker:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`healthcareworkers/${id}`),
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
  } = useQuery<WorkerDTO>({
    queryKey: ["workers", id],
    queryFn: () => api.get(`healthcareworkers/${id}`),
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
