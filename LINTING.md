# ESLint and Prettier Setup

This project now includes ESLint and Prettier configurations for code quality and formatting.

## What's Included

### ESLint Configuration (`.eslintrc.json`)

- **Base rules**: ESLint recommended rules
- **TypeScript support**: `@typescript-eslint/recommended` rules
- **React support**: React and React Hooks rules
- **Prettier integration**: Prettier rules to avoid conflicts
- **Custom rules**: Project-specific overrides

### Prettier Configuration (`.prettierrc.json`)

- **Consistent formatting**: Single quotes, semicolons, 2-space indentation
- **Line length**: 80 characters
- **Trailing commas**: ES5 compatible
- **JSX formatting**: Single quotes in JSX

### VS Code Integration (`.vscode/`)

- **Auto-format on save**: Prettier runs automatically
- **ESLint auto-fix**: Fixes issues on save
- **Recommended extensions**: ESLint and Prettier extensions

## Available Scripts

```bash
# Lint all files
npm run lint

# Lint and auto-fix issues
npm run lint:fix

# Format all files with Prettier
npm run format

# Check if files are properly formatted
npm run format:check

# Run TypeScript type checking
npm run type-check

# Run all checks (type-check, lint, format)
npm run check-all
```

## Usage

### Command Line

```bash
# Check for linting issues
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format all files
npm run format
```

### VS Code

1. Install recommended extensions when prompted
2. Files will be automatically formatted on save
3. ESLint issues will be highlighted in the editor
4. Auto-fix will run on save for fixable issues

### Pre-commit Workflow

Before committing code, run:

```bash
npm run check-all
```

This will:

1. Check TypeScript types
2. Run ESLint checks
3. Verify Prettier formatting

## Configuration Details

### ESLint Rules

- **TypeScript**: Strict type checking with some relaxed rules for development
- **React**: Modern React patterns (no need for React imports in JSX)
- **Unused variables**: Error for unused variables (except those starting with `_`)
- **Console statements**: Allowed (can be restricted for production)

### File-specific Overrides

- **Main/Preload processes**: Node.js environment, React rules disabled
- **Renderer process**: Browser environment, full React rules
- **Test files**: Relaxed unused variable rules

### Prettier Settings

- **Print width**: 80 characters
- **Tab width**: 2 spaces
- **Semicolons**: Always
- **Quotes**: Single quotes
- **Trailing commas**: ES5 compatible
- **Bracket spacing**: Enabled

## Customization

### Adding New Rules

Edit `.eslintrc.json` to add or modify rules:

```json
{
  "rules": {
    "your-rule": "error"
  }
}
```

### Changing Prettier Settings

Edit `.prettierrc.json`:

```json
{
  "printWidth": 100,
  "tabWidth": 4
}
```

### Ignoring Files

Add patterns to `.eslintignore` or `.prettierignore`:

```
dist/
build/
*.min.js
```

## Common Issues

### ESLint Errors

- **Unused variables**: Remove unused imports/variables or prefix with `_`
- **Missing dependencies**: Add missing dependencies to useEffect arrays
- **Type issues**: Fix TypeScript type errors

### Prettier Conflicts

- **ESLint formatting rules**: Disabled by `eslint-config-prettier`
- **Editor settings**: Make sure VS Code uses Prettier as default formatter

### Performance

- **Large files**: ESLint may be slow on very large files
- **Many files**: Use `--cache` flag for faster subsequent runs

## Integration with CI/CD

Add to your CI pipeline:

```yaml
- name: Lint and Format Check
  run: |
    npm run type-check
    npm run lint
    npm run format:check
```

## Dependencies

### ESLint

- `eslint`: Core ESLint package
- `@typescript-eslint/eslint-plugin`: TypeScript rules
- `@typescript-eslint/parser`: TypeScript parser
- `eslint-plugin-react`: React rules
- `eslint-plugin-react-hooks`: React Hooks rules
- `eslint-plugin-react-refresh`: React Fast Refresh rules

### Prettier

- `prettier`: Core Prettier package
- `eslint-config-prettier`: Disables conflicting ESLint rules
- `eslint-plugin-prettier`: Runs Prettier as ESLint rule

All dependencies are installed as `devDependencies` and won't affect your production bundle.
