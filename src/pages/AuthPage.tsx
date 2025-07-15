import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Trophy, Sparkles, Star } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Floating icons */}
        <Trophy className="absolute top-20 left-20 h-8 w-8 text-gold/30 animate-bounce" style={{ animationDelay: '0.5s' }} />
        <Sparkles className="absolute top-32 right-32 h-6 w-6 text-primary/40 animate-bounce" style={{ animationDelay: '1.5s' }} />
        <Star className="absolute bottom-32 left-32 h-7 w-7 text-primary/30 animate-bounce" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Trophy className="h-12 w-12 text-gold animate-pulse-glow" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-primary animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Leaderboard Pro
          </h1>
          <p className="text-muted-foreground">
            Compete, claim points, and climb to the top!
          </p>
        </div>

        {/* Auth Forms */}
        {isLogin ? (
          <LoginForm onToggleForm={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleForm={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};