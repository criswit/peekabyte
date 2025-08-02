# API Reference

This document describes the IPC API exposed by Peeka2 for communication between the main and renderer processes.

## Overview

Peeka2 uses Electron's IPC (Inter-Process Communication) for secure communication between processes. All APIs are type-safe and accessed through the `window.electronAPI` object.

## File System API

### readDirectory

Reads the contents of a directory.

```typescript
readDirectory(dirPath: string): Promise<{
  name: string;
  path: string;
  isDirectory: boolean;
  isFile: boolean;
}[]>
```

**Parameters:**
- `dirPath`: Absolute path to directory

**Returns:**
- Array of file/directory entries

**Example:**
```javascript
const files = await window.electronAPI.readDirectory('/home/user/Documents');
```

### readFile

Reads the contents of a file as text.

```typescript
readFile(filePath: string): Promise<string>
```

**Parameters:**
- `filePath`: Absolute path to file

**Returns:**
- File contents as string

**Example:**
```javascript
const content = await window.electronAPI.readFile('/home/user/file.txt');
```

### getHomeDirectory

Gets the user's home directory path.

```typescript
getHomeDirectory(): Promise<string>
```

**Returns:**
- Home directory path

**Example:**
```javascript
const homePath = await window.electronAPI.getHomeDirectory();
```

## Dialog API

### showOpenDialog

Shows native file/folder selection dialog.

```typescript
showOpenDialog(options: {
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections'>;
  filters?: Array<{
    name: string;
    extensions: string[];
  }>;
  defaultPath?: string;
}): Promise<{
  canceled: boolean;
  filePaths: string[];
}>
```

**Parameters:**
- `options`: Dialog configuration
  - `properties`: Dialog behavior flags
  - `filters`: File type filters
  - `defaultPath`: Initial directory

**Returns:**
- `canceled`: Whether dialog was canceled
- `filePaths`: Selected paths

**Example:**
```javascript
const result = await window.electronAPI.showOpenDialog({
  properties: ['openFile'],
  filters: [
    { name: 'Markdown', extensions: ['md'] },
    { name: 'All Files', extensions: ['*'] }
  ]
});
```

## File Watching API

### watchFile

Watches a file for changes.

```typescript
watchFile(filePath: string): void
```

**Parameters:**
- `filePath`: Path to watch

**Events:**
- `file-changed`: Emitted when file changes
- `file-deleted`: Emitted when file is deleted

**Example:**
```javascript
window.electronAPI.watchFile('/path/to/file.txt');
window.electronAPI.onFileChange((event, path, changeType) => {
  console.log(`File ${changeType}: ${path}`);
});
```

### watchDirectory

Watches a directory for changes.

```typescript
watchDirectory(dirPath: string): void
```

**Parameters:**
- `dirPath`: Directory to watch

**Events:**
- `directory-changed`: Emitted on changes

**Example:**
```javascript
window.electronAPI.watchDirectory('/path/to/dir');
window.electronAPI.onDirectoryChange((event, path, changeType) => {
  console.log(`Directory ${changeType}: ${path}`);
});
```

### stopWatching

Stops all file watchers.

```typescript
stopWatching(): void
```

**Example:**
```javascript
window.electronAPI.stopWatching();
```

## Event Listeners

### onFileChange

Listens for file change events.

```typescript
onFileChange(callback: (
  event: IpcRendererEvent,
  filePath: string,
  changeType: 'change' | 'unlink'
) => void): void
```

### onDirectoryChange

Listens for directory change events.

```typescript
onDirectoryChange(callback: (
  event: IpcRendererEvent,
  dirPath: string,
  changeType: string,
  affectedPath?: string
) => void): void
```

### removeAllListeners

Removes all event listeners.

```typescript
removeAllListeners(channel: string): void
```

## Type Definitions

### FileEntry
```typescript
interface FileEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  isFile: boolean;
}
```

### DialogOptions
```typescript
interface DialogOptions {
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections'>;
  filters?: Array<{
    name: string;
    extensions: string[];
  }>;
  defaultPath?: string;
}
```

### DialogResult
```typescript
interface DialogResult {
  canceled: boolean;
  filePaths: string[];
}
```

## Error Handling

All API methods return promises that may reject with errors:

```javascript
try {
  const content = await window.electronAPI.readFile('/path/to/file');
} catch (error) {
  console.error('Failed to read file:', error.message);
}
```

Common errors:
- `ENOENT`: File not found
- `EACCES`: Permission denied
- `EISDIR`: Is a directory
- `EMFILE`: Too many open files

## Security Notes

1. **Path Validation**: All paths are validated in the main process
2. **Sandboxing**: Renderer is sandboxed by default
3. **Context Isolation**: No direct Node.js access
4. **Limited Scope**: Only exposed APIs available

## Future APIs

Planned additions:
- File operations (copy, move, delete)
- Search functionality
- Metadata retrieval
- Thumbnail generation
- Archive handling