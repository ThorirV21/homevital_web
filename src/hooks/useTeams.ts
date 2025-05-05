import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCreateTeam,
  fetchDeleteTeam,
  fetchUpdateTeam,
} from "@/services/api";
import { api } from "@/lib/api";
import { Team } from "@/types/teamTypes";

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
    mutationFn: fetchCreateTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const { mutate: updateTeam, isPending: isUpdatingTeam } = useMutation({
    mutationFn: fetchUpdateTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const { mutate: deleteTeam, isPending: isDeletingTeam } = useMutation({
    mutationFn: fetchDeleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
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
