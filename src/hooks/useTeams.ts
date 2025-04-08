import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTeams,
  fetchCreateTeam,
  fetchDeleteTeam,
  fetchUpdateTeam,
} from "@/services/api";

const useTeams = () => {
  const {
    data: teams,
    isLoading: teamsLoading,
    error: teamsError,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: () => fetchTeams(),
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
