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


export function useChangeFlightStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateFlight(id, { status }),

   
    onMutate: async ({ id, status }) => {
      const key = flightKeys.detail(id);

      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key); // snapshot for rollback
      queryClient.setQueryData(key, (old) => (old ? { ...old, status } : old));
      return { previous }; 
    },

    onError: (_error, { id }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(flightKeys.detail(id), context.previous);
      }
    },

    onSuccess: (updated) => {
      queryClient.setQueryData(flightKeys.detail(updated.id), updated);
    },

    onSettled: () => {
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