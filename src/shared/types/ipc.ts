import { FileItem } from './file';

export interface FileChangeEvent {
  path: string;
  content?: string;
  deleted?: boolean;
}

export interface ElectronAPI {
  getHomeDir: () => Promise<string>;
  readDirectory: (dirPath: string, showDotFiles?: boolean) => Promise<FileItem[]>;
  readFile: (filePath: string) => Promise<string>;
  openDirectoryDialog: () => Promise<string | null>;
  watchFile: (filePath: string) => Promise<boolean>;
  unwatchFile: () => Promise<boolean>;
  onFileChanged: (callback: (data: FileChangeEvent) => void) => () => void;
}