/**
 * Pack all of our packages so we can "install" them later.
 * We do this here rather than per test so that we only have
 * to do it once per test run as it takes a decent chunk of
 * time to do.
 * This also ensures all of the tests are guaranteed to run
 * against the exact same version of the package.
 */

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import tmp from 'tmp';
import type { GlobalSetupContext } from 'vitest/node';

interface PackageJSON {
  name: string;
  private?: boolean;
  devDependencies: Record<string, string>;
}

declare module 'vitest' {
  export interface ProvidedContext {
    tseslintPackages: PackageJSON['devDependencies'];
  }
}

export default function setup({ provide }: GlobalSetupContext) {
  const PACKAGES_DIR = path.resolve(__dirname, '..', '..');
  const PACKAGES = fs.readdirSync(PACKAGES_DIR);

  const tarFolder = tmp.dirSync({
    // because of how jest executes things, we need to ensure
    // the temp files hang around
    keep: true,
    unsafeCleanup: true,
  });

  const tseslintPackages: PackageJSON['devDependencies'] = {};
  for (const pkg of PACKAGES) {
    const packageDir = path.join(PACKAGES_DIR, pkg);
    const packagePath = path.join(packageDir, 'package.json');
    if (!fs.existsSync(packagePath)) {
      continue;
    }

    const packageJson = require(packagePath) as PackageJSON;
    if (packageJson.private === true) {
      continue;
    }

    const result = spawnSync('npm', ['pack', packageDir], {
      cwd: tarFolder.name,
      encoding: 'utf-8',
      shell: process.platform === 'win32',
    });
    const stdoutLines = result.stdout.trim().split('\n');
    const tarball = stdoutLines[stdoutLines.length - 1];

    tseslintPackages[packageJson.name] =
      `file:${path.join(tarFolder.name, tarball)}`;
  }

  console.log('Finished packing local packages.');
  provide('tseslintPackages', tseslintPackages);

  return function teardown(): void {
    tarFolder.removeCallback();
  };
}
