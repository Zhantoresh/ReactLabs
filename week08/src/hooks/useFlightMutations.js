import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFlight, deleteFlight, updateFlight } from "../services/service.js";
import { flightKeys } from "../services/queryClient.js";

function invalidateFlightLists(queryClient) {
  queryClient.invalidateQueries({ queryKey: flightKeys.lists() });
  queryClient.invalidateQueries({ queryKey: flightKeys.everything() });
}

export function useCreateFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values) => createFlight(values),
    onSuccess: ({ flight }) => {
      queryClient.setQueryData(flightKeys.detail(flight.id), flight); 
      invalidateFlightLists(queryClient);
    },
  });
}


export function useUpdateFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changes }) => updateFlight(id, changes),
    onSuccess: (updated) => {
      queryClient.setQueryData(flightKeys.detail(updated.id), updated);
      invalidateFlightLists(queryClient);
    },
  });
}

export function useDeleteFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteFlight(id),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: flightKeys.detail(id), refetchType: "none" });
      invalidateFlightLists(queryClient);
    },
  });
}