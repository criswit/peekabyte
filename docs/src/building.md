# Building

This guide covers building Peeka2 for development and distribution.

## Development Builds

### Quick Build
```bash
# Build all components
npm run build
```

This runs all three build processes:
1. Main process (TypeScript → CommonJS)
2. Preload script (TypeScript → CommonJS)
3. Renderer process (Vite build)

### Individual Builds
```bash
# Build specific components
npm run build:main     # Main process only
npm run build:preload  # Preload script only
npm run build:renderer # Renderer process only
```

### Build Output
- Main: `dist/main/`
- Preload: `dist/preload/`
- Renderer: `dist/renderer/`

## Production Builds

### Creating Distributables
```bash
# Build and package for current platform
npm run electron:build

# Build for specific platform
npm run electron:build -- --mac
npm run electron:build -- --win
npm run electron:build -- --linux
```

### Output Locations
- Windows: `release/*-Setup-*.exe`
- macOS: `release/*.dmg`
- Linux: `release/*.AppImage`

## Build Configuration

### Electron Builder Config
Configuration in `package.json`:
```json
{
  "build": {
    "appId": "com.example.peeka2",
    "productName": "Peeka2",
    "directories": {
      "output": "release"
    }
  }
}
```

### Platform-Specific Settings

#### Windows
- NSIS installer
- Auto-update support
- Code signing ready
- Start menu integration

#### macOS
- DMG with custom background
- Code signing configuration
- Notarization ready
- macOS 10.13+ support

#### Linux
- AppImage format
- Desktop file included
- Menu integration
- Multiple distributions

## Build Process

### 1. TypeScript Compilation
- Strict mode checking
- Type declaration generation
- Source map creation
- Module resolution

### 2. Vite Building
- Production optimizations
- Code splitting
- Asset optimization
- Minification

### 3. Electron Packaging
- Native modules compilation
- Asset bundling
- Installer creation
- Code signing (if configured)

## Optimization

### Bundle Size
- Tree shaking enabled
- Dead code elimination
- Dynamic imports
- Asset compression

### Performance
- Lazy loading
- Code splitting
- Minification
- Source map exclusion

## Troubleshooting

### Common Build Issues

**Native Module Errors**
```bash
# Rebuild native modules
npm rebuild
# Or for Electron specifically
npm run postinstall
```

**Out of Memory**
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

**Permission Errors**
```bash
# Clean and rebuild
npm run clean
sudo npm run electron:build
```

### Platform-Specific Issues

**Windows: Missing Visual Studio**
- Install Visual Studio Build Tools
- Include C++ build tools

**macOS: Code Signing Failed**
- Check Apple Developer certificate
- Verify keychain access

**Linux: AppImage Won't Run**
```bash
chmod +x peeka2-*.AppImage
```

## Continuous Integration

### GitHub Actions Setup
```yaml
name: Build
on: [push, pull_request]
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
```

### Build Matrix
- Multiple Node versions
- All platforms
- Architecture variants
- Release drafts

## Release Process

### 1. Version Bump
```bash
npm version patch/minor/major
```

### 2. Build All Platforms
```bash
# On each platform
npm run electron:build
```

### 3. Create Release
1. Tag version in Git
2. Create GitHub release
3. Upload artifacts
4. Update documentation

## Advanced Configuration

### Custom Build Flags
```bash
# Debug build
DEBUG=electron-builder npm run electron:build

# Skip code signing
CSC_IDENTITY_AUTO_DISCOVERY=false npm run electron:build
```

### Build Variants
- Portable versions
- MSI installers (Windows)
- Snap packages (Linux)
- Mac App Store builds