import { useQuery } from "@tanstack/react-query";
import { fetchAlarms } from "@/services/api";

const useAlarms = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["alarms"],
    queryFn: fetchAlarms,
    refetchInterval: 30000,
  });

  if (error) {
    return { alarms: [], error, isLoading };
  }

  return { data, error, isLoading };
};

export { useAlarms };
