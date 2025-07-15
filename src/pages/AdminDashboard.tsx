import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PlayerManagement } from '@/components/admin/PlayerManagement';
import { ClaimHistory } from '@/components/admin/ClaimHistory';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { LogOut, Database, Shield, Users, Activity } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [isSeedingData, setIsSeedingData] = useState(false);
  const { user, logout, token } = useAuth();
  const { toast } = useToast();

  const seedData = async () => {
    setIsSeedingData(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/seed', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Data seeded successfully!",
          description: "Default players have been added to the system.",
          variant: "default",
        });
      } else {
        throw new Error('Failed to seed data');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to seed data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSeedingData(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              Welcome, {user?.name}! Manage players and monitor activity.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={seedData}
              disabled={isSeedingData}
            >
              {isSeedingData ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Database className="mr-2 h-4 w-4" />
              )}
              Seed Data
            </Button>
            <Button
              variant="outline"
              onClick={logout}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-gradient-card border-0 shadow-card animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Players</p>
                  <p className="text-2xl font-bold text-primary">
                    Active Management
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-secondary/50 rounded-full">
                  <Activity className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Status</p>
                  <p className="text-2xl font-bold text-success">
                    Online
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Admin Panels */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Player Management */}
        <div>
          <PlayerManagement />
        </div>

        {/* Claim History */}
        <div>
          <ClaimHistory />
        </div>
      </div>
    </div>
  );
};