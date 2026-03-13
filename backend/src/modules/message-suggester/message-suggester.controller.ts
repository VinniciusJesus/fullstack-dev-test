import { Request, Response } from 'express';

import { GeminiClient } from '../../providers/llm/gemini.client.js';
import { messageSuggestionsSchema } from './message-suggester.schema.js';
import { MessageSuggesterService } from './message-suggester.service.js';

const messageSuggesterService = new MessageSuggesterService(new GeminiClient());

export async function createMessageSuggestions(
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

  const result = await messageSuggesterService.generate(parsedBody.data);

  return response.status(200).json({
    data: result,
    error: null,
  });
}
