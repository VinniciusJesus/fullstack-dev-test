import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { env } from './config/env.js';
import { errorHandler } from './middlewares/error-handler.js';
import { notFoundMiddleware } from './middlewares/not-found.js';
import { requestIdMiddleware } from './middlewares/request-id.js';
import { messageSuggesterRouter } from './modules/message-suggester/message-suggester.routes.js';

export const app = express();

const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_request, response) => {
    response.status(429).json({
      data: null,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
      },
    });
  },
});

app.use(requestIdMiddleware);
app.use(helmet());
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()),
  }),
);
app.use(express.json({ limit: '10kb' }));

app.get('/health', (request, response, next) => {
  if (request.query.fail === 'true') {
    next(new Error('Forced health error'));
    return;
  }

  response.status(200).json({
    data: {
      status: 'ok',
      service: 'backend',
      environment: env.NODE_ENV,
    },
    error: null,
  });
});

app.use('/api', apiRateLimiter);
app.use('/api/v1/message-suggestions', messageSuggesterRouter);
app.use(notFoundMiddleware);
app.use(errorHandler);
