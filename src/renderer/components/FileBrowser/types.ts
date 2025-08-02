import { SelectedFile } from '@shared/types';

export interface FileBrowserProps {
  onFileSelect: (file: SelectedFile) => void;
  selectedFile: SelectedFile | null;
}