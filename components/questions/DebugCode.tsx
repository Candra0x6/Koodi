import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface DebugCodeProps {
  question: {
    id: string;
    content: string;
    answer: string;
  };
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function DebugCode({ question, onSubmit, disabled }: DebugCodeProps) {
  const [input, setInput] = useState('');

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-900">{question.content}</p>
      <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-gray-100 mb-4 whitespace-pre-wrap max-h-48 overflow-y-auto">
        {question.content.includes('```') ? (
          question.content.split('```')[1]?.trim() || question.content
        ) : (
          question.content
        )}
      </div>
      <textarea
        placeholder="What is the bug? (describe the issue or provide the fix)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
        rows={4}
      />
      <Button
        onClick={() => onSubmit(input.trim())}
        disabled={!input || disabled}
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        Submit Answer
      </Button>
    </div>
  );
}
