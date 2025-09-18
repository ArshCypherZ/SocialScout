import { GoogleGenAI, type GenerateContentResponse, type GenerateContentParameters } from '@google/genai';

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error('GEMINI_API_KEY is required');
}

const ai = new GoogleGenAI({ apiKey: geminiApiKey });

const model = 'gemini-2.0-flash'; 

interface AnalysisResult {
  professional_summary: string;
  key_topics_of_interest: string[];
  potential_red_flags: string[];
}

export async function analyzeContent(aggregatedText: string, founderName: string): Promise<AnalysisResult> {
  const prompt = `Analyze the following text from ${founderName}'s public profiles. Based on the content, generate a professional summary, identify key topics they discuss, and flag any potential character red flags.
**Content:** ${aggregatedText}
**Return ONLY a single, valid JSON object** matching this exact structure:
{ "professional_summary": "string", "key_topics_of_interest": ["string", "..."], "potential_red_flags": ["string", "..."] }`;

  const params: GenerateContentParameters = {
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    }
  };

  const response: GenerateContentResponse = await ai.models.generateContent(params);

  const jsonText = response.text;
  if (!jsonText) {
    throw new Error('No response text from Gemini');
  }

  const parsed = JSON.parse(jsonText) as AnalysisResult;
  return parsed;
}
