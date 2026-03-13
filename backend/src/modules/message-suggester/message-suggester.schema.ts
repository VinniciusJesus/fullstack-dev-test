import { z } from 'zod';

export const messageSuggestionsSchema = z.object({
  occasion: z
    .string()
    .trim()
    .min(1, 'occasion is required.')
    .max(50, 'occasion must be at most 50 characters.'),
  relationship: z
    .string()
    .trim()
    .min(1, 'relationship is required.')
    .max(50, 'relationship must be at most 50 characters.'),
});

export type MessageSuggestionsInput = z.infer<typeof messageSuggestionsSchema>;
