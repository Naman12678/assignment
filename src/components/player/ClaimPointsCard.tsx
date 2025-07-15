import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Gift, Sparkles } from 'lucide-react';

interface ClaimPointsCardProps {
  onPointsClaimed: () => void;
}

export const ClaimPointsCard: React.FC<ClaimPointsCardProps> = ({ onPointsClaimed }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  const claimPoints = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/claim', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim points');
      }

      toast({
        title: "Points Claimed! 🎉",
        description: `You earned ${data.points} points! Keep going!`,
        variant: "default",
      });

      onPointsClaimed();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to claim points",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-card animate-scale-in">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-primary" />
          Claim Your Points
          <Sparkles className="h-5 w-5 text-primary" />
        </CardTitle>
        <CardDescription>
          Click the button below to claim random points (1-10)
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button
          onClick={claimPoints}
          disabled={isLoading}
          size="lg"
          className="bg-gradient-primary hover:opacity-90 transition-all duration-300 hover:scale-105 animate-pulse-glow"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Gift className="mr-2 h-5 w-5" />
              Claim Points
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground mt-4">
          Each claim gives you 1-10 random points
        </p>
      </CardContent>
    </Card>
  );
};