# Configuration

Peeka2 can be configured through various methods to customize its behavior and appearance.

## Configuration Methods

### 1. User Preferences

Stored in LocalStorage:

- Theme selection
- Panel widths
- Favorite directories
- View preferences

### 2. Environment Variables

For development:

```bash
# Enable debug logging
DEBUG=true npm run electron:dev

# Custom port for renderer
VITE_PORT=3000 npm run dev
```

### 3. Build Configuration

In `package.json`:

```json
{
  "build": {
    "appId": "com.example.peeka2",
    "productName": "Peeka2"
  }
}
```

## User Preferences

### Theme Configuration

```javascript
// Stored in LocalStorage
{
  "theme": "dark" | "light" | "synthwave" | "monokai" | "github" | "dracula"
}
```

### Panel Configuration

```javascript
{
  "leftPanelWidth": 300,  // pixels
  "rightPanelWidth": 700  // pixels
}
```

### Favorites

```javascript
{
  "favorites": [
    "/home/user/Documents",
    "/home/user/Projects"
  ]
}
```

## Application Settings

### Window Settings

Default window configuration:

```javascript
{
  width: 1200,
  height: 800,
  minWidth: 800,
  minHeight: 600,
  center: true,
  titleBarStyle: 'default'
}
```

### File Watching

```javascript
{
  maxWatchers: 100,        // Maximum concurrent watchers
  debounceDelay: 100,      // ms delay for change events
  ignorePatterns: [        // Patterns to ignore
    'node_modules/**',
    '.git/**',
    '*.log'
  ]
}
```

## Developer Configuration

### TypeScript Settings

Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ESNext",
    "module": "ESNext"
  }
}
```

### Vite Configuration

In `vite.config.ts`:

```javascript
{
  server: {
    port: 5173,
    strictPort: true
  },
  build: {
    outDir: 'dist/renderer'
  }
}
```

## Security Configuration

### Content Security Policy

```javascript
{
  "default-src": ["'self'"],
  "script-src": ["'self'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "file:"]
}
```

### Permissions

```javascript
{
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true
  }
}
```

## Performance Configuration

### Renderer Process

```javascript
{
  maxFileSize: 50 * 1024 * 1024,  // 50MB max file size
  chunkSize: 1024 * 1024,          // 1MB chunks
  cacheSize: 100                   // Max cached files
}
```

### Main Process

```javascript
{
  maxConcurrentReads: 10,
  readBufferSize: 64 * 1024,  // 64KB
  watcherTimeout: 30000        // 30s timeout
}
```

## Future Configuration Options

### Planned Settings UI

- Preferences window
- JSON config file
- Command-line arguments
- Per-project settings

### Planned Options

```javascript
{
  // Display
  "fontSize": 14,
  "fontFamily": "monospace",
  "lineHeight": 1.5,

  // Editor
  "tabSize": 2,
  "wordWrap": true,
  "showLineNumbers": true,

  // Files
  "showHiddenFiles": false,
  "fileAssociations": {},
  "excludePatterns": [],

  // Advanced
  "telemetry": false,
  "autoUpdate": true,
  "language": "en"
}
```

## Configuration File Locations

### Windows

```
%APPDATA%\peeka2\config.json
```

### macOS

```
~/Library/Application Support/peeka2/config.json
```

### Linux

```
~/.config/peeka2/config.json
```

## Environment-Specific Config

### Development

```javascript
if (process.env.NODE_ENV === 'development') {
  // Enable dev tools
  // Add debug logging
  // Disable security features
}
```

### Production

```javascript
if (process.env.NODE_ENV === 'production') {
  // Enable security
  // Optimize performance
  // Disable debug features
}
```

## Migrating Configuration

### Export Settings

```bash
# Future feature
peeka2 --export-config > config.json
```

### Import Settings

```bash
# Future feature
peeka2 --import-config config.json
```
