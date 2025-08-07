# Architecture

Peeka2 follows Electron's multi-process architecture with clear separation of concerns.

## Process Architecture

### Main Process

The main process (`src/main/`) handles:

- Window management
- File system operations
- Native OS integration
- IPC communication setup

### Renderer Process

The renderer process (`src/renderer/`) contains:

- React application
- UI components
- User interactions
- Theme management

### Preload Script

The preload script (`src/preload/`) provides:

- Secure bridge between main and renderer
- Type-safe API exposure
- Context isolation

## Directory Structure

```
src/
├── main/           # Electron main process
│   └── index.ts    # Main entry point, IPC handlers
├── preload/        # Preload scripts
│   └── index.ts    # API exposure to renderer
├── renderer/       # React application
│   ├── components/ # React components
│   ├── themes/     # Theme definitions
│   ├── App.tsx     # Root component
│   └── main.tsx    # Renderer entry point
└── shared/         # Shared code
    └── types.ts    # TypeScript type definitions
```

## Component Architecture

### File Browser Component

- Tree structure for directory navigation
- Lazy loading for performance
- File watching integration
- Favorites management

### Content Viewers

- Plugin-based architecture
- Type detection system
- Specialized renderers:
  - MarkdownViewer
  - JsonViewer
  - ImageViewer (planned)
  - CodeViewer (planned)

### Theme System

- CSS variables for theming
- Styled-components integration
- Runtime theme switching
- LocalStorage persistence

## Data Flow

1. **User Action** → Renderer Component
2. **IPC Call** → Preload Script → Main Process
3. **File System Operation** → Main Process
4. **IPC Response** → Preload Script → Renderer
5. **UI Update** → React State → Component Re-render

## Security Model

- **Context Isolation**: Enabled by default
- **Node Integration**: Disabled in renderer
- **Preload Scripts**: Only expose necessary APIs
- **Path Validation**: All file paths validated in main process
- **Content Security Policy**: Restrictive CSP headers

## State Management

### Local State

- Component-level state with React hooks
- No global state management library needed

### Persistent State

- LocalStorage for user preferences
- File system for application data

### Theme Context

- React Context for theme state
- Provider pattern for theme distribution

## Build System

### Development

- Vite for renderer process
- TypeScript compiler for main/preload
- Hot module replacement
- Concurrent watchers

### Production

- Vite build for optimized bundles
- Electron Builder for distribution
- Code signing support
- Auto-update infrastructure ready
