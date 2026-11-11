import { useQueryClient } from "@tanstack/react-query";
import { getFlight } from "../services/service.js";
import { flightKeys } from "../services/queryClient.js";

export function usePrefetchFlight() {
  const queryClient = useQueryClient();

  return function prefetch(id) {
    queryClient.prefetchQuery({
      queryKey: flightKeys.detail(id),
      queryFn: () => getFlight(id),
    });
  };
}