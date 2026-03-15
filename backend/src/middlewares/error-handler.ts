import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction,
) {
  console.error('Unhandled request error', {
    requestId: request.requestId,
    error,
  });

  response.status(500).json({
    data: null,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.',
    },
  });
}
