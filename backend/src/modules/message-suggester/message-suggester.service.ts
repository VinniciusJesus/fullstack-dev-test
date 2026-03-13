import { LlmProvider } from '../../providers/llm/llm.types.js';

import { buildFallbackSuggestions } from './message-suggester.fallback.js';
import { MessageSuggestionsInput } from './message-suggester.schema.js';
import { MessageSuggestionsResponse } from './message-suggester.types.js';

function isValidSuggestionsList(suggestions: string[]): boolean {
  if (suggestions.length < 2 || suggestions.length > 3) {
    return false;
  }

  return suggestions.every(
    (suggestion) => typeof suggestion === 'string' && suggestion.trim().length > 0,
  );
}

export class MessageSuggesterService {
  constructor(private readonly llmProvider: LlmProvider) {}

  async generate(
    input: MessageSuggestionsInput,
  ): Promise<MessageSuggestionsResponse> {
    try {
      const suggestions = await this.llmProvider.generateSuggestions(input);

      if (!isValidSuggestionsList(suggestions)) {
        return {
          suggestions: buildFallbackSuggestions(input),
          fallbackUsed: true,
        };
      }

      return {
        suggestions: suggestions.map((suggestion) => suggestion.trim()),
        fallbackUsed: false,
      };
    } catch {
      return {
        suggestions: buildFallbackSuggestions(input),
        fallbackUsed: true,
      };
    }
  }
}
