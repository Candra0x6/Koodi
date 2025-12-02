'use client';

import { useOnboarding } from '@/lib/contexts/onboarding-context';
import { Card } from '@/components/duolingo-ui';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/languages`);
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
        <p className="text-muted-foreground font-bold animate-pulse">Loading languages...</p>
      </Card>
    );
  }

  return (
    <Card className="w-full p-8">
      <h2 className="text-3xl font-extrabold text-foreground mb-2 text-center">Choose Your Language</h2>
      <p className="text-muted-foreground mb-8 text-center font-medium">Pick a language to start learning</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => handleSelectLanguage(lang)}
            className={cn(
              "p-6 rounded-2xl border-2 border-border border-b-4 hover:bg-muted/50 active:border-b-2 active:translate-y-[2px] transition-all text-left group",
              "hover:border-primary/50"
            )}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">
              {lang.slug === 'python' && '🐍'}
              {lang.slug === 'javascript' && '⚡'}
              {lang.slug === 'java' && '☕'}
              {lang.slug === 'cpp' && '⚙️'}
            </div>
            <div className="font-bold text-xl text-foreground mb-1">{lang.name}</div>
            <div className="text-sm text-muted-foreground font-medium">
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
