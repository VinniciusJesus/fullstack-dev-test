import { Router } from 'express';

import { createMessageSuggestions } from './message-suggester.controller.js';

export const messageSuggesterRouter = Router();

messageSuggesterRouter.post('/', createMessageSuggestions);
