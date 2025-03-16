import { useQuery } from "@tanstack/react-query";
import { fetchHealthcareWorkers } from "@/services/api";

const useHealthcareWorkers = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["workers"],
    queryFn: fetchHealthcareWorkers,
    staleTime: 60000,
  });
  if (error) {
    console.log("Error fetching workers: ", error);
    return { data: [], error, isLoading };
  }

  return { data, error, isLoading };
};

export { useHealthcareWorkers };
