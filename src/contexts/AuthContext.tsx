"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { encrypt, decrypt } from '@/lib/crypto';

const AUTH_SESSION_KEY = 'appkadaii_session_key';
const ENCRYPTED_DATA_KEY = 'appkadaii_projects_encrypted';

interface AuthContextType {
  isAuthenticated: boolean;
  isPasswordSet: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  setupPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isPasswordSet, setIsPasswordSet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const storedData = localStorage.getItem(ENCRYPTED_DATA_KEY);
    setIsPasswordSet(!!storedData);

    const sessionKey = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (sessionKey) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    const success = await checkPassword(password);
    if (success) {
      sessionStorage.setItem(AUTH_SESSION_KEY, password); // Store password in session to be used by other hooks
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
  };

  const setupPassword = async (password: string): Promise<void> => {
    const initialEncryptedData = encrypt('[]', password);
    localStorage.setItem(ENCRYPTED_DATA_KEY, initialEncryptedData);
    setIsPasswordSet(true);

    sessionStorage.setItem(AUTH_SESSION_KEY, password); // Store password in session
    setIsAuthenticated(true);
  };

  const checkPassword = async (password: string): Promise<boolean> => {
    const storedData = localStorage.getItem(ENCRYPTED_DATA_KEY);
    if (!storedData) {
      return false;
    }

    const decryptedData = decrypt(storedData, password);

    try {
        JSON.parse(decryptedData);
        return true; // If it parses, password is correct
    } catch (e) {
        return false; // If JSON.parse fails, password is wrong
    }
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, isPasswordSet, login, logout, setupPassword, checkPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
