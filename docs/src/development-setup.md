# Development Setup

This guide will help you set up your development environment for contributing to Peeka2.

## Prerequisites

### Required Software

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended

### Recommended VS Code Extensions

- TypeScript and JavaScript Language Features
- ESLint (when configured)
- Prettier (when configured)
- styled-components syntax highlighting

## Initial Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub first
git clone https://github.com/yourusername/peeka2.git
cd peeka2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Setup

```bash
# Run development mode
npm run electron:dev
```

## Development Workflow

### Available Scripts

```bash
# Development
npm run electron:dev   # Start full dev environment
npm run dev           # Start Vite only (no Electron)

# Building
npm run build         # Build all components
npm run build:main    # Build main process only
npm run build:preload # Build preload only
npm run build:renderer # Build renderer only

# Production
npm run start         # Run production build
npm run electron:build # Create distribution package

# Utilities
npm run clean         # Clean build artifacts
npm run debug         # Run with debug logging
```

### Development Mode Features

- **Hot Module Replacement**: Instant updates in renderer
- **Auto-restart**: Main process restarts on changes
- **Source Maps**: Full debugging support
- **DevTools**: Electron DevTools pre-installed

## Project Structure

### Key Directories

```
peeka2/
├── src/
│   ├── main/         # Electron main process
│   ├── preload/      # Preload scripts
│   ├── renderer/     # React application
│   └── shared/       # Shared types
├── dist/             # Build output
├── release/          # Distribution packages
└── node_modules/     # Dependencies
```

### TypeScript Configuration

- `tsconfig.json`: Base configuration
- `tsconfig.main.json`: Main process config
- `tsconfig.preload.json`: Preload config

## Making Changes

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Development Cycle

1. Make changes in appropriate directory
2. Test in development mode
3. Build and test production mode
4. Commit changes

### 3. Code Style

- Use TypeScript for all new code
- Follow existing patterns
- Keep components focused
- Add types to `shared/types.ts`

## Debugging

### Renderer Process

1. Open DevTools: `Ctrl+Shift+I` / `Cmd+Option+I`
2. Use React DevTools
3. Set breakpoints in Sources tab
4. Check Console for errors

### Main Process

1. Add `debugger` statements
2. Run with `--inspect`:
   ```bash
   npm run debug
   ```
3. Open `chrome://inspect` in Chrome
4. Click "inspect" under Remote Target

### Common Issues

**Port 5173 in use**

```bash
# Kill process using port
lsof -ti:5173 | xargs kill -9
```

**Module not found errors**

```bash
# Clear cache and reinstall
npm run clean
rm -rf node_modules
npm install
```

**TypeScript errors**

```bash
# Check all TypeScript files
npx tsc --noEmit
```

## Testing Changes

### Manual Testing Checklist

- [ ] Works in development mode
- [ ] Works in production build
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] UI responsive
- [ ] Theme compatibility

### Performance Testing

- Check memory usage in Task Manager
- Monitor CPU usage during operations
- Test with large files/directories
- Verify no memory leaks

## Best Practices

### Do's

- ✅ Test on all platforms if possible
- ✅ Keep commits focused and atomic
- ✅ Update documentation
- ✅ Follow TypeScript best practices
- ✅ Handle errors gracefully

### Don'ts

- ❌ Commit `node_modules`
- ❌ Include personal configuration
- ❌ Expose sensitive data
- ❌ Use `any` type unnecessarily
- ❌ Ignore security warnings
