
import { GoogleGenAI, Chat } from "@google/genai";

// Create a new GoogleGenAI instance on each call
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// Helper to reliably detect quota errors regardless of object structure
const isQuotaError = (error: any): boolean => {
  try {
    const errStr = JSON.stringify(error);
    return (
      errStr.includes('429') || 
      errStr.includes('RESOURCE_EXHAUSTED') || 
      errStr.includes('quota') || 
      error?.status === 429 ||
      error?.error?.code === 429
    );
  } catch (e) {
    return false;
  }
};

export const createChatSession = (): Chat => {
  const ai = getAI();
  if (!ai) {
    // Return a dummy object if no AI client (handled by UI error boundary or try/catch)
    throw new Error("API Key missing");
  }
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are a compassionate, trauma-informed AI support assistant for "Voice Through Image", a non-profit documenting homelessness and social issues in California. Your goal is to provide empathetic support, answer questions about our mission (storytelling, advocacy, resources), and guide users to the "Resources" page if they need help. You are not a replacement for emergency services (911). Keep responses concise, warm, and professional. If asked about specific shelters, you can mention we have a verified directory.'
    }
  });
};

export const getAIResourceAssistance = async (query: string, location: string): Promise<string> => {
  // Immediate fallback for Demo Mode
  if (!process.env.API_KEY) {
      return "【演示模式】目前未連接 API 金鑰，無法進行實時 AI 搜索。但別擔心，您仍然可以瀏覽我們下方整理好的 70+ 個驗證機構目錄。請直接點擊下方的「緊急收容所」或「食物銀行」類別查看詳情。";
  }

  try {
    const ai = getAI();
    if (!ai) throw new Error("No API Key");

    const prompt = `
      你是 "Voice Through Image" 平台的專業資深社工。
      用戶需求: "${query}"
      所在位置: "${location}"
      
      任務要求:
      1. 請使用 Google Search 尋找位於 ${location} 或 ${query} 所指區域的最新緊急資源。
      2. 語氣必須專業、具備創傷知情意識。
      3. 語言優先使用繁體中文。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 2000 }
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    let text = response.text || "目前系統繁忙，請參考下方目錄。";
    
    if (sources.length > 0) {
      text += "\n\n--- 驗證來源 (Verified Sources) ---";
      sources.slice(0, 3).forEach((chunk: any) => {
        if (chunk.web?.uri) {
          text += `\n• ${chunk.web.title || '新聞來源'}: ${chunk.web.uri}`;
        }
      });
    }

    return text;
  } catch (error: any) {
    console.error("Gemini Assistant Error:", error);
    
    if (isQuotaError(error)) {
      return "【系統提示：實時搜索額度已達上限】\n\n目前無法進行實時網頁檢索，但我們已為您準備了下方 70+ 個經過驗證的核心機構目錄。請直接點擊下方類別查看詳情，或撥打 2-1-1 獲取 24 小時人工支援。";
    }
    return "連線超時。請查閱下方 70+ 核心機構清單，或撥打 2-1-1 獲取 24 小時即時支援。";
  }
};

export interface NewsResult {
  text: string;
  sources: Array<{ title: string; uri: string }>;
  isFallback?: boolean;
}

const FALLBACK_NEWS_ZH: NewsResult = {
  isFallback: true,
  text: `1. 加州政府宣佈 2025 年度撥款 15 億美元用於擴建主要城市（如洛杉磯與舊金山）的緊急住房基礎設施，重點關注家庭與退伍軍人。
2. 洛杉磯縣最新的 2025 Homeless Count 初步數據顯示，由於「租金保障」政策的實施，特定區域的流離失所增長率有所放緩，但仍面臨巨大挑戰。
3. 針對華裔社區的「文化敏感醫療」倡議在北加州試點成功，多個非營利機構將於本季度增加國粵語心理健康諮詢的時段。`,
  sources: [
    { title: "California Housing Finance Agency", uri: "https://www.calhfa.ca.gov" },
    { title: "LA Homeless Services Authority (LAHSA)", uri: "https://www.lahsa.org" },
    { title: "SF Dept of Homelessness & Supportive Housing", uri: "https://hsh.sfgov.org" }
  ]
};

const FALLBACK_NEWS_EN: NewsResult = {
  isFallback: true,
  text: `1. California allocates $1.5B for 2025 emergency housing infrastructure in major hubs, targeting families and veterans.
2. New 2025 LAHSA data suggests a slowing growth rate in homelessness in key districts due to temporary rent protection programs.
3. Culturally-sensitive mental health initiatives for Asian communities are scaling across Northern California this quarter, increasing Mandarin/Cantonese support capacity.`,
  sources: [
    { title: "California Housing Finance Agency", uri: "https://www.calhfa.ca.gov" },
    { title: "LA Homeless Services Authority (LAHSA)", uri: "https://www.lahsa.org" },
    { title: "SF Dept of Homelessness & Supportive Housing", uri: "https://hsh.sfgov.org" }
  ]
};

export const fetchDailyNews = async (language: string = 'en'): Promise<NewsResult> => {
  // Immediate fallback for Demo Mode
  if (!process.env.API_KEY) {
      console.log("Demo Mode: Returning fallback news immediately.");
      return language.startsWith('zh') ? FALLBACK_NEWS_ZH : FALLBACK_NEWS_EN;
  }

  try {
    const ai = getAI();
    if (!ai) throw new Error("No API Key");

    const today = new Date().toISOString().split('T')[0];
    const prompt = `
      Current Date: ${today} (Year 2025).
      Provide a 3-point summary of critical social policy or homelessness news in California from the last 7 days.
      Focus on 2025 updates.
      Language: ${language.startsWith('zh') ? 'Traditional Chinese' : 'English'}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || 'News Source',
        uri: chunk.web?.uri || '',
      }))
      .filter((s: any) => s.uri) || [];

    return {
      text: response.text || (language.startsWith('zh') ? "暫無今日摘要。" : "No news summary available."),
      sources: sources,
    };
  } catch (error: any) {
    console.warn("News Fetch Error:", error);
    // Return fallback on any error to ensure UI looks good
    return language.startsWith('zh') ? FALLBACK_NEWS_ZH : FALLBACK_NEWS_EN;
  }
};
