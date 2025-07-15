import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LeaderboardCard } from '@/components/leaderboard/LeaderboardCard';
import { ClaimPointsCard } from '@/components/player/ClaimPointsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { LogOut, Trophy, Target, Users, Sparkles } from 'lucide-react';

interface LeaderboardEntry {
  _id: string;
  name: string;
  totalPoints: number;
  rank: number;
}

export const PlayerDashboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout, token } = useAuth();

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leaderboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handlePointsClaimed = () => {
    fetchLeaderboard();
  };

  const currentUserRank = leaderboard.find(entry => entry.name === user?.name);

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Ready to climb the leaderboard?
            </p>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-card border-0 shadow-card animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Your Points</p>
                  <p className="text-2xl font-bold text-primary">
                    {user?.totalPoints || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gold/20 rounded-full">
                  <Trophy className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Your Rank</p>
                  <p className="text-2xl font-bold">
                    {currentUserRank ? `#${currentUserRank.rank}` : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-secondary/50 rounded-full">
                  <Users className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Players</p>
                  <p className="text-2xl font-bold">
                    {leaderboard.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Claim Points Section */}
        <div className="lg:col-span-1">
          <ClaimPointsCard onPointsClaimed={handlePointsClaimed} />
        </div>

        {/* Leaderboard Section */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card border-0 shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-gold" />
                Leaderboard
                <Badge variant="secondary">{leaderboard.length} players</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry._id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <LeaderboardCard
                        entry={entry}
                        isCurrentUser={entry.name === user?.name}
                      />
                    </div>
                  ))}
                  
                  {leaderboard.length === 0 && (
                    <div className="text-center py-8">
                      <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No players yet. Be the first!</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};