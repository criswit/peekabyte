export interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  isMarkdown: boolean;
  isJson?: boolean;
  isSymlink?: boolean;
}

export interface SelectedFile extends FileItem {
  content: string;
  error: string | null;
  deleted: boolean;
}

export interface Favorite {
  name: string;
  path: string;
}