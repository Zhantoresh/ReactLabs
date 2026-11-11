import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext.js";
import { logIn, logInWithGoogle, logOut, signUp, subscribeToAuth } from "../services/auth.js";
import { favoriteKeys } from "../services/queryClient.js";


export default function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (!firebaseUser) queryClient.removeQueries({ queryKey: favoriteKeys.all });
    });
    return unsubscribe; 
  }, [queryClient]);


  const value = {
    user,
    loading,
    signUp,
    logIn,
    logInWithGoogle,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}