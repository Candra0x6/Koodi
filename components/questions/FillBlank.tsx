import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FillBlankProps {
  question: {
    id: string;
    content: string;
    answer: string;
  };
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function FillBlank({ question, onSubmit, disabled }: FillBlankProps) {
  const [input, setInput] = useState('');

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-900">{question.content}</p>
      <Input
        type="text"
        placeholder="Type your answer..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        onKeyDown={(e) => e.key === 'Enter' && input && onSubmit(input)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
      <Button
        onClick={() => onSubmit(input)}
        disabled={!input || disabled}
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        Check Answer
      </Button>
    </div>
  );
}
