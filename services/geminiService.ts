import { GoogleGenAI, Type } from '@google/genai';
import type { Breakdown } from '../types';

if (!process.env.API_KEY) {
    // In a real app, you would want to handle this more gracefully.
    // For this environment, we assume the key is present.
    console.warn("API_KEY environment variable not set. The application will not work without it.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const sceneSchema = {
  type: Type.OBJECT,
  properties: {
    sceneNumber: {
      type: Type.STRING,
      description: "A sequential identifier for the scene, e.g., 'Scene 1', 'Scene 2'."
    },
    duration: {
      type: Type.STRING,
      description: "The estimated time code range for this scene, e.g., '0:00-0:05'."
    },
    description: {
      type: Type.STRING,
      description: "A concise summary of what is happening in this scene."
    },
    visualSuggestion: {
      type: Type.STRING,
      description: "A description of the ideal footage or imagery for this scene (e.g., 'Medium shot of a character', 'Wide shot of a cityscape')."
    },
    mood: {
      type: Type.STRING,
      description: "The emotional atmosphere of the scene (e.g., 'Motivational', 'Dramatic', 'Calm')."
    },
    footageType: {
      type: Type.STRING,
      description: "The type of footage suggested (e.g., 'video clip', 'motion graphics', 'animation')."
    },
    searchKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 5-10 specific keywords for searching stock footage platforms."
    },
    graphicsIdea: {
      type: Type.STRING,
      description: "Optional ideas for text overlays, titles, or visual effects."
    },
  },
  required: ['sceneNumber', 'duration', 'description', 'visualSuggestion', 'mood', 'footageType', 'searchKeywords']
};

const breakdownSchema = {
  type: Type.OBJECT,
  properties: {
    scenes: {
      type: Type.ARRAY,
      description: "An array of all the generated scenes from the script.",
      items: sceneSchema
    }
  }
};


export const generateSceneBreakdown = async (script: string, sceneDuration: string, totalDuration: string): Promise<Breakdown> => {
  const model = "gemini-2.5-pro";
  
  const totalDurationValue = parseFloat(totalDuration);
  const totalDurationInstruction = !isNaN(totalDurationValue) && totalDurationValue > 0
    ? ` The entire storyboard should fit a total duration of approximately ${totalDurationValue} minute(s).`
    : '';

  const systemInstruction = `You are a professional video production assistant and storyboard artist. Your task is to analyze the provided script and break it down into a detailed, time-coded storyboard.
- Segment the script into logical scenes, with each scene lasting roughly ${sceneDuration} seconds.${totalDurationInstruction}
- Adhere strictly to the JSON schema provided to format your entire output.
- Ensure all fields are filled with creative, relevant, and professional suggestions.
- The search keywords must be optimized for stock footage platforms like Pexels, Storyblocks, or Shutterstock.
- The final output must be a single JSON object containing a 'scenes' array.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: script,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: breakdownSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("Received an empty response from the AI. Please try refining your script.");
    }
    
    // The response text should be a valid JSON string conforming to the schema.
    const parsedResponse: Breakdown = JSON.parse(jsonText);

    if (!parsedResponse.scenes || parsedResponse.scenes.length === 0) {
      throw new Error("The AI could not generate any scenes from the provided script. It might be too short or unclear.");
    }

    return parsedResponse;
  } catch (error) {
    console.error("Error in Gemini API call:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the AI's response. The format was invalid.");
    }
    if (error instanceof Error && error.message.includes('json')) {
      throw new Error("The AI response was not valid JSON. Please try again.");
    }
    throw new Error("An error occurred while communicating with the AI. Please check your script and try again.");
  }
};