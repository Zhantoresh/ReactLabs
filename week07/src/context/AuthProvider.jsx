import { useState } from "react";
import { AuthContext } from "./AuthContext.js";
import { getSession, login as loginRequest, logout as logoutRequest } from "../services/service.js";


export default function AuthProvider({ children }) {
 
  const [user, setUser] = useState(() => getSession());

  async function login(email, password) {
    const loggedIn = await loginRequest(email, password);
    setUser(loggedIn);
    return loggedIn;
  }

  function logout() {
    logoutRequest();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}