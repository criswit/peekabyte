export interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  isMarkdown: boolean;
  isJson?: boolean;
  isImage?: boolean;
  isPdf?: boolean;
  isHtml?: boolean;
  isCsv?: boolean;
  isSymlink?: boolean;
}

export interface SelectedFile extends FileItem {
  content: string;
  error: string | null;
  deleted: boolean;
}

// CSV-specific types
export interface CsvColumn {
  key: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  nullable: boolean;
  unique: boolean;
  stats?: ColumnStats;
}

export interface ColumnStats {
  count: number;
  nullCount: number;
  uniqueCount: number;
  min?: string | number | Date;
  max?: string | number | Date;
  avg?: number;
  median?: number;
  mode?: string | number;
  topValues?: Array<{ value: any; count: number }>;
}

export interface CsvData {
  columns: CsvColumn[];
  rows: Record<string, any>[];
  totalRows: number;
  delimiter: string;
  encoding: string;
  hasHeader: boolean;
  parseErrors: string[];
}

export interface QueryResult {
  columns: string[];
  rows: any[][];
  totalRows: number;
  executionTime: number;
  error?: string;
}

export interface SavedQuery {
  id: string;
  name: string;
  query: string;
  description?: string;
  createdAt: Date;
  lastUsed: Date;
  favorite: boolean;
}

export interface Favorite {
  name: string;
  path: string;
}
