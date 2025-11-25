'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameOverModalProps {
  attempts: number;
  onRetry: () => void;
  onBack: () => void;
}

export function GameOverModal({ attempts, onRetry, onBack }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-16 h-16 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Game Over!
        </h2>
        
        <p className="text-center text-gray-600 mb-6">
          You ran out of hearts! This is attempt {attempts}.
          <br />
          <span className="font-medium">Try again?</span>
        </p>
        
        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1"
          >
            Back to Chapters
          </Button>
          <Button
            onClick={onRetry}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Retry Lesson
          </Button>
        </div>
      </div>
    </div>
  );
}
