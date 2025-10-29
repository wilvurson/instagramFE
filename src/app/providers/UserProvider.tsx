"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";

type UserContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  setToken: (token: string | null) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  token: null,
  loading: true,
  setToken: () => {},
});

export const UserContextProvider = ({ children }: React.PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const authenticateUser = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:5500/me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (response.status !== 200) {
      setUser(null);
      setToken(null);
      localStorage.setItem("authToken", "null");
      setLoading(false);
      return;
    }
    const data = await response.json();
    setUser(data.body);
    setLoading(false);
  };

  useEffect(() => {
    if (window) {
      const localToken = localStorage.getItem("authToken") as string;
      setToken(JSON.parse(localToken));
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", JSON.stringify(token));
      authenticateUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  return <UserContext.Provider value={{ user, token, loading, setToken }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  return ctx;
};
