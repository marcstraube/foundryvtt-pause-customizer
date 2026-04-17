export default {
  // TypeScript files (auto-fix and re-stage)
  'src/**/*.ts': ['pnpm exec prettier --write', 'pnpm exec eslint --fix'],

  // JSON files (format only, exclude lock files and auto-generated files)
  '!(.vscode/**|pnpm-lock|tsconfig*|.prettierrc).json': ['pnpm exec prettier --write'],

  // Markdown files (format only)
  '**/*.md': ['pnpm exec prettier --write'],
};
