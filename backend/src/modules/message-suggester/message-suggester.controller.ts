import { Request, Response } from 'express';

import { messageSuggestionsSchema } from './message-suggester.schema.js';

export function createMessageSuggestions(
  request: Request,
  response: Response,
) {
  const parsedBody = messageSuggestionsSchema.safeParse(request.body);

  if (!parsedBody.success) {
    return response.status(400).json({
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: parsedBody.error.issues[0]?.message ?? 'Invalid request body.',
      },
    });
  }

  return response.status(200).json({
    data: {
      suggestions: [
        `Warm wishes for your ${parsedBody.data.occasion}.`,
        `A thoughtful note for your ${parsedBody.data.relationship}.`,
      ],
      fallbackUsed: false,
    },
    error: null,
  });
}
