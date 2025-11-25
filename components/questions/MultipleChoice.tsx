import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MultipleChoiceProps {
  question: {
    id: string;
    content: string;
    choices: string[] | string | null;
    answer: string;
  };
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function MultipleChoice({ question, onSubmit, disabled }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);

  // Parse choices if they're a JSON string
  let choices: string[] = [];
  if (Array.isArray(question.choices)) {
    choices = question.choices;
  } else if (typeof question.choices === 'string') {
    try {
      choices = JSON.parse(question.choices);
    } catch {
      choices = [];
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-900">{question.content}</p>
      <div className="space-y-2">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => !disabled && setSelected(choice)}
            disabled={disabled}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              selected === choice
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  selected === choice
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-gray-300'
                }`}
              />
              <span className="text-gray-900">{choice}</span>
            </div>
          </button>
        ))}
      </div>
      <Button
        onClick={() => selected && onSubmit(selected)}
        disabled={!selected || disabled}
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        Check Answer
      </Button>
    </div>
  );
}
