import React from 'react';
import { Typewriter } from './Typewriter';

interface ScriptInputProps {
  script: string;
  setScript: (script: string) => void;
  sceneDuration: string;
  setSceneDuration: (duration: string) => void;
  totalDuration: string;
  setTotalDuration: (duration: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const ScriptInput: React.FC<ScriptInputProps> = ({ 
  script, setScript, 
  sceneDuration, setSceneDuration,
  totalDuration, setTotalDuration,
  onGenerate, isLoading 
}) => {
  const placeholderScript = `Example: A young woman stands on a hill overlooking a bustling city at sunrise. She takes a deep breath, a look of determination on her face. She then begins to run down the hill, towards the city, a smile forming on her lips as the music swells. This is her moment.`;

  return (
    <div className="flex flex-col gap-4 h-full">
      <label htmlFor="script-input" className="h-7 flex items-center">
        <Typewriter text="Paste Your Script|" className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text animate-gradient-x" />
      </label>
      <textarea
        id="script-input"
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder={placeholderScript}
        className="w-full flex-grow p-4 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow duration-300 min-h-[300px] lg:min-h-0 text-slate-300 placeholder:text-slate-500"
        disabled={isLoading}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-1 relative">
          <label htmlFor="total-duration-input" className="block text-sm font-medium text-slate-400 mb-1">
            Total Script Duration
          </label>
          <input
            id="total-duration-input"
            type="number"
            min="0"
            value={totalDuration}
            onChange={(e) => setTotalDuration(e.target.value)}
            placeholder="e.g., 2"
            disabled={isLoading}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow duration-300 h-[50px] pr-12"
          />
          <span className="absolute inset-y-0 right-4 flex items-center text-slate-400 text-sm pointer-events-none">
            min
          </span>
        </div>
        <div className="md:col-span-1">
          <label htmlFor="duration-select" className="block text-sm font-medium text-slate-400 mb-1">
            Scene Duration
          </label>
          <select
            id="duration-select"
            value={sceneDuration}
            onChange={(e) => setSceneDuration(e.target.value)}
            disabled={isLoading}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow duration-300 h-[50px]"
          >
            <option value="5-10">5-10 seconds (Default)</option>
            <option value="10-15">10-15 seconds</option>
            <option value="15-20">15-20 seconds</option>
          </select>
        </div>
        <div className="md:col-span-1">
          <button
            onClick={onGenerate}
            disabled={isLoading || !script.trim()}
            className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-[50px]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Generate Breakdown'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};