"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

// A generic loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <p>Loading...</p>
  </div>
);

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isPasswordSet, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; // Wait until loading is complete
    }

    if (!isPasswordSet) {
      router.push('/setup');
    } else if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isPasswordSet, isLoading, router]);

  if (isLoading || !isAuthenticated || !isPasswordSet) {
    // Render a loading screen or null while redirecting or checking auth state.
    // This prevents a flash of the protected content.
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
