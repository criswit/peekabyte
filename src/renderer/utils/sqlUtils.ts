import alasql from 'alasql';
import { format } from 'sql-formatter';
import { QueryResult, SavedQuery } from '@shared/types';

// Configure AlaSQL for better performance
alasql.options.cache = false;
alasql.options.autocommit = true;

/**
 * Execute SQL query on data
 */
export function executeQuery(query: string, data: any[]): Promise<QueryResult> {
  return new Promise(resolve => {
    const startTime = performance.now();

    try {
      // Clean and validate query
      const cleanQuery = query.trim();
      if (!cleanQuery) {
        resolve({
          columns: [],
          rows: [],
          totalRows: 0,
          executionTime: 0,
          error: 'Query cannot be empty',
        });
        return;
      }

      // Create temporary table
      alasql('DROP TABLE IF EXISTS data');
      alasql('CREATE TABLE data');

      // Insert data
      if (data.length > 0) {
        data.forEach(row => {
          alasql('INSERT INTO data VALUES ?', [row]);
        });
      }

      // Execute query
      const result = alasql(cleanQuery);
      const endTime = performance.now();

      // Handle different result types
      let columns: string[] = [];
      let rows: any[][] = [];
      let totalRows = 0;

      if (Array.isArray(result)) {
        if (result.length > 0) {
          // Extract columns from first row
          const firstRow = result[0];
          if (typeof firstRow === 'object' && firstRow !== null) {
            columns = Object.keys(firstRow);
            rows = result.map(row => columns.map(col => row[col]));
          } else {
            // Handle scalar results
            columns = ['result'];
            rows = result.map(val => [val]);
          }
        }
        totalRows = result.length;
      } else {
        // Handle single scalar result
        columns = ['result'];
        rows = [[result]];
        totalRows = 1;
      }

      resolve({
        columns,
        rows,
        totalRows,
        executionTime: endTime - startTime,
      });
    } catch (error) {
      const endTime = performance.now();
      resolve({
        columns: [],
        rows: [],
        totalRows: 0,
        executionTime: endTime - startTime,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      // Clean up
      try {
        alasql('DROP TABLE IF EXISTS data');
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });
}

/**
 * Format SQL query for display
 */
export function formatSqlQuery(query: string): string {
  try {
    return format(query, {
      language: 'sql',
      keywordCase: 'upper',
      indentStyle: 'standard',
      logicalOperatorNewline: 'before',
      expressionWidth: 50,
      linesBetweenQueries: 2,
    });
  } catch (error) {
    // If formatting fails, return original query
    return query;
  }
}

/**
 * Validate SQL query syntax
 */
export function validateQuery(query: string): {
  isValid: boolean;
  error?: string;
} {
  try {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return { isValid: false, error: 'Query cannot be empty' };
    }

    // Basic SQL injection prevention
    const dangerousPatterns = [
      /\b(DROP|DELETE|UPDATE|INSERT|ALTER|CREATE|TRUNCATE)\s+(?!.*FROM\s+data\b)/i,
      /;\s*(DROP|DELETE|UPDATE|INSERT|ALTER|CREATE|TRUNCATE)/i,
      /--/,
      /\/\*/,
      /\*\//,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(cleanQuery)) {
        return {
          isValid: false,
          error:
            'Query contains potentially dangerous operations. Only SELECT queries are allowed.',
        };
      }
    }

    // Check if query starts with SELECT
    if (!/^\s*SELECT\b/i.test(cleanQuery)) {
      return {
        isValid: false,
        error: 'Only SELECT queries are supported',
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid query syntax',
    };
  }
}

/**
 * Get query suggestions based on current input
 */
export function getQuerySuggestions(
  input: string,
  columns: string[]
): string[] {
  const suggestions: string[] = [];
  const lowerInput = input.toLowerCase();

  // SQL keywords
  const keywords = [
    'SELECT',
    'FROM',
    'WHERE',
    'GROUP BY',
    'ORDER BY',
    'HAVING',
    'LIMIT',
    'DISTINCT',
    'COUNT',
    'SUM',
    'AVG',
    'MIN',
    'MAX',
    'AND',
    'OR',
    'NOT',
    'IN',
    'LIKE',
    'BETWEEN',
    'IS NULL',
    'IS NOT NULL',
    'ASC',
    'DESC',
    'AS',
  ];

  // Add keyword suggestions
  keywords.forEach(keyword => {
    if (
      keyword.toLowerCase().startsWith(lowerInput) ||
      lowerInput.includes(keyword.toLowerCase())
    ) {
      suggestions.push(keyword);
    }
  });

  // Add column suggestions
  columns.forEach(column => {
    if (column.toLowerCase().includes(lowerInput)) {
      suggestions.push(column);
    }
  });

  // Add common patterns
  if (lowerInput.includes('select')) {
    suggestions.push('SELECT * FROM data');
    suggestions.push('SELECT COUNT(*) FROM data');
    columns.forEach(col => {
      suggestions.push(`SELECT ${col} FROM data`);
    });
  }

  if (lowerInput.includes('where')) {
    columns.forEach(col => {
      suggestions.push(`WHERE ${col} = ''`);
      suggestions.push(`WHERE ${col} IS NOT NULL`);
      suggestions.push(`WHERE ${col} LIKE '%'`);
    });
  }

  return [...new Set(suggestions)].slice(0, 10);
}

/**
 * Save query to localStorage
 */
export function saveQuery(query: SavedQuery): void {
  const savedQueries = getSavedQueries();
  const existingIndex = savedQueries.findIndex(q => q.id === query.id);

  if (existingIndex >= 0) {
    savedQueries[existingIndex] = query;
  } else {
    savedQueries.push(query);
  }

  localStorage.setItem('csvViewer_savedQueries', JSON.stringify(savedQueries));
}

/**
 * Get saved queries from localStorage
 */
export function getSavedQueries(): SavedQuery[] {
  try {
    const saved = localStorage.getItem('csvViewer_savedQueries');
    if (saved) {
      const queries = JSON.parse(saved);
      return queries.map((q: any) => ({
        ...q,
        createdAt: new Date(q.createdAt),
        lastUsed: new Date(q.lastUsed),
      }));
    }
  } catch (error) {
    console.error('Error loading saved queries:', error);
  }
  return [];
}

/**
 * Delete saved query
 */
export function deleteSavedQuery(id: string): void {
  const savedQueries = getSavedQueries().filter(q => q.id !== id);
  localStorage.setItem('csvViewer_savedQueries', JSON.stringify(savedQueries));
}

/**
 * Update query usage
 */
export function updateQueryUsage(id: string): void {
  const savedQueries = getSavedQueries();
  const query = savedQueries.find(q => q.id === id);
  if (query) {
    query.lastUsed = new Date();
    saveQuery(query);
  }
}

/**
 * Generate unique ID for queries
 */
export function generateQueryId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Export query results to various formats
 */
export function exportQueryResults(
  result: QueryResult,
  format: 'csv' | 'json' | 'xlsx',
  filename: string
): void {
  const data = result.rows.map(row => {
    const obj: Record<string, any> = {};
    result.columns.forEach((col, index) => {
      obj[col] = row[index];
    });
    return obj;
  });

  switch (format) {
    case 'csv':
      exportToCsv(data, filename);
      break;
    case 'json':
      exportToJson(data, filename);
      break;
    default:
      exportToCsv(data, filename);
  }
}

function exportToCsv(data: any[], filename: string): void {
  const csv = convertToCSV(data);
  downloadFile(csv, filename, 'text/csv');
}

function exportToJson(data: any[], filename: string): void {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const value = row[header];
          const stringValue =
            value === null || value === undefined ? '' : String(value);
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          return /[",\n\r]/.test(stringValue)
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
        })
        .join(',')
    ),
  ].join('\n');

  return csvContent;
}

function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
