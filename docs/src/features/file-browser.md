# File Browser

The File Browser is the primary navigation component in Peeka2, providing an intuitive way to explore your filesystem.

## Overview

Located on the left side of the application, the File Browser presents your filesystem in a familiar tree structure with expandable folders and clickable files.

## Features

### Directory Navigation
- **Click to expand**: Click on folder names or arrows to expand/collapse
- **Single-click selection**: Click files to view their contents
- **Home button**: Quick navigation to your home directory
- **Path display**: Current directory path shown at the top

### Favorites System
- **Add to favorites**: Click the star icon next to any directory
- **Quick access**: Favorites appear at the top of the browser
- **Persistent storage**: Favorites are saved between sessions
- **Remove favorites**: Click the star again to remove

### File Watching
- **Real-time updates**: See changes as they happen
- **New file indicators**: Newly created files are highlighted
- **Deletion handling**: Removed files disappear automatically
- **Performance optimized**: Only watches current directory

## User Interface

### Visual Design
- **Icons**: Different icons for files and folders
- **Indentation**: Clear hierarchy with proper spacing
- **Hover effects**: Visual feedback on mouse hover
- **Selection state**: Clear indication of selected items

### Interactions
- **Smooth animations**: Expand/collapse transitions
- **Loading states**: Indicators while reading directories
- **Error handling**: Graceful handling of permission errors
- **Empty states**: Clear messaging for empty directories

## Technical Details

### Performance
- **Lazy loading**: Directories load content on demand
- **Caching**: Recently accessed directories are cached
- **Debouncing**: File system events are debounced
- **Memory efficient**: Only expanded nodes kept in memory

### Limitations
- **Large directories**: May be slow with 10,000+ files
- **Network drives**: Performance depends on connection
- **Symbolic links**: Currently follows symlinks
- **Hidden files**: Shown by default (configurable in future)

## Tips and Tricks

1. **Keyboard navigation**: Use arrow keys for faster navigation
2. **Multiple favorites**: Organize projects with favorite folders
3. **Quick filtering**: Type to filter visible files (coming soon)
4. **Drag and drop**: Drag files to external applications

## Future Enhancements

- Search functionality
- File filtering options
- Context menus
- Drag and drop support
- File operations (copy, move, delete)
- Custom icons for file types