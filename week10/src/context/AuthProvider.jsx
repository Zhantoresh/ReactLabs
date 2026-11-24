import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AuthContext } from "./AuthContext.js";
import {
  logIn,
  logInWithGoogle,
  logOut,
  reloadCurrentUser,
  resetPassword,
  sendVerificationEmail,
  signUp,
  subscribeToAuth,
} from "../services/auth.js";
import { favoritesCleared } from "../features/favorites/favoritesSlice.js";


export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (!firebaseUser) dispatch(favoritesCleared());
    });
    return unsubscribe;
  }, [dispatch]);

  async function refreshUser() {
    const freshUser = await reloadCurrentUser();
    setVersion((v) => v + 1);
    return freshUser;
  }

  const value = {
    user,
    loading,
    signUp,
    logIn,
    logInWithGoogle,
    logOut,
    resetPassword,
    sendVerificationEmail,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}