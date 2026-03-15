import { LlmProvider } from '../../providers/llm/llm.types.js';
import { CacheStore, InMemoryCacheStore } from '../../utils/cache.js';
import { env } from '../../config/env.js';

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
  constructor(
    private readonly llmProvider: LlmProvider,
    private readonly cache: CacheStore<MessageSuggestionsResponse> = new InMemoryCacheStore<MessageSuggestionsResponse>(),
    private readonly cacheTtlSeconds = env.CACHE_TTL_SECONDS,
  ) {}

  async generate(
    input: MessageSuggestionsInput,
  ): Promise<MessageSuggestionsResponse> {
    const cacheKey = buildCacheKey(input);
    const cachedResponse = this.cache.get(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const suggestions = await this.llmProvider.generateSuggestions(input);

      if (!isValidSuggestionsList(suggestions)) {
        return {
          suggestions: buildFallbackSuggestions(input),
          fallbackUsed: true,
        };
      }

      const response = {
        suggestions: suggestions.map((suggestion) => suggestion.trim()),
        fallbackUsed: false,
      };

      this.cache.set(cacheKey, response, this.cacheTtlSeconds);

      return response;
    } catch {
      return {
        suggestions: buildFallbackSuggestions(input),
        fallbackUsed: true,
      };
    }
  }
}

function buildCacheKey(input: MessageSuggestionsInput): string {
  return `${input.occasion.trim().toLowerCase()}::${input.relationship.trim().toLowerCase()}`;
}

export const messageSuggesterServiceInternals = {
  buildCacheKey,
};
