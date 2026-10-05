import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
await mkdir('tmp/tests', { recursive: true });
await build({ entryPoints: ['tests/validator.test.ts'], bundle: true, jsx: 'automatic', platform: 'node', format: 'esm', packages: 'external', outfile: 'tmp/tests/validator.test.mjs' });
await import('../tmp/tests/validator.test.mjs');
