import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RawWarning } from "@/types/clientTypes";

export interface PaginationParams {
  pageSize?: number;
  pageNumber?: number;
}

const useWarnings = (paginationParams?: PaginationParams) => {
  const pageSize = paginationParams?.pageSize ?? 10;
  const pageNumber = paginationParams?.pageNumber ?? 1;

  console.log("useWarnings hook called with:", { pageSize, pageNumber });

  const { data, error, isLoading, refetch } = useQuery<RawWarning>({
    queryKey: ["warnings", pageSize, pageNumber],
    queryFn: () => {
      console.log(
        `Fetching warnings API with pageSize=${pageSize}, pageNumber=${pageNumber}`
      );
      return api.get("measurements/warnings", {
        pageSize: pageSize || 10,
        pageNumber: pageNumber || 1,
      });
    },
    staleTime: 5000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 30000,
  });

  console.log(
    "useWarnings data received:",
    data
      ? {
          totalCount: data.totalCount,
          pageSize: data.pageSize,
          pageNumber: data.pageNumber,
          dataCount: data.data?.length,
        }
      : "No data"
  );

  return { data, error, isLoading, refetch };
};

export { useWarnings };
