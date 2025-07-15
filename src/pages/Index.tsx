import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AuthPage } from './AuthPage';
import { PlayerDashboard } from './PlayerDashboard';
import { AdminDashboard } from './AdminDashboard';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return user.role === 'admin' ? <AdminDashboard /> : <PlayerDashboard />;
};

export default Index;
