
import React from 'react';
import type { Scene } from '../types';

interface SceneCardProps {
  scene: Scene;
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene }) => {
  return (
    <div className="bg-slate-800/70 p-6 rounded-xl border border-slate-700 shadow-lg transition-all hover:border-cyan-500/50 hover:shadow-cyan-500/10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-cyan-400">{scene.sceneNumber}</h3>
        <span className="text-sm font-mono bg-slate-700 text-slate-300 px-3 py-1 rounded-full">{scene.duration}</span>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-slate-300 mb-1">Description</h4>
          <p className="text-slate-400 text-sm leading-relaxed">{scene.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-slate-300 mb-1">Visual Suggestion</h4>
            <p className="text-slate-400">{scene.visualSuggestion}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-300 mb-1">Mood / Tone</h4>
            <p className="text-slate-400">{scene.mood}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-300 mb-1">Footage Type</h4>
            <p className="text-slate-400 capitalize">{scene.footageType}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-300 mb-1">Graphics Idea</h4>
            <p className="text-slate-400">{scene.graphicsIdea || 'N/A'}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-slate-300 mb-2">Stock Search Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {scene.searchKeywords.map((keyword, index) => (
              <span key={index} className="bg-slate-700 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
