import { useQuery } from "@tanstack/react-query";
import { getAllFlights } from "../services/service.js";
import { flightKeys } from "../services/queryClient.js";

export function useAllFlights(options = {}) {
  const query = useQuery({
    queryKey: flightKeys.everything(),
    queryFn: getAllFlights,
    refetchInterval: options.refetchInterval,
  });

  return {
    flights: query.data ?? [],
    status: query.isPending ? "loading" : query.isError && !query.data ? "error" : "success",
    error: query.error?.message ?? "",
    updatedAt: query.dataUpdatedAt || null, 
    isFetching: query.isFetching,
    refreshFailed: query.isError && Boolean(query.data), 
    reload: () => query.refetch(),
  };
}


export function useAdjacentFlights(id) {
  const { flights } = useAllFlights();
  const index = flights.findIndex((flight) => flight.id === Number(id));
  if (index === -1) return { prev: null, next: null };
  return { prev: flights[index - 1] ?? null, next: flights[index + 1] ?? null };
}