import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFlight, deleteFlight, OfflineError, updateFlight } from "../services/service.js";
import { queueStatusChange } from "../services/outbox.js";
import { flightKeys } from "../services/queryClient.js";
import { useAuth } from "./useAuth.js";


function invalidateFlightLists(queryClient) {
  queryClient.invalidateQueries({ queryKey: flightKeys.lists() });
  queryClient.invalidateQueries({ queryKey: flightKeys.everything() });
}

export function useCreateFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values) => createFlight(values),
    onSuccess: ({ flight }) => {
      
      queryClient.setQueryData(flightKeys.detail(flight.id), { flight, cachedAt: null });
      invalidateFlightLists(queryClient);
    },
  });
}


export function useUpdateFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changes }) => updateFlight(id, changes),
    onSuccess: (updated) => {
      
      queryClient.setQueryData(flightKeys.detail(updated.id), { flight: updated, cachedAt: null });
      invalidateFlightLists(queryClient);
    },
  });
}


export function useChangeFlightStatus() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      try {
        return { flight: await updateFlight(id, { status }), queued: false };
      } catch (err) {
        if (!(err instanceof OfflineError) || !user) throw err;
       
        const cached = queryClient.getQueryData(flightKeys.detail(id))?.flight;
        await queueStatusChange({ uid: user.uid, flight: cached ?? { id: Number(id), name: `#${id}` }, status });
        return { flight: null, queued: true };
      }
    },

 
    onMutate: async ({ id, status }) => {
      const key = flightKeys.detail(id);

      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key); 
      queryClient.setQueryData(key, (old) => (old ? { ...old, flight: { ...old.flight, status } } : old));
      return { previous }; 
    },

    
    onError: (_error, { id }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(flightKeys.detail(id), context.previous);
      }
    },

   
    onSuccess: ({ flight, queued }, { id, status }) => {
      if (queued) {
        queryClient.setQueryData(flightKeys.detail(id), (old) =>
          old ? { ...old, flight: { ...old.flight, status, pendingStatus: true } } : old,
        );
      } else {
        queryClient.setQueryData(flightKeys.detail(flight.id), { flight, cachedAt: null });
      }
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