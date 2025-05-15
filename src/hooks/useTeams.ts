import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { Team } from "@/types/teamTypes";

export interface TeamPatch {
  id: number;
  name?: string;
  teamLeaderID?: number;
}

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

  const {
    mutate: createTeam,
    isPending: isCreatingTeam,
    isSuccess: isSuccessCreateTeam,
    reset: resetCreateTeam,
  } = useMutation({
    mutationFn: (team: TeamPatch) => api.post("teams", team),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const {
    mutate: updateTeam,
    isPending: isUpdatingTeam,
    isSuccess: isSuccessUpdateTeam,
    reset: resetUpdateTeam,
  } = useMutation({
    mutationFn: (team: TeamPatch) => {
      return api.patch(`teams/${team.id}`, team);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const {
    mutate: deleteTeam,
    isPending: isDeletingTeam,
    isSuccess: isSuccessDeleteTeam,
    reset: resetDeleteTeam,
  } = useMutation({
    mutationFn: (id: string) => api.delete(`teams/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  return {
    createTeam,
    isCreatingTeam,
    isSuccessCreateTeam,
    updateTeam,
    isUpdatingTeam,
    isSuccessUpdateTeam,
    deleteTeam,
    isDeletingTeam,
    isSuccessDeleteTeam,
    resetCreateTeam,
    resetUpdateTeam,
    resetDeleteTeam,
  };
};

export { useTeams, useTeamMutation };
