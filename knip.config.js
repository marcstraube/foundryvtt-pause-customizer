/** @type {import('knip').KnipConfig} */
export default {
  // Entry points (main module entry)
  entry: ['src/pause-customizer.ts'],

  // Project files to analyze
  project: ['src/**/*.ts'],

  // Ignore patterns (build artifacts, docs, vendor files)
  ignore: ['node_modules/**', 'dist/**', '**/*.min.js'],

  // Ignore dependencies that are used but knip can't auto-detect
  ignoreDependencies: [
    // ESLint plugins (used in config, not imported)
    '@eslint/js',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'eslint-plugin-import',

    // Git hooks and commit tools (executed via git, not imports)
    'lint-staged',

    // Analysis tools (self-referential, run via CLI)
    'knip',
    'prettier',
  ],
};
