// @ts-check

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      reporter: ['lcov'],
    },
    // setupFiles: ['console-fail-test/setup.js'],
    include: ['./tests/**/*.{test,spec}.ts'],
  },
});
