'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface Language {
  id: string;
  name: string;
  slug: string;
}

export function LanguageScreen() {
  const { updateState, nextStep } = useOnboarding();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch languages from API
    async function fetchLanguages() {
      try {
        const res = await fetch('/api/languages');
        const data = await res.json();
        setLanguages(data);
        
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        // Fallback to Python for now
        setLanguages([{ id: '1', name: 'Python', slug: 'python' }]);
      } finally {
        setLoading(false);
      }
    }
    fetchLanguages();
  }, []);

  const handleSelectLanguage = (lang: Language) => {
    updateState({
      selectedLanguageId: lang.id,
      selectedLanguageName: lang.name,
    });
    nextStep();
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl p-8 text-center">
        <p className="text-gray-600">Loading languages...</p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Language</h2>
      <p className="text-gray-600 mb-8">Pick a language to start learning (Python recommended for beginners)</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => handleSelectLanguage(lang)}
            className="p-6 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition text-left"
          >
            <div className="text-4xl mb-2">
              {lang.slug === 'python' && '🐍'}
              {lang.slug === 'javascript' && '⚡'}
              {lang.slug === 'java' && '☕'}
              {lang.slug === 'cpp' && '⚙️'}
            </div>
            <div className="font-bold text-lg text-gray-900">{lang.name}</div>
            <div className="text-sm text-gray-600 mt-2">
              {lang.slug === 'python' && 'Perfect for beginners'}
              {lang.slug === 'javascript' && 'Great for web development'}
              {lang.slug === 'java' && 'Strong fundamentals'}
              {lang.slug === 'cpp' && 'Advanced topics'}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
