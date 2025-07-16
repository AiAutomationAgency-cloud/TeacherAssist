import { GoogleGenAI } from "@google/genai";

// Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface GenerateResponseRequest {
  inquiryText: string;
  inquiryType: string;
  targetLanguage: string;
  teacherName?: string;
  subject?: string;
}

export interface GenerateResponseResult {
  response: string;
  detectedLanguage: string;
  responseTime: number;
}

export async function generateResponse(request: GenerateResponseRequest): Promise<GenerateResponseResult> {
  const startTime = Date.now();
  
  try {
    const languageMap = {
      'en': 'English',
      'es': 'Spanish', 
      'fr': 'French',
      'de': 'German',
      'zh': 'Chinese'
    };

    const targetLanguageName = languageMap[request.targetLanguage as keyof typeof languageMap] || 'English';

    const systemPrompt = `You are an experienced and professional teacher responding to a parent or student inquiry. 

Context:
- Inquiry Type: ${request.inquiryType}
- Teacher Name: ${request.teacherName || "the teacher"}
- Subject: ${request.subject || ""}

Instructions:
1. Generate a professional, helpful, and empathetic response to the following inquiry
2. Keep the tone warm but professional
3. Provide specific guidance when possible
4. Always offer additional support if needed
5. Sign with "Best regards, ${request.teacherName || "[Teacher Name]"}"
6. Respond in ${targetLanguageName}
7. Detect the language of the original inquiry

Provide your response in JSON format with:
{
  "response": "your generated response",
  "detectedLanguage": "language code (en/es/fr/de/zh)"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            response: { type: "string" },
            detectedLanguage: { type: "string" },
          },
          required: ["response", "detectedLanguage"],
        },
      },
      contents: `Original Inquiry: "${request.inquiryText}"`,
    });

    const rawJson = response.text;
    console.log(`Generated response JSON: ${rawJson}`);

    if (rawJson) {
      const result = JSON.parse(rawJson);
      const responseTime = Date.now() - startTime;

      return {
        response: result.response || "I apologize, but I'm having trouble generating a response right now. Please try again.",
        detectedLanguage: result.detectedLanguage || 'en',
        responseTime
      };
    } else {
      throw new Error("Empty response from Gemini model");
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    const responseTime = Date.now() - startTime;
    
    return {
      response: "I apologize, but I'm currently unable to generate an automated response. Please compose your response manually or try again later.",
      detectedLanguage: 'en',
      responseTime
    };
  }
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const languageNames = {
      'en': 'English',
      'es': 'Spanish', 
      'fr': 'French',
      'de': 'German',
      'zh': 'Chinese'
    };

    const targetLanguageName = languageNames[targetLanguage as keyof typeof languageNames] || 'English';

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        `You are a professional translator. Translate the following text to ${targetLanguageName} while maintaining the professional tone and educational context. Preserve formatting and structure.

Text to translate: ${text}`
      ],
    });

    return response.text || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

export async function detectLanguage(text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        `Detect the language of the given text and respond with only the language code: en (English), es (Spanish), fr (French), de (German), or zh (Chinese). If uncertain, default to 'en'.

Text: ${text}`
      ],
    });

    const detectedLang = response.text?.trim().toLowerCase() || 'en';
    
    // Validate the response is one of our supported languages
    const supportedLanguages = ['en', 'es', 'fr', 'de', 'zh'];
    return supportedLanguages.includes(detectedLang) ? detectedLang : 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English
  }
}
