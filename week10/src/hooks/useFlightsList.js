import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFlights, OfflineError } from "../services/service.js";
import { flightKeys } from "../services/queryClient.js";


export function useFlightsList(params) {
  const query = useQuery({
  
    queryKey: flightKeys.list(params),
    queryFn: () => getFlights(params),
   
    placeholderData: keepPreviousData,
  });


  const result = query.data ?? { data: [], total: 0, totalPages: 0, cachedAt: null };

  return {
    data: result.data,
    total: result.total,
    totalPages: result.totalPages,
    status: query.isPending ? "loading" : query.isError && !query.data ? "error" : "success",
    offline: query.error instanceof OfflineError && !query.data, // offline and nothing saved
    error: query.error?.message ?? "",
    isUpdating: query.isFetching, 
    refreshFailed: query.isError && Boolean(query.data),
    cachedAt: result.cachedAt, 
    reload: () => query.refetch(),
  };
}