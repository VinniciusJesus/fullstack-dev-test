import {
  GenerateSuggestionsInput,
  LlmProvider,
} from './llm.types.js';
import { env } from '../../config/env.js';

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function extractTextFromGeminiResponse(
  payload: GeminiGenerateContentResponse,
): string {
  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text?.trim())
    .find((part) => Boolean(part));

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text;
}

function stripCodeFence(value: string): string {
  return value
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
}

function parseSuggestionsFromText(text: string): string[] {
  const normalizedText = stripCodeFence(text);
  const parsed = JSON.parse(normalizedText) as { suggestions?: unknown };

  if (!Array.isArray(parsed.suggestions)) {
    throw new Error('Gemini response does not contain a suggestions array.');
  }

  const suggestions = parsed.suggestions
    .filter((suggestion): suggestion is string => typeof suggestion === 'string')
    .map((suggestion) => suggestion.trim())
    .filter(Boolean);

  if (suggestions.length < 2 || suggestions.length > 3) {
    throw new Error('Gemini response must contain 2 or 3 suggestions.');
  }

  return suggestions;
}

function buildPrompt(input: GenerateSuggestionsInput): string {
  return [
    'Gere mensagens curtas para cartao presente.',
    'Responda em portugues do Brasil.',
    'Retorne apenas JSON usando exatamente este formato:',
    '{"suggestions":["mensagem 1","mensagem 2"]}',
    'Regras:',
    '- Retorne 2 ou 3 sugestoes',
    '- Cada sugestao deve ter 1 ou 2 frases curtas',
    '- Mantenha um tom caloroso, natural e apropriado para um cartao presente',
    '- Nao inclua numeracao nem explicacao extra',
    `Occasion: ${input.occasion}`,
    `Relationship: ${input.relationship}`,
  ].join('\n');
}

export class GeminiClient implements LlmProvider {
  private readonly apiUrl: string;

  constructor(
    private readonly apiKey = env.GEMINI_API_KEY,
    private readonly model = env.GEMINI_MODEL,
    private readonly timeoutMs = env.GEMINI_TIMEOUT_MS,
  ) {
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
  }

  async generateSuggestions(input: GenerateSuggestionsInput): Promise<string[]> {
    if (!this.apiKey) {
      throw new Error('Missing GEMINI_API_KEY.');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: buildPrompt(input),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Gemini API request failed with status ${response.status}.`);
      }

      const payload = (await response.json()) as GeminiGenerateContentResponse;
      const text = extractTextFromGeminiResponse(payload);

      return parseSuggestionsFromText(text);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Gemini API request timed out.');
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const geminiClientInternals = {
  buildPrompt,
  extractTextFromGeminiResponse,
  parseSuggestionsFromText,
  stripCodeFence,
};
