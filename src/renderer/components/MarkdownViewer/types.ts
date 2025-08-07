import { SelectedFile } from '@shared/types';

export interface MarkdownViewerProps {
  content: string;
  showSource: boolean;
  onToggleView: () => void;
  selectedFile: SelectedFile | null;
}
