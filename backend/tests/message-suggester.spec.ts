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
  assert.equal(response.body.error, null);
  assert.equal(typeof response.body.data.fallbackUsed, 'boolean');
  assert.ok(response.body.data.suggestions.length >= 2);
  assert.ok(response.body.data.suggestions.length <= 3);
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
