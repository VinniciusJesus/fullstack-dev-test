import assert from 'node:assert/strict';

import request from 'supertest';

import { isAllowedOrigin } from '../src/config/cors.js';
import { env } from '../src/config/env.js';
import { app } from '../src/app.js';

export async function runNotFoundSpec() {
  const response = await request(app).get('/unknown-route');

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, {
    data: null,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found.',
    },
  });
}

export async function runUnhandledErrorSpec() {
  const response = await request(app).get('/health?fail=true');

  assert.equal(response.status, 500);
  assert.deepEqual(response.body, {
    data: null,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.',
    },
  });
}

export async function runRequestIdPassthroughSpec() {
  const response = await request(app)
    .get('/health')
    .set('x-request-id', 'test-request-id');

  assert.equal(response.status, 200);
  assert.equal(response.headers['x-request-id'], 'test-request-id');
}

export async function runRateLimitSpec() {
  let lastResponse;

  for (let index = 0; index < env.RATE_LIMIT_MAX + 1; index += 1) {
    lastResponse = await request(app)
      .post('/api/v1/message-suggestions')
      .set('x-forwarded-for', '198.51.100.10')
      .send({
        occasion: 'birthday',
        relationship: 'friend',
      });
  }

  assert.ok(lastResponse);
  assert.equal(lastResponse.status, 429);
  assert.deepEqual(lastResponse.body, {
    data: null,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    },
  });
}

export async function runCorsDevelopmentOriginSpec() {
  assert.equal(isAllowedOrigin('http://localhost:54321'), true);
  assert.equal(isAllowedOrigin('http://127.0.0.1:5173'), true);
}
