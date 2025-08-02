# Getting Started

This guide will help you get Peeka2 up and running on your system.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **Git** (for cloning the repository)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/peeka2.git
   cd peeka2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development environment**
   ```bash
   npm run electron:dev
   ```

This will start both the Vite development server and the Electron application with hot reload enabled.

## First Steps

When Peeka2 launches, you'll see:

1. **File Browser** on the left - Navigate your filesystem
2. **Content Viewer** on the right - View selected files
3. **Theme Selector** in the top right - Choose your preferred theme

### Navigating Files

- Click on folders to expand them
- Click on files to view their contents
- Use the home button to go to your home directory
- Star directories to add them to favorites

### Viewing Files

Peeka2 automatically detects file types and uses the appropriate viewer:

- **Markdown files** (.md) - Rendered with syntax highlighting
- **JSON files** (.json) - Formatted with syntax highlighting
- **Text files** - Displayed with line numbers
- **Other files** - Basic text display

## Next Steps

- Learn about all [Features](./features.md)
- Set up your [Development Environment](./development-setup.md)
- Customize your [Configuration](./configuration.md)