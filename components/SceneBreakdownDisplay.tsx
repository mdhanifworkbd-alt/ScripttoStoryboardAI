import React, { useState } from 'react';
import type { Breakdown } from '../types';
import { SceneCard } from './SceneCard';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { FilmIcon } from './icons/FilmIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface SceneBreakdownDisplayProps {
  breakdown: Breakdown | null;
  isLoading: boolean;
  error: string | null;
}

const formatBreakdownForExport = (breakdown: Breakdown): string => {
  return breakdown.scenes.map(scene => {
    return `
---
🎬 ${scene.sceneNumber} (${scene.duration})
---

🔹 Description:
${scene.description}

💡 Visual Suggestion:
${scene.visualSuggestion}

🎨 Mood / Tone:
${scene.mood}

🎞️ Footage Type:
${scene.footageType.charAt(0).toUpperCase() + scene.footageType.slice(1)}

✨ Graphics Idea:
${scene.graphicsIdea || 'N/A'}

🔍 Search Keywords:
- ${scene.searchKeywords.join('\n- ')}
`;
  }).join('\n');
};


export const SceneBreakdownDisplay: React.FC<SceneBreakdownDisplayProps> = ({ breakdown, isLoading, error }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleExport = () => {
    if (!breakdown) return;
    const textContent = formatBreakdownForExport(breakdown);
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'storyboard.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!breakdown || isCopied) return;
    const textContent = formatBreakdownForExport(breakdown);
    navigator.clipboard.writeText(textContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-800/50 rounded-lg p-8">
        <Loader />
        <p className="mt-4 text-slate-400">AI is crafting your storyboard...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!breakdown) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-800/50 rounded-lg p-8 border-2 border-dashed border-slate-700">
        <FilmIcon className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-xl font-bold text-slate-400">Your Storyboard Awaits</h2>
        <p className="text-slate-500 mt-2 text-center">
          Enter your script on the left and click "Generate Breakdown" to see the magic happen.
        </p>
      </div>
    );
  }

  const lastScene = breakdown.scenes[breakdown.scenes.length - 1];
  const totalDuration = lastScene?.duration.split('-')[1] || 'N/A';

  return (
    <div className="flex flex-col gap-6 h-full lg:max-h-[calc(100vh-150px)] overflow-y-auto pr-2">
      <div className="flex justify-between items-start sticky top-0 bg-slate-900 py-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-300">🎞️ Scene Breakdown</h2>
          {breakdown.scenes.length > 0 && (
            <p className="text-sm text-slate-400 mt-1">
              {breakdown.scenes.length} scenes | Est. Duration: {totalDuration}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
           <button onClick={handleCopy} className={`flex items-center gap-2 text-sm py-2 px-3 rounded-md transition-colors ${isCopied ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
            {isCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 text-sm bg-slate-700 py-2 px-3 rounded-md hover:bg-slate-600 text-slate-300 transition-colors">
            <DownloadIcon className="w-4 h-4" />
            <span>Export TXT</span>
          </button>
        </div>
      </div>

      {breakdown.scenes.map((scene, index) => (
        <SceneCard key={index} scene={scene} />
      ))}
    </div>
  );
};