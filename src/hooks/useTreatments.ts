import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  fetchPatientTreatments,
  fetchTreatments,
  postTreatment,
} from "@/services/api";

const useTreatment = (id: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["treatments", id],
    queryFn: () => fetchTreatments(id),
  });
  if (error) {
    return { data: null, error, isLoading };
  }
  return { data, error, isLoading };
};

const useTreatmentMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: postTreatment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatments"] });
    },
  });

  return { createMutation };
};

const usePatientTreatments = (id: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["patientTreatments", id],
    queryFn: () => fetchPatientTreatments(id),
  });
  if (error) {
    return { data: [], error, isLoading };
  }
  return { data, error, isLoading };
};

export { useTreatment, useTreatmentMutations, usePatientTreatments };
