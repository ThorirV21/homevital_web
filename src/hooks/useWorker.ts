import { useQuery } from "@tanstack/react-query";

const fetchTeams = async (userId: number) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      id: String(userId),
      name: "Sárateymi",
    },
    {
      id: String(userId + 1),
      name: "Lungnateymi",
    },
    {
      id: String(userId + 2),
      name: "Hjálparteymi",
    },
  ];
};

const useTeams = (userId: number) => {
  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams", userId],
    queryFn: () => fetchTeams(userId),
  });

  return { teams, isLoading };
};

export default useTeams;
