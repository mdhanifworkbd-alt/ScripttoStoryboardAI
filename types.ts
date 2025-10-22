
export interface Scene {
  sceneNumber: string;
  duration: string;
  description: string;
  visualSuggestion: string;
  mood: string;
  footageType: string;
  searchKeywords: string[];
  graphicsIdea: string;
}

export interface Breakdown {
  scenes: Scene[];
}
