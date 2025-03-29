import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchVitalRanges, updateVitalRange } from "@/services/api";
import { transformVitalData } from "@/services/transformData";

const useClientVitalRanges = (id: number) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["vitalRanges", id],
    queryFn: () => (id ? fetchVitalRanges(id) : Promise.resolve(null)),
    staleTime: 60000,
  });

  const vitalRanges = data ? transformVitalData(data) : [];

  return { vitalRanges, error, isLoading, refetch };
};

const useVitalRangeMutations = (id: number) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateVitalRange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vitalRanges", id] });
    },
  });

  return { updateMutation };
};
export { useClientVitalRanges, useVitalRangeMutations };
