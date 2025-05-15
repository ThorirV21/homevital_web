import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
//import { transformVitalData } from "@/services/transformData";
import { api } from "@/lib/api";
import { RawVitalRanges } from "@/types/vitals";

export type VitalRangeMutation = {
  patientID: number;
  type: string;
  data: VitalData;
};

export type VitalData = {
  patientID: number;
  [key: string]: number;
};

const useClientVitalRanges = (id: number) => {
  const {
    data: vitalRanges,
    error,
    isLoading,
    refetch,
  } = useQuery<RawVitalRanges>({
    queryKey: ["vitalRanges", id],
    queryFn: () => api.get(`vitalrange/${id}`),
    staleTime: 60000,
  });

  //const vitalRanges = transformVitalData(data);

  return { vitalRanges, error, isLoading, refetch };
};

const useVitalRangeMutations = (id: number) => {
  const queryClient = useQueryClient();

  const {
    mutate: updateMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (data: VitalRangeMutation) => {
      return api.patch(`vitalrange/${data.type}/${id}`, data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vitalRanges", id] });
    },
  });

  return { updateMutation, isPending, isError, error, isSuccess };
};
export { useClientVitalRanges, useVitalRangeMutations };
