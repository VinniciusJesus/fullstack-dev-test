import assert from 'node:assert/strict';

import { MessageSuggesterService } from '../src/modules/message-suggester/message-suggester.service.js';
import { LlmProvider } from '../src/providers/llm/llm.types.js';

class SuccessfulProviderStub implements LlmProvider {
  async generateSuggestions(): Promise<string[]> {
    return [
      'Happy birthday! Hope your day is amazing.',
      'Wishing you laughter, love, and great memories.',
    ];
  }
}

class FailingProviderStub implements LlmProvider {
  async generateSuggestions(): Promise<string[]> {
    throw new Error('Provider failure');
  }
}

class EmptyProviderStub implements LlmProvider {
  async generateSuggestions(): Promise<string[]> {
    return [];
  }
}

class InvalidProviderStub implements LlmProvider {
  async generateSuggestions(): Promise<string[]> {
    return [''];
  }
}

export async function runMessageSuggesterServiceSuccessSpec() {
  const service = new MessageSuggesterService(new SuccessfulProviderStub());

  const result = await service.generate({
    occasion: 'birthday',
    relationship: 'friend',
  });

  assert.deepEqual(result, {
    suggestions: [
      'Happy birthday! Hope your day is amazing.',
      'Wishing you laughter, love, and great memories.',
    ],
    fallbackUsed: false,
  });
}

export async function runMessageSuggesterServiceProviderFailureSpec() {
  const service = new MessageSuggesterService(new FailingProviderStub());

  const result = await service.generate({
    occasion: 'birthday',
    relationship: 'friend',
  });

  assert.equal(result.fallbackUsed, true);
  assert.equal(result.suggestions.length, 2);
}

export async function runMessageSuggesterServiceEmptyResponseSpec() {
  const service = new MessageSuggesterService(new EmptyProviderStub());

  const result = await service.generate({
    occasion: 'thank you',
    relationship: 'parent',
  });

  assert.equal(result.fallbackUsed, true);
  assert.equal(result.suggestions.length, 2);
}

export async function runMessageSuggesterServiceInvalidResponseSpec() {
  const service = new MessageSuggesterService(new InvalidProviderStub());

  const result = await service.generate({
    occasion: 'wedding',
    relationship: 'colleague',
  });

  assert.equal(result.fallbackUsed, true);
  assert.equal(result.suggestions.length, 2);
}
