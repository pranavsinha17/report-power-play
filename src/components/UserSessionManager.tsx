
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, User, AlertTriangle } from 'lucide-react';

interface UserSession {
  userId: string;
  sessionId: string;
  startTime: Date;
  expiryTime: Date;
  templateId: string;
  reportInstanceId: string;
}

interface UserSessionManagerProps {
  onSessionCreated: (session: UserSession) => void;
}

export const UserSessionManager: React.FC<UserSessionManagerProps> = ({ onSessionCreated }) => {
  const [userId, setUserId] = useState('');
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (currentSession) {
      const interval = setInterval(() => {
        const now = new Date();
        const remaining = currentSession.expiryTime.getTime() - now.getTime();
        
        if (remaining <= 0) {
          setCurrentSession(null);
          setTimeRemaining('');
          alert('Your session has expired. Please create a new session to continue.');
        } else {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentSession]);

  const createSession = (templateId: string) => {
    if (!userId.trim()) {
      alert('Please enter a User ID');
      return;
    }

    const now = new Date();
    const expiry = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hours
    
    const session: UserSession = {
      userId: userId.trim(),
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: now,
      expiryTime: expiry,
      templateId,
      reportInstanceId: `instance_${userId}_${templateId}_${Date.now()}`
    };

    setCurrentSession(session);
    onSessionCreated(session);
  };

  const endSession = () => {
    setCurrentSession(null);
    setTimeRemaining('');
  };

  if (currentSession) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Active Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">User ID:</span>
              <p className="text-gray-900">{currentSession.userId}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Session ID:</span>
              <p className="text-gray-900 font-mono text-xs">{currentSession.sessionId}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
            <Clock className="h-4 w-4 text-green-600" />
            <span className="text-green-800 font-medium">
              Time Remaining: {timeRemaining}
            </span>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-amber-50 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-amber-800 text-sm">
              Your report instance is isolated and will be automatically cleaned up after session expires
            </span>
          </div>

          <Button onClick={endSession} variant="outline" className="w-full">
            End Session Early
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-600" />
          <span>Create User Session</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user-id">User ID</Label>
          <Input
            id="user-id"
            placeholder="Enter your unique user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Each user gets an isolated report instance for 3 hours
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export { createSession };
