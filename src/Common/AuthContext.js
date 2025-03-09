import { useContext, createContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem("user");
    if (data) {
      return JSON.parse(data);
    }
    return null;
  });
  const login = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data)); // email, name, _id
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  return (
    <AuthContext.Provider value={{ login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
