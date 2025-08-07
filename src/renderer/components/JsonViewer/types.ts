export interface JsonViewerProps {
  content: string;
  searchTerm: string;
  currentMatchIndex: number;
  onSetMatchRefs: (index: number, element: HTMLElement | null) => void;
}

export interface JsonNodeProps {
  keyName: string;
  value: any;
  depth: number;
  searchTerm: string;
  currentMatchIndex: number;
  onSetMatchRefs: (index: number, element: HTMLElement | null) => void;
  isArrayItem?: boolean;
  index?: number;
  isLast?: boolean;
}
