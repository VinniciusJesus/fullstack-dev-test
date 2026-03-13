import assert from 'node:assert/strict';

import request from 'supertest';

import { app } from '../src/app.js';

export async function runHealthSpec() {
  const response = await request(app).get('/health');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    data: {
      status: 'ok',
      service: 'backend',
      environment: 'development',
    },
    error: null,
  });
}
