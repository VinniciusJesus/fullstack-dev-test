export type GenerateSuggestionsInput = {
  occasion: string;
  relationship: string;
};

export interface LlmProvider {
  generateSuggestions(input: GenerateSuggestionsInput): Promise<string[]>;
}
