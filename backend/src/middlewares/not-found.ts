import { Request, Response } from 'express';

export function notFoundMiddleware(_request: Request, response: Response) {
  response.status(404).json({
    data: null,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found.',
    },
  });
}
