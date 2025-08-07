# Installation

## Development Installation

### From Source

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/peeka2.git
   cd peeka2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run electron:dev
   ```

### System Requirements

- **Operating System**: Windows 10+, macOS 10.13+, or Linux
- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 200MB for application files

## Production Installation

### Building from Source

1. **Build the application**

   ```bash
   npm run electron:build
   ```

2. **Find the installer**
   - Windows: `release/Peeka2-Setup-*.exe`
   - macOS: `release/Peeka2-*.dmg`
   - Linux: `release/peeka2-*.AppImage`

### Pre-built Binaries

Pre-built binaries will be available on the [Releases](https://github.com/yourusername/peeka2/releases) page once the project is published.

## Troubleshooting

### Common Issues

**Build fails on Windows**

- Ensure you have Visual Studio Build Tools installed
- Run `npm install --global windows-build-tools` as administrator

**Application doesn't start on Linux**

- Make the AppImage executable: `chmod +x peeka2-*.AppImage`
- Install required libraries: `sudo apt install libgtk-3-0 libnotify4 libnss3`

**macOS security warning**

- Right-click the app and select "Open" to bypass Gatekeeper
- Or run: `xattr -cr /Applications/Peeka2.app`

### Getting Help

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/yourusername/peeka2/issues)
2. Join our community discussions
3. File a new issue with detailed information
