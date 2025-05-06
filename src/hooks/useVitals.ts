import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transformVitalData } from "@/services/transformData";
import { api } from "@/lib/api";
import { RawVitalRanges, VitalPatch } from "@/types/vitals";
import { transformForApi } from "@/services/transformData";

const useClientVitalRanges = (id: number) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["vitalRanges", id],
    queryFn: () => api.get(`vitalrange/${id}`),
    staleTime: 60000,
  });

  const vitalRanges = data ? transformVitalData(data as RawVitalRanges) : [];

  return { vitalRanges, error, isLoading, refetch };
};

const useVitalRangeMutations = (id: number) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: VitalPatch) =>
      api.patch(
        `vitalrange/${data.type}/${id}`,
        transformForApi({
          id: data.id,
          patientId: data.clientId,
          name: data.type,
          ranges: data.data,
          distolicRanges: data?.distolicRanges,
        })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vitalRanges", id] });
    },
  });

  return { updateMutation };
};
export { useClientVitalRanges, useVitalRangeMutations };
