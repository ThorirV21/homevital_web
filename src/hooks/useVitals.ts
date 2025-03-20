import { useQuery } from "@tanstack/react-query";
import { fetchVitalRanges } from "@/services/api";
import { transformVitalData } from "@/services/transformData";

const useClientVitalRanges = (id: number) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["vitalRanges", id],
    queryFn: () => (id ? fetchVitalRanges(id) : Promise.resolve(null)),
    staleTime: 60000,
  });

  const vitalRanges = [...transformVitalData(data)];

  return { vitalRanges, error, isLoading, refetch };
};

export { useClientVitalRanges };
