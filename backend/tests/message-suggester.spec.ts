import assert from 'node:assert/strict';

import request from 'supertest';

import { app } from '../src/app.js';

export async function runMessageSuggesterValidRequestSpec() {
  const response = await request(app)
    .post('/api/v1/message-suggestions')
    .send({
      occasion: 'birthday',
      relationship: 'friend',
    });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    data: {
      suggestions: [
        'Warm wishes for your birthday.',
        'A thoughtful note for your friend.',
      ],
      fallbackUsed: false,
    },
    error: null,
  });
}

export async function runMessageSuggesterInvalidRequestSpec() {
  const response = await request(app)
    .post('/api/v1/message-suggestions')
    .send({
      occasion: '',
      relationship: 'friend',
    });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    data: null,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'occasion is required.',
    },
  });
}
