import { onlineManager, QueryClient } from "@tanstack/react-query";
import { NotFoundError, OfflineError } from "./service.js";


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
    
      staleTime: (query) => (query.state.data?.cachedAt ? 0 : 60 * 1000),
     
      gcTime: 5 * 60 * 1000,
      
      retry: (failureCount, error) =>
        !(error instanceof OfflineError) && !(error instanceof NotFoundError) && failureCount < 1,
      
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      
      networkMode: "offlineFirst",
    },
    mutations: {
      
      networkMode: "always",
    },
  },
});


onlineManager.setOnline(navigator.onLine);


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