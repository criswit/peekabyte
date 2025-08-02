import { contextBridge, ipcRenderer } from 'electron';
import { ElectronAPI, FileChangeEvent } from '@shared/types';

const electronAPI: ElectronAPI = {
  getHomeDir: () => ipcRenderer.invoke('get-home-dir'),
  readDirectory: (dirPath: string, showDotFiles?: boolean) => 
    ipcRenderer.invoke('read-directory', dirPath, showDotFiles),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  openDirectoryDialog: () => ipcRenderer.invoke('open-directory-dialog'),
  watchFile: (filePath: string) => ipcRenderer.invoke('watch-file', filePath),
  unwatchFile: () => ipcRenderer.invoke('unwatch-file'),
  onFileChanged: (callback: (data: FileChangeEvent) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, data: FileChangeEvent) => callback(data);
    ipcRenderer.on('file-changed', listener);
    // Return a function to remove the listener
    return () => {
      ipcRenderer.removeListener('file-changed', listener);
    };
  }
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);