import { SessionData } from "@/config/session";
import { getSession } from "@/services/session";
import { useQuery } from "@tanstack/react-query";

const useSession = () => {
  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useQuery<SessionData>({
    queryKey: ["session"],
    queryFn: getSession,
  });

  return { session, sessionLoading, sessionError };
};

export default useSession;
