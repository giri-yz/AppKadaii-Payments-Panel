"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Project, Payment } from '@/lib/types';
import { encrypt, decrypt } from '@/lib/crypto';
import { useAuth } from '@/hooks/useAuth';

const ENCRYPTED_DATA_KEY = 'appkadaii_projects_encrypted';

interface ProjectsContextType {
  projects: Project[];
  getProjectById: (id: string) => Project | undefined;
  addProject: (project: Omit<Project, 'id' | 'payments'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addPaymentToProject: (projectId: string, payment: Omit<Payment, 'id' | 'projectId'>) => void;
  updatePaymentInProject: (projectId: string, payment: Payment) => void;
  deletePaymentFromProject: (projectId: string, paymentId: string) => void;
  clearAllData: () => void;
  isLoading: boolean;
}

export const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPassword = useCallback(() => {
    // Helper to get password from session storage
    return sessionStorage.getItem('appkadaii_session_key');
  }, []);

  // Function to save data to localStorage
  const saveData = useCallback((data: Project[]) => {
    const password = getPassword();
    if (password) {
      const encryptedData = encrypt(JSON.stringify(data), password);
      localStorage.setItem(ENCRYPTED_DATA_KEY, encryptedData);
      setProjects(data);
    }
  }, [getPassword]);

  // Load initial data from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      const password = getPassword();
      const storedData = localStorage.getItem(ENCRYPTED_DATA_KEY);
      if (storedData && password) {
        const decryptedData = decrypt(storedData, password);
        if (decryptedData) {
          try {
            setProjects(JSON.parse(decryptedData));
          } catch {
            setProjects([]);
          }
        }
      }
      setIsLoading(false);
    }
  }, [isAuthenticated, getPassword]);

  const getProjectById = (id: string) => {
    return projects.find(p => p.id === id);
  };

  const addProject = (projectData: Omit<Project, 'id' | 'payments'>) => {
    const newProject: Project = {
      ...projectData,
      id: new Date().toISOString(), // Simple unique ID
      payments: [],
    };
    const updatedProjects = [...projects, newProject];
    saveData(updatedProjects);
  };

  const updateProject = (updatedProject: Project) => {
    const updatedProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    saveData(updatedProjects);
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    saveData(updatedProjects);
  };

  const addPaymentToProject = (projectId: string, paymentData: Omit<Payment, 'id' | 'projectId'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: new Date().toISOString(), // Simple unique ID
      projectId,
    };
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, payments: [...p.payments, newPayment] };
      }
      return p;
    });
    saveData(updatedProjects);
  };

  const updatePaymentInProject = (projectId: string, updatedPayment: Payment) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const updatedPayments = p.payments.map(pay => pay.id === updatedPayment.id ? updatedPayment : pay);
        return { ...p, payments: updatedPayments };
      }
      return p;
    });
    saveData(updatedProjects);
  };

  const deletePaymentFromProject = (projectId: string, paymentId: string) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const updatedPayments = p.payments.filter(pay => pay.id !== paymentId);
        return { ...p, payments: updatedPayments };
      }
      return p;
    });
    saveData(updatedProjects);
  };

  const clearAllData = () => {
    localStorage.removeItem(ENCRYPTED_DATA_KEY);
    setProjects([]);
    // Note: This function just clears the data, it doesn't log the user out.
    // The user would need to "set up" a new password.
  };

  return (
    <ProjectsContext.Provider value={{
      projects,
      getProjectById,
      addProject,
      updateProject,
      deleteProject,
      addPaymentToProject,
      updatePaymentInProject,
      deletePaymentFromProject,
      clearAllData,
      isLoading,
    }}>
      {children}
    </ProjectsContext.Provider>
  );
};
