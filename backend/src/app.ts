import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './config/env.js';
import { messageSuggesterRouter } from './modules/message-suggester/message-suggester.routes.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()),
  }),
);
app.use(express.json({ limit: '10kb' }));

app.get('/health', (_request, response) => {
  response.status(200).json({
    data: {
      status: 'ok',
      service: 'backend',
      environment: env.NODE_ENV,
    },
    error: null,
  });
});

app.use('/api/v1/message-suggestions', messageSuggesterRouter);
