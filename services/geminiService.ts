import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuantifierResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    groupA: {
      type: Type.OBJECT,
      properties: {
        professionalism: {
          type: Type.OBJECT,
          properties: {
            terminology: { type: Type.NUMBER, description: "Score 1-10 for technical terminology usage" },
            logic: { type: Type.NUMBER, description: "Score 1-10 for logical structure rigor" },
            density: { type: Type.NUMBER, description: "Score 1-10 for information density" },
          },
          required: ["terminology", "logic", "density"]
        },
        accuracy: {
          type: Type.OBJECT,
          properties: {
            chainOfThought: { type: Type.STRING, description: "Step-by-step analysis of the logic in Chinese" },
            isCorrect: { type: Type.BOOLEAN, description: "Is the final conclusion correct?" },
            firstErrorStep: { type: Type.STRING, description: "The first step where reasoning failed in Chinese, if any", nullable: true },
          },
          required: ["chainOfThought", "isCorrect"]
        },
        readability: {
          type: Type.OBJECT,
          properties: {
            tone: { type: Type.STRING, description: "e.g., Humorous, Formal, Casual (in Chinese)" },
            vocabularyLevel: { type: Type.STRING, description: "e.g., Elementary, University, Professional (in Chinese)" },
            analysis: { type: Type.STRING, description: "Detailed report on style and readability in Chinese" },
          },
          required: ["tone", "vocabularyLevel", "analysis"]
        }
      },
      required: ["professionalism", "accuracy", "readability"]
    },
    groupB: {
      type: Type.OBJECT,
      properties: {
        professionalism: {
          type: Type.OBJECT,
          properties: {
            terminology: { type: Type.NUMBER },
            logic: { type: Type.NUMBER },
            density: { type: Type.NUMBER },
          },
          required: ["terminology", "logic", "density"]
        },
        accuracy: {
          type: Type.OBJECT,
          properties: {
            chainOfThought: { type: Type.STRING },
            isCorrect: { type: Type.BOOLEAN },
            firstErrorStep: { type: Type.STRING, nullable: true },
          },
          required: ["chainOfThought", "isCorrect"]
        },
        readability: {
          type: Type.OBJECT,
          properties: {
            tone: { type: Type.STRING },
            vocabularyLevel: { type: Type.STRING },
            analysis: { type: Type.STRING },
          },
          required: ["tone", "vocabularyLevel", "analysis"]
        }
      },
      required: ["professionalism", "accuracy", "readability"]
    }
  },
  required: ["groupA", "groupB"]
};

export const analyzeTexts = async (textA: string, textB: string): Promise<QuantifierResponse> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    You are a professional "Quantifier" (Quantitative Analyst). Your core function is to convert text output into structured, comparable data metrics.
    
    Task: Evaluate the two text inputs (Group A and Group B) based on the following specific criteria. 
    IMPORTANT: Provide all textual analysis, reasoning, and descriptions in Simplified Chinese (简体中文).

    1. Professionalism Assessment (Score 1-10):
       - Terminology Frequency
       - Logical Structure Rigor
       - Information Density

    2. Accuracy Assessment (Logic Check):
       - Treat the input as an answer to a potential logical problem or a factual statement.
       - Perform a Chain-of-Thought analysis (in Chinese).
       - Determine if the conclusion is correct.
       - Locate the first error step if incorrect (in Chinese).

    3. Readability/Style Assessment:
       - Analyze tone (e.g., Relaxed, Formal, Academic) (in Chinese).
       - Analyze vocabulary difficulty (in Chinese).
       - Provide a brief style report (in Chinese).

    Input Group A:
    """${textA}"""

    Input Group B:
    """${textB}"""
    
    Return the result strictly as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for consistent analytical results
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as QuantifierResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};