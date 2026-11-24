import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth.js";
import { getFavorites, toggleFavorite } from "../services/favorites.js";
import { favoriteKeys } from "../services/queryClient.js";


export function useFavorites() {
  const { user } = useAuth();
  const uid = user?.uid;

  const query = useQuery({
    queryKey: favoriteKeys.byUser(uid),
    queryFn: () => getFavorites(uid),
    enabled: Boolean(uid), 
  });

  const ids = query.data ?? [];
  return {
    ids,
    isSaved: (flightId) => ids.includes(Number(flightId)),
    status: query.isPending ? "loading" : query.isError && !query.data ? "error" : "success",
    error: query.error?.message ?? "",
    reload: () => query.refetch(),
  };
}


export function useToggleFavorite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const key = favoriteKeys.byUser(user?.uid);

  return useMutation({
    mutationFn: (flightId) => toggleFavorite(user.uid, flightId),

    onMutate: async (flightId) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key); 
      const id = Number(flightId);
      queryClient.setQueryData(key, (old = []) =>
        old.includes(id) ? old.filter((saved) => saved !== id) : [...old, id],
      );
      return { previous };
    },

    onError: (_error, _flightId, context) => {
      queryClient.setQueryData(key, context?.previous ?? []); 
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key }); 
    },
  });
}