import { GoogleGenAI } from "@google/genai";
import { AIAnalysisResult } from "../types";

// Safely access process.env to prevent ReferenceError in browser environments
const apiKey = (() => {
  try {
    // Explicitly check if process is defined before accessing it
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY;
    }
    return '';
  } catch (e) {
    return '';
  }
})();

const ai = new GoogleGenAI({ apiKey });

// Use Gemini 2.5 Flash for Search Grounding (Trends)
export const getMarketTrends = async (query: string): Promise<AIAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Não foi possível obter informações no momento.";
    
    // Extract sources if available
    const sources: Array<{ title: string; uri: string }> = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Error fetching market trends:", error);
    return { text: "Erro ao conectar com a IA para buscar tendências." };
  }
};

// Use Gemini 3 Pro Preview with Thinking Budget for Deep Business Analysis
export const analyzeBusinessStrategy = async (dataContext: string, question: string): Promise<AIAnalysisResult> => {
  try {
    const prompt = `
      Você é um consultor de negócios especialista em barbearias de alto padrão.
      Analise os seguintes dados da barbearia:
      ${dataContext}
      
      Pergunta do Dono: ${question}
      
      Forneça uma análise estratégica detalhada, identificando oportunidades de lucro, retenção de clientes e melhorias operacionais.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking for deep analysis
      },
    });

    return { text: response.text || "Análise não disponível." };
  } catch (error) {
    console.error("Error analyzing business strategy:", error);
    return { text: "Erro ao processar a análise estratégica avançada." };
  }
};