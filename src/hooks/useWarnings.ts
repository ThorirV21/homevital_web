import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RawWarning } from "@/types/clientTypes";

const useWarnings = () => {
  const { data, error, isLoading } = useQuery<RawWarning>({
    queryKey: ["warnings"],
    queryFn: () => api.get("measurements/warnings"),
    refetchInterval: 30000,
  });

  return { data, error, isLoading };
};

export { useWarnings };
