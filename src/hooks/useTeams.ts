import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { Team, TeamPost } from "@/types/teamTypes";

const useTeams = () => {
  const {
    data: teams,
    isLoading: teamsLoading,
    error: teamsError,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const response: Team[] = await api.get("/teams");
      return response;
    },
  });

  return { teams, teamsLoading, teamsError };
};

const useTeamMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: createTeam, isPending: isCreatingTeam } = useMutation({
    mutationFn: (team: TeamPost) => api.post("teams", team),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const { mutate: updateTeam, isPending: isUpdatingTeam } = useMutation({
    mutationFn: (team: Team) => api.patch(`teams/${team.id}`, team),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const { mutate: deleteTeam, isPending: isDeletingTeam } = useMutation({
    mutationFn: (id: string) => api.delete(`teams/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      console.log("Team deleted");
    },
  });

  return {
    createTeam,
    isCreatingTeam,
    updateTeam,
    isUpdatingTeam,
    deleteTeam,
    isDeletingTeam,
  };
};

export { useTeams, useTeamMutation };
