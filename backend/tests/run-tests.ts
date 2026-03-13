import { runHealthSpec } from './health.spec.js';
import {
  runMessageSuggesterInvalidRequestSpec,
  runMessageSuggesterValidRequestSpec,
} from './message-suggester.spec.js';

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
    name: 'POST /api/v1/message-suggestions returns placeholder suggestions for a valid request',
    run: runMessageSuggesterValidRequestSpec,
  },
  {
    name: 'POST /api/v1/message-suggestions rejects an invalid request body',
    run: runMessageSuggesterInvalidRequestSpec,
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
