import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});


export const flightKeys = {
  all: ["flights"],
  lists: () => ["flights", "list"],
  list: (params) => ["flights", "list", params],
  everything: () => ["flights", "all"], 
  detail: (id) => ["flights", "detail", String(id)],
};

export const favoriteKeys = {
  all: ["favorites"],
  byUser: (uid) => ["favorites", uid],
};