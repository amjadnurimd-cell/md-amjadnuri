
import { GoogleGenAI, Type } from "@google/genai";

// Standard client creator to ensure we use the freshest API Key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const checkAndRequestApiKey = async (): Promise<boolean> => {
  if (typeof window !== 'undefined' && window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
      // Proceed immediately as per instructions to avoid race conditions
      return true;
    }
    return true;
  }
  return true;
};

export const generateVideoCaptions = async (topic: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: `Generate a TikTok-style caption and hashtags for a video about: ${topic}. Format: { "caption": "...", "tags": ["tag1", "tag2"] }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          caption: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["caption", "tags"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const searchGrounding = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      systemInstruction: "You are a social media research assistant. Provide concise, trending, and factual information based on web search. Use bullet points for readability. Always prioritize recent events.",
      tools: [{ googleSearch: {} }],
    },
  });
  
  // Extract URLs from groundingChunks as required by guidelines
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => {
    if (chunk.web) {
      return {
        title: chunk.web.title || 'Web Source',
        uri: chunk.web.uri
      };
    }
    return null;
  }).filter((s: any) => s !== null) || [];

  return {
    text: response.text,
    sources: sources
  };
};

export const generateAIImage = async (
  prompt: string, 
  imageSize: "1K" | "2K" | "4K" = "1K",
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "9:16"
) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: imageSize
      }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const transcribeAudio = async (base64Audio: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'audio/wav', data: base64Audio } },
        { text: "Transcribe this audio accurately. Only return the transcribed text." }
      ]
    },
  });
  return response.text;
};

export const analyzeVideoContent = async (videoUrl: string, prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze this video content (Context: ${videoUrl}). Prompt: ${prompt}`,
  });
  return response.text;
};

export const generateAIVideo = async (prompt: string): Promise<string | null> => {
  try {
    const ai = getAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      return `${downloadLink}&key=${process.env.API_KEY}`;
    }
    return null;
  } catch (error: any) {
    console.error("Error generating video:", error);
    if (error?.message?.includes("Requested entity was not found.")) {
      await window.aistudio.openSelectKey();
    }
    return null;
  }
};
