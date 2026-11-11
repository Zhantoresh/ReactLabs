import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.js";
import { logIn, logInWithGoogle, logOut, signUp, subscribeToAuth } from "../services/auth.js";


export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe; 
  }, []);


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