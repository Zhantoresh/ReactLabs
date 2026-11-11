import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFlights } from "../services/service.js";
import { flightKeys } from "../services/queryClient.js";


export function useFlightsList(params) {
  const query = useQuery({
    queryKey: flightKeys.list(params),
    queryFn: () => getFlights(params),
    placeholderData: keepPreviousData,
  });

  const result = query.data ?? { data: [], total: 0, totalPages: 0 };

  return {
    data: result.data,
    total: result.total,
    totalPages: result.totalPages,
    status: query.isPending ? "loading" : query.isError && !query.data ? "error" : "success",
    error: query.error?.message ?? "",
    isUpdating: query.isFetching, 
    refreshFailed: query.isError && Boolean(query.data),
    reload: () => query.refetch(),
  };
}