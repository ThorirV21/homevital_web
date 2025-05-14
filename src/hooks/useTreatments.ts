import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TreatmentPost, TreatmentType } from "@/types/treatmentTypes";

const useTreatment = (id: string) => {
  const { data, error, isLoading } = useQuery<TreatmentType[]>({
    queryKey: ["treatments", id],
    queryFn: () => api.get(`patientplans/${id}`),
  });
  if (error) {
    return { data: null, error, isLoading };
  }
  return { data, error, isLoading };
};

const useTreatmentMutations = (id: string) => {
  const queryClient = useQueryClient();

  const {
    mutate: createMutation,
    isPending: isCreating,
    isSuccess: isCreated,
  } = useMutation({
    mutationFn: (data: TreatmentPost) => api.post("patientplans", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientTreatments", id] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return { createMutation, isCreating, isCreated };
};

const usePatientTreatments = (id: string) => {
  const { data, error, isLoading } = useQuery<TreatmentType[]>({
    queryKey: ["patientTreatments", id],
    queryFn: () => api.get(`patientplans/patient/${id}`),
  });
  if (error) {
    return { data: [], error, isLoading };
  }
  return { data, error, isLoading };
};

export { useTreatment, useTreatmentMutations, usePatientTreatments };
