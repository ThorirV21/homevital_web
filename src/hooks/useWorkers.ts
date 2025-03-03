import { useQuery } from "@tanstack/react-query";
import { fetchHealthcareWorkers } from "@/services/api";

const useHealthcareWorkers = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchHealthcareWorkers,
    staleTime: 60000,
  });
  if (error) {
    console.log("Error fetching clients: ", error);
    return { data: [], error, isLoading };
  }

  return { data, error, isLoading };
};

export { useHealthcareWorkers };
