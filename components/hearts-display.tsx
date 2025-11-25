'use client';

import { Heart } from 'lucide-react';

interface HeartsDisplayProps {
  hearts: number;
  maxHearts?: number;
}

export function HeartsDisplay({ hearts, maxHearts = 3 }: HeartsDisplayProps) {
  return (
    <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
      <div className="flex gap-1">
        {Array.from({ length: maxHearts }).map((_, i) => (
          <Heart
            key={i}
            className={`w-5 h-5 ${
              i < hearts
                ? 'fill-red-500 text-red-500'
                : 'text-red-200'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-gray-700">
        {hearts}/{maxHearts}
      </span>
    </div>
  );
}
