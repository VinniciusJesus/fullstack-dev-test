import { MessageSuggestionsInput } from './message-suggester.schema.js';

const fallbackSuggestionsByOccasion: Record<string, string[]> = {
  birthday: [
    'Happy birthday! Wishing you a year full of joy and good surprises.',
    'Hope your special day is filled with love, laughter, and memorable moments.',
  ],
  wedding: [
    'Wishing you both a lifetime of love, partnership, and happiness.',
    'May this new chapter bring joy, harmony, and many beautiful memories.',
  ],
  'thank you': [
    'Thank you so much for your kindness and support. It truly means a lot.',
    'I am very grateful for everything you have done. Thank you for being so thoughtful.',
  ],
};

const genericFallbackSuggestions = [
  'Wishing you all the best and hoping this message brings a smile to your day.',
  'Sending warm thoughts and heartfelt wishes for this special moment.',
];

export function buildFallbackSuggestions(
  input: MessageSuggestionsInput,
): string[] {
  const normalizedOccasion = input.occasion.trim().toLowerCase();

  return (
    fallbackSuggestionsByOccasion[normalizedOccasion] ??
    genericFallbackSuggestions
  );
}
