const ccwc = require('./ccwc');
const { exec } = require('child_process');

beforeEach(() => {
  jest.clearAllMocks();
});

async function executeTest(parameters, expectedCommand) {
  Object.defineProperty(process, 'argv', {
    value: ['node', 'wcTool/ccwc.js', ...parameters],
  });

  const consoleSpy = jest.spyOn(console, 'log');

  await ccwc();

  return new Promise((resolve, reject) => {
    exec(expectedCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        reject(error);
        return;
      }

      const output = stdout.trim(); // Trim the output to remove any leading/trailing whitespaces

      // Handle errors from stderr if needed
      if (stderr) {
        console.error('Command error:');
        console.error(stderr);
        reject(stderr);
      }

      const consoleOutput = consoleSpy.mock.calls.map(args => args.join(' ')).join('\n').trim();

      expect(consoleOutput).toEqual(output);
      resolve();
    });
  });
}

test('no parameters multiple files test', async () => {
  await executeTest(['wcTool/test.txt', 'wcTool/test2.txt'], 'wc wcTool/test.txt wcTool/test2.txt');
});

test('lcw parameters multiple files test', async () => {
  await executeTest(['-lcw', 'wcTool/test.txt', 'wcTool/test2.txt'], 'wc -lcw wcTool/test.txt wcTool/test2.txt');
});

test('cm parameters multiple files test', async () => {
  await executeTest(['-cm', 'wcTool/test.txt', 'wcTool/test2.txt'], 'wc -cm wcTool/test.txt wcTool/test2.txt');
});

test('mc parameters multiple files test', async () => {
  await executeTest(['-mc', 'wcTool/test.txt', 'wcTool/test2.txt'], 'wc -mc wcTool/test.txt wcTool/test2.txt');
});

test('l parameter single file test', async () => {
  await executeTest(['-l', 'wcTool/test.txt'], 'wc -l wcTool/test.txt');
});

test('c parameter single file test', async () => {
  await executeTest(['-c', 'wcTool/test.txt'], 'wc -c wcTool/test.txt');
});

test('m parameter single file test', async () => {
  await executeTest(['-m', 'wcTool/test.txt'], 'wc -m wcTool/test.txt');
});

test('w parameter single file test', async () => {
  await executeTest(['-w', 'wcTool/test.txt'], 'wc -w wcTool/test.txt');
});
