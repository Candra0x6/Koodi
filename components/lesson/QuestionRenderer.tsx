'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Question {
  id: string;
  prompt: string;
  codeSnippet?: string;
  correctAnswer: any;
  explanation?: string;
  difficulty: number;
  tags: string[];
  questionType: string;
  choices?: any;
}

interface QuestionRendererProps {
  question: Question;
  userAnswer: any;
  onAnswerChange: (answer: any) => void;
}

export function QuestionRenderer({
  question,
  userAnswer,
  onAnswerChange,
}: QuestionRendererProps) {
  return (
    <div className="space-y-6">
      {/* Difficulty & Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary">
          Difficulty: {question.difficulty}/5
        </Badge>
        {question.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Question Prompt */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {question.prompt}
        </h2>
      </div>

      {/* Code Snippet (if exists) */}
      {question.codeSnippet && (
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm font-mono">{question.codeSnippet}</pre>
        </div>
      )}

      {/* Question Type Specific UI */}
      {renderQuestionInput(question, userAnswer, onAnswerChange)}
    </div>
  );
}

function renderQuestionInput(
  question: Question,
  userAnswer: any,
  onAnswerChange: (answer: any) => void
) {
  switch (question.questionType) {
    case 'fix_the_bug':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fixed Code:
          </label>
          <textarea
            placeholder="Enter the corrected code here..."
            value={userAnswer || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onAnswerChange(e.target.value)}
            className="min-h-32 font-mono text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      );

    case 'code_reorder':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code Order:
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Enter the correct line numbers in order (e.g., 3,1,2,4):
          </p>
          <Input
            placeholder="e.g., 3,1,2,4"
            value={userAnswer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="font-mono"
          />
        </div>
      );

    case 'fill_in_blank':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fill in the blank:
          </label>
          <Input
            placeholder="Enter the missing code..."
            value={userAnswer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="font-mono"
          />
        </div>
      );

    case 'predict_output':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Predict the output:
          </label>
          <textarea
            placeholder="What will this code output?"
            value={userAnswer || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onAnswerChange(e.target.value)}
            className="min-h-24 font-mono text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      );

    case 'multiple_choice':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Select the correct answer:
          </label>
          <div className="space-y-2">
            {question.choices?.map((choice: string, idx: number) => (
              <Button
                key={idx}
                onClick={() => onAnswerChange(idx)}
                variant={userAnswer === idx ? 'primary' : 'outline'}
                className="w-full justify-start h-auto py-3 px-4 text-left"
              >
                <span className="mr-3 font-semibold">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {choice}
              </Button>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Answer:
          </label>
          <Input
            placeholder="Enter your answer..."
            value={userAnswer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
          />
        </div>
      );
  }
}
