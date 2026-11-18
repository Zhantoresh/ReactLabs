import { useQuery } from "@tanstack/react-query";
import { getFlight, NotFoundError, OfflineError } from "../services/service.js";
import { flightKeys } from "../services/queryClient.js";


export function useFlight(id) {
  const query = useQuery({
    queryKey: flightKeys.detail(id),
    queryFn: () => getFlight(id),
  });

  let status = "success";
  if (query.isPending) status = "loading";
  else if (query.error instanceof NotFoundError) status = "notfound";
  else if (query.error instanceof OfflineError && !query.data) status = "offline"; 
  else if (query.isError && !query.data) status = "error";

  return {
    flight: query.data?.flight ?? null,
    cachedAt: query.data?.cachedAt ?? null, 
    status,
    error: query.error?.message ?? "",
    reload: () => query.refetch(),
  };
}