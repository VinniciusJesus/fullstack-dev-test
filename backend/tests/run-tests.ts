import { runHealthSpec } from './health.spec.js';

type TestCase = {
  name: string;
  run: () => Promise<void>;
};

const tests: TestCase[] = [
  {
    name: 'GET /health returns the backend health status',
    run: runHealthSpec,
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
