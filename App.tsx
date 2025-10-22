import React, { useState, useCallback } from 'react';
import { ScriptInput } from './components/ScriptInput';
import { SceneBreakdownDisplay } from './components/SceneBreakdownDisplay';
import { generateSceneBreakdown } from './services/geminiService';
import type { Breakdown } from './types';
import { FilmIcon } from './components/icons/FilmIcon';
import { Footer } from './components/Footer';
import { Clock } from './components/Clock';

const App: React.FC = () => {
  const [script, setScript] = useState<string>('');
  const [sceneDuration, setSceneDuration] = useState<string>('5-10');
  const [totalDuration, setTotalDuration] = useState<string>('');
  const [breakdown, setBreakdown] = useState<Breakdown | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!script.trim()) {
      setError('Please enter a script to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setBreakdown(null);

    try {
      const result = await generateSceneBreakdown(script, sceneDuration, totalDuration);
      setBreakdown(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [script, sceneDuration, totalDuration]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <header className="bg-slate-800/50 backdrop-blur-sm p-4 border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <FilmIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Script to Storyboard AI
            </h1>
          </div>
          <Clock />
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
        <ScriptInput
          script={script}
          setScript={setScript}
          sceneDuration={sceneDuration}
          setSceneDuration={setSceneDuration}
          totalDuration={totalDuration}
          setTotalDuration={setTotalDuration}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
        <SceneBreakdownDisplay
          breakdown={breakdown}
          isLoading={isLoading}
          error={error}
        />
      </main>

      <Footer />
    </div>
  );
};

export default App;