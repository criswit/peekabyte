import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as chokidar from 'chokidar';
import { FileItem, FileChangeEvent } from '@shared/types';

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Handle any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Initialize watchers object
interface Watchers {
  directory: chokidar.FSWatcher | null;
  file: chokidar.FSWatcher | null;
}

const watchers: Watchers = {
  directory: null,
  file: null
};

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../../../assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true
    }
  });

  // Load the built index.html file
  const indexPath = path.join(__dirname, '../../dist/index.html');
  console.log('Loading index from:', indexPath);
  mainWindow.loadFile(indexPath);

  // Only open DevTools when in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  console.log('Electron app is ready');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Get home directory
ipcMain.handle('get-home-dir', (): string => {
  return os.homedir();
});

// Read directory contents
ipcMain.handle('read-directory', async (_event, dirPath: string, showDotFiles: boolean = false): Promise<FileItem[]> => {
  try {
    const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
    
    // Filter and map files
    const fileList: FileItem[] = files
      .filter(file => showDotFiles || !file.name.startsWith('.'))
      .map(file => {
        const isDirectory = file.isDirectory();
        const filePath = path.join(dirPath, file.name);
        const isMarkdown = !isDirectory && 
          (file.name.toLowerCase().endsWith('.md') || 
           file.name.toLowerCase().endsWith('.markdown'));
        const isJson = !isDirectory && 
          (file.name.toLowerCase().endsWith('.json') ||
           file.name.toLowerCase().endsWith('.jsonc'));
        
        return {
          name: file.name,
          path: filePath,
          isDirectory,
          isMarkdown,
          isJson
        };
      })
      .sort((a, b) => {
        // Directories first, then alphabetically
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
    
    return fileList;
  } catch (error) {
    console.error('Error reading directory:', error);
    throw error;
  }
});

// Read file contents
ipcMain.handle('read-file', async (_event, filePath: string): Promise<string> => {
  try {
    console.log(`Reading file: ${filePath}`);
    // First check if the file exists
    await fs.promises.access(filePath, fs.constants.F_OK);
    
    // Then read the file content
    const content = await fs.promises.readFile(filePath, 'utf8');
    console.log(`Successfully read file: ${filePath}`);
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
});

// Open directory dialog
ipcMain.handle('open-directory-dialog', async (): Promise<string | null> => {
  if (!mainWindow) return null;
  
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (result.canceled) {
    return null;
  }
  
  return result.filePaths[0];
});

// Watch a file for changes
ipcMain.handle('watch-file', (_event, filePath: string): boolean => {
  // Close any existing file watcher
  if (watchers.file) {
    watchers.file.close();
    watchers.file = null;
  }
  
  console.log(`Setting up watcher for file: ${filePath}`);
  
  // Set up a new watcher for the file
  watchers.file = chokidar.watch(filePath, {
    persistent: true,
    ignoreInitial: true, // Don't trigger events for existing files
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100
    }
  });
  
  // Handle file changes
  watchers.file.on('change', async (path) => {
    try {
      console.log(`File changed: ${path}`);
      // Read the updated file content
      const content = await fs.promises.readFile(path, 'utf8');
      console.log(`Successfully read updated file: ${path}`);
      
      // Send the updated content to the renderer
      if (mainWindow) {
        const event: FileChangeEvent = { path, content };
        mainWindow.webContents.send('file-changed', event);
      }
    } catch (error) {
      console.error(`Error reading updated file: ${error}`);
      // If we can't read the file, it might have been temporarily locked
      // We'll just log the error and not send an update
    }
  });
  
  // Handle file deleted
  watchers.file.on('unlink', (path) => {
    console.log(`File deleted: ${path}`);
    if (mainWindow) {
      const event: FileChangeEvent = { path, deleted: true };
      mainWindow.webContents.send('file-changed', event);
    }
  });
  
  // Handle any error
  watchers.file.on('error', (error) => {
    console.error(`File watcher error: ${error}`);
  });
  
  return true;
});

// Stop watching a file
ipcMain.handle('unwatch-file', (): boolean => {
  if (watchers.file) {
    watchers.file.close();
    watchers.file = null;
    console.log('File watcher closed');
  }
  return true;
});