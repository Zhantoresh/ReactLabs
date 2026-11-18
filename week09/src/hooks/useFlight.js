import { useQuery } from "@tanstack/react-query";
import { getFlight, NotFoundError } from "../services/service.js";
import { flightKeys } from "../services/queryClient.js";

export function useFlight(id) {
  const query = useQuery({
    queryKey: flightKeys.detail(id),
    queryFn: () => getFlight(id),
    retry: (failureCount, error) => !(error instanceof NotFoundError) && failureCount < 1,
  });

  let status = "success";
  if (query.isPending) status = "loading";
  else if (query.error instanceof NotFoundError) status = "notfound";
  else if (query.isError && !query.data) status = "error";

  return {
    flight: query.data ?? null,
    status,
    error: query.error?.message ?? "",
    reload: () => query.refetch(),
  };
}