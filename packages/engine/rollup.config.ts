import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
// import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  external: [],
  plugins: [
    resolve(),
    commonjs(),
    // terser(),
    // @see https://github.com/rollup/plugins/issues/247
    // The rollup config is set up so that it will load and transpile all TypeScript files using the rollup-plugin-typescript2 plugin.
    // As of today, this one is still more suitable than the official @rollup/plugin-typescript because the latter cannot emit TypeScript definition files.
    // Which would mean that our UI Library would not export any types to consumers.
    // We passed an option to the typescript plugin called useTsconfigDeclarationDir.
    // This one tells the plugin to use the declarationDir option from the tsconfig.json.
    // All other TypeScript options that we have set will already be read from the tsconfig.json.
    // This means we run TypeScript through Rollup, but all TypeScript related settings reside in the tsconfig.json.

    typescript({
      tsconfig: './tsconfig.build.json',
      useTsconfigDeclarationDir: true,
    }),
  ],
};
