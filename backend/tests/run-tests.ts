import {
  runCorsDevelopmentOriginSpec,
  runNotFoundSpec,
  runRateLimitSpec,
  runRequestIdPassthroughSpec,
  runUnhandledErrorSpec,
} from './app-security.spec.js';
import { runHealthSpec } from './health.spec.js';
import {
  runGeminiClientCodeFenceParserSpec,
  runGeminiClientHttpErrorSpec,
  runGeminiClientInvalidPayloadSpec,
  runGeminiClientPromptLanguageSpec,
  runGeminiClientSuccessSpec,
} from './gemini.client.spec.js';
import {
  runMessageSuggesterInvalidRequestSpec,
  runMessageSuggesterValidRequestSpec,
} from './message-suggester.spec.js';
import {
  runMessageSuggesterServiceCacheHitSpec,
  runMessageSuggesterServiceDoesNotCacheFallbackSpec,
  runMessageSuggesterServiceEmptyResponseSpec,
  runMessageSuggesterServiceInvalidResponseSpec,
  runMessageSuggesterServiceProviderFailureSpec,
  runMessageSuggesterServiceSuccessSpec,
} from './message-suggester.service.spec.js';

type TestCase = {
  name: string;
  run: () => Promise<void>;
};

const tests: TestCase[] = [
  {
    name: 'GET /health returns the backend health status',
    run: runHealthSpec,
  },
  {
    name: 'Responses expose a supplied request id header',
    run: runRequestIdPassthroughSpec,
  },
  {
    name: 'Development CORS accepts localhost and 127.0.0.1 on dynamic ports',
    run: runCorsDevelopmentOriginSpec,
  },
  {
    name: 'Unknown routes return a standardized not found response',
    run: runNotFoundSpec,
  },
  {
    name: 'Unhandled errors return a standardized internal error response',
    run: runUnhandledErrorSpec,
  },
  {
    name: 'GeminiClient returns normalized suggestions from a valid API response',
    run: runGeminiClientSuccessSpec,
  },
  {
    name: 'GeminiClient throws for non-success HTTP responses',
    run: runGeminiClientHttpErrorSpec,
  },
  {
    name: 'GeminiClient throws for malformed Gemini payloads',
    run: runGeminiClientInvalidPayloadSpec,
  },
  {
    name: 'GeminiClient parses JSON wrapped in code fences',
    run: runGeminiClientCodeFenceParserSpec,
  },
  {
    name: 'GeminiClient prompt requires Brazilian Portuguese output',
    run: runGeminiClientPromptLanguageSpec,
  },
  {
    name: 'POST /api/v1/message-suggestions returns placeholder suggestions for a valid request',
    run: runMessageSuggesterValidRequestSpec,
  },
  {
    name: 'POST /api/v1/message-suggestions rejects an invalid request body',
    run: runMessageSuggesterInvalidRequestSpec,
  },
  {
    name: 'MessageSuggesterService returns provider suggestions on success',
    run: runMessageSuggesterServiceSuccessSpec,
  },
  {
    name: 'MessageSuggesterService uses fallback when the provider fails',
    run: runMessageSuggesterServiceProviderFailureSpec,
  },
  {
    name: 'MessageSuggesterService reuses cached provider responses for equivalent inputs',
    run: runMessageSuggesterServiceCacheHitSpec,
  },
  {
    name: 'MessageSuggesterService does not cache fallback responses',
    run: runMessageSuggesterServiceDoesNotCacheFallbackSpec,
  },
  {
    name: 'MessageSuggesterService uses fallback when the provider returns an empty list',
    run: runMessageSuggesterServiceEmptyResponseSpec,
  },
  {
    name: 'MessageSuggesterService uses fallback when the provider returns invalid suggestions',
    run: runMessageSuggesterServiceInvalidResponseSpec,
  },
  {
    name: 'API rate limiting returns a standardized error response',
    run: runRateLimitSpec,
  },
];

async function run() {
  let failed = false;

  for (const testCase of tests) {
    try {
      await testCase.run();
      console.log(`PASS ${testCase.name}`);
    } catch (error) {
      failed = true;
      console.error(`FAIL ${testCase.name}`);
      console.error(error);
    }
  }

  if (failed) {
    process.exitCode = 1;
    return;
  }

  console.log(`Executed ${tests.length} test(s) successfully.`);
}

void run();
