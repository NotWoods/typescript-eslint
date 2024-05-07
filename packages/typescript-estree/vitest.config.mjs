// @ts-check

import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.config.base.mjs';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['./tests/lib/*.test.ts'],
      pool: 'forks', // use child_process, which supports process.cwd()
    },
  }),
);
