/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedPerms = localStorage.getItem("permissions");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      if (storedPerms) setPermissions(JSON.parse(storedPerms));
    }
  }, []);

  const loginContext = (userData, token, userPerms) => {
    setUser(userData);
    setPermissions(userPerms || {});
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("permissions", JSON.stringify(userPerms || {}));
  };

  const logout = () => {
    setUser(null);
    setPermissions({});
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, permissions, loginContext, logout }}>
      {children}
    </AuthContext.Provider>
  );
};