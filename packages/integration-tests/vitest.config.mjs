// @ts-check

import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.config.base.mjs';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        enabled: false,
      },
      globalSetup: './tools/pack-packages.ts',
      include: ['/tests/*.test.ts'],
      root: __dirname,
      testTimeout: 60000,
    },
  }),
);
