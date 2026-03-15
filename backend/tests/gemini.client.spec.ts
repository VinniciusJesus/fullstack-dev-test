import assert from 'node:assert/strict';

import {
  GeminiClient,
  geminiClientInternals,
} from '../src/providers/llm/gemini.client.js';

type MockFetchResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

export async function runGeminiClientSuccessSpec() {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = ((async () =>
    ({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: '{"suggestions":["Happy birthday! Wishing you a joyful day.","Hope your day is filled with love and celebration."]}',
                },
              ],
            },
          },
        ],
      }),
    }) as MockFetchResponse) as unknown) as typeof fetch;

  try {
    const client = new GeminiClient('test-key', 'test-model', 1000);
    const suggestions = await client.generateSuggestions({
      occasion: 'birthday',
      relationship: 'friend',
    });

    assert.deepEqual(suggestions, [
      'Happy birthday! Wishing you a joyful day.',
      'Hope your day is filled with love and celebration.',
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

export async function runGeminiClientHttpErrorSpec() {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = ((async () =>
    ({
      ok: false,
      status: 429,
      json: async () => ({}),
    }) as MockFetchResponse) as unknown) as typeof fetch;

  try {
    const client = new GeminiClient('test-key', 'test-model', 1000);

    await assert.rejects(
      () =>
        client.generateSuggestions({
          occasion: 'birthday',
          relationship: 'friend',
        }),
      /status 429/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
}

export async function runGeminiClientInvalidPayloadSpec() {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = ((async () =>
    ({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: '{"unexpected":["oops"]}',
                },
              ],
            },
          },
        ],
      }),
    }) as MockFetchResponse) as unknown) as typeof fetch;

  try {
    const client = new GeminiClient('test-key', 'test-model', 1000);

    await assert.rejects(
      () =>
        client.generateSuggestions({
          occasion: 'birthday',
          relationship: 'friend',
        }),
      /suggestions array/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
}

export async function runGeminiClientCodeFenceParserSpec() {
  const suggestions = geminiClientInternals.parseSuggestionsFromText(`\`\`\`json
{"suggestions":["Message one.","Message two."]}
\`\`\``);

  assert.deepEqual(suggestions, ['Message one.', 'Message two.']);
}

export async function runGeminiClientPromptLanguageSpec() {
  const prompt = geminiClientInternals.buildPrompt({
    occasion: 'birthday',
    relationship: 'friend',
  });

  assert.match(prompt, /portugues do Brasil/i);
  assert.match(prompt, /Retorne 2 ou 3 sugestoes/);
}
