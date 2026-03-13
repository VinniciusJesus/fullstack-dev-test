import {
  GenerateSuggestionsInput,
  LlmProvider,
} from './llm.types.js';

export class GeminiClient implements LlmProvider {
  async generateSuggestions(_input: GenerateSuggestionsInput): Promise<string[]> {
    throw new Error('Gemini client not implemented yet.');
  }
}
