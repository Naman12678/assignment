import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  _id: string;
  name: string;
  totalPoints: number;
  rank: number;
}

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ 
  entry, 
  isCurrentUser = false 
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-gold" />;
      case 2:
        return <Medal className="h-5 w-5 text-silver" />;
      case 3:
        return <Award className="h-5 w-5 text-bronze" />;
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
            {rank}
          </div>
        );
    }
  };

  const getRankStyling = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          card: "bg-gradient-gold border-gold/50 shadow-glow",
          badge: "bg-gold text-gold-foreground"
        };
      case 2:
        return {
          card: "bg-gradient-to-r from-silver/20 to-silver/30 border-silver/50",
          badge: "bg-silver text-foreground"
        };
      case 3:
        return {
          card: "bg-gradient-to-r from-bronze/20 to-bronze/30 border-bronze/50",
          badge: "bg-bronze text-bronze-foreground"
        };
      default:
        return {
          card: "bg-gradient-card border-border",
          badge: "bg-secondary text-secondary-foreground"
        };
    }
  };

  const styling = getRankStyling(entry.rank);

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:scale-105",
        styling.card,
        isCurrentUser && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        "animate-fade-in"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getRankIcon(entry.rank)}
            <div>
              <h3 className={cn(
                "font-semibold text-lg",
                isCurrentUser && "text-primary"
              )}>
                {entry.name}
                {isCurrentUser && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    You
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                Rank #{entry.rank}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <Badge className={styling.badge}>
              {entry.totalPoints} pts
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};