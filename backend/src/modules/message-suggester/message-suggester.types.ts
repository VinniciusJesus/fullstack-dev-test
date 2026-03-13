export type MessageSuggestionsRequest = {
  occasion: string;
  relationship: string;
};

export type MessageSuggestionsResponse = {
  suggestions: string[];
  fallbackUsed: boolean;
};
