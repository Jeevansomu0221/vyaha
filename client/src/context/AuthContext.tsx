// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, type ReactNode } from "react";

// Updated User interface - made token optional
export interface User {
  id: string | number;
  name?: string; // Optional for signin (mock data might not have it)
  email: string;
  role: string;
  token?: string; // Optional since it's stored separately in localStorage
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Load from localStorage on init
    const savedUser = localStorage.getItem("authUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
    
    // Store token separately if it exists
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
  };

  // Keep user in sync if localStorage changes
  useEffect(() => {
    const savedUser = localStorage.getItem("authUser");
    if (savedUser && !user) {
      setUser(JSON.parse(savedUser));
    }
  }, [user]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout,
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};