import Papa from 'papaparse';
import { CsvData, CsvColumn, ColumnStats } from '@shared/types';

// Delimiter detection patterns
const DELIMITER_PATTERNS = [
  { char: ',', name: 'comma' },
  { char: ';', name: 'semicolon' },
  { char: '\t', name: 'tab' },
  { char: '|', name: 'pipe' },
  { char: ':', name: 'colon' },
];

/**
 * Auto-detect the delimiter used in CSV content
 */
export function detectDelimiter(content: string): string {
  const sample = content.split('\n').slice(0, 5).join('\n'); // Use first 5 lines
  let bestDelimiter = ',';
  let maxScore = 0;

  for (const { char } of DELIMITER_PATTERNS) {
    const lines = sample.split('\n').filter(line => line.trim());
    if (lines.length < 2) continue;

    const counts = lines.map(
      line => (line.match(new RegExp(`\\${char}`, 'g')) || []).length
    );
    const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length;
    const variance =
      counts.reduce((sum, count) => sum + Math.pow(count - avgCount, 2), 0) /
      counts.length;

    // Score based on average count and consistency (low variance)
    const score = avgCount > 0 ? avgCount / (1 + variance) : 0;

    if (score > maxScore) {
      maxScore = score;
      bestDelimiter = char;
    }
  }

  return bestDelimiter;
}

/**
 * Detect the data type of a column based on its values
 */
export function detectColumnType(
  values: string[]
): 'string' | 'number' | 'date' | 'boolean' {
  const nonEmptyValues = values.filter(
    v => v !== null && v !== undefined && v.toString().trim() !== ''
  );

  if (nonEmptyValues.length === 0) return 'string';

  // Check for boolean
  const booleanCount = nonEmptyValues.filter(v =>
    /^(true|false|yes|no|y|n|1|0)$/i.test(v.toString().trim())
  ).length;

  if (booleanCount / nonEmptyValues.length > 0.8) return 'boolean';

  // Check for numbers
  const numberCount = nonEmptyValues.filter(v => {
    const str = v.toString().trim();
    return !isNaN(Number(str)) && str !== '';
  }).length;

  if (numberCount / nonEmptyValues.length > 0.8) return 'number';

  // Check for dates
  const dateCount = nonEmptyValues.filter(v => {
    const str = v.toString().trim();
    const date = new Date(str);
    return !isNaN(date.getTime()) && str.length > 4; // Avoid detecting years as dates
  }).length;

  if (dateCount / nonEmptyValues.length > 0.6) return 'date';

  return 'string';
}

/**
 * Calculate statistics for a column
 */
export function calculateColumnStats(values: any[], type: string): ColumnStats {
  const nonNullValues = values.filter(
    v => v !== null && v !== undefined && v.toString().trim() !== ''
  );
  const nullCount = values.length - nonNullValues.length;

  // Count unique values
  const uniqueValues = new Set(nonNullValues.map(v => v.toString()));
  const uniqueCount = uniqueValues.size;

  // Count occurrences for top values
  const valueCounts = new Map<string, number>();
  nonNullValues.forEach(v => {
    const str = v.toString();
    valueCounts.set(str, (valueCounts.get(str) || 0) + 1);
  });

  const topValues = Array.from(valueCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([value, count]) => ({ value, count }));

  const stats: ColumnStats = {
    count: values.length,
    nullCount,
    uniqueCount,
    topValues,
  };

  if (type === 'number' && nonNullValues.length > 0) {
    const numbers = nonNullValues.map(v => Number(v)).filter(n => !isNaN(n));
    if (numbers.length > 0) {
      numbers.sort((a, b) => a - b);
      stats.min = numbers[0];
      stats.max = numbers[numbers.length - 1];
      stats.avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
      stats.median =
        numbers.length % 2 === 0
          ? (numbers[numbers.length / 2 - 1] + numbers[numbers.length / 2]) / 2
          : numbers[Math.floor(numbers.length / 2)];
    }
  } else if (type === 'date' && nonNullValues.length > 0) {
    const dates = nonNullValues
      .map(v => new Date(v))
      .filter(d => !isNaN(d.getTime()));
    if (dates.length > 0) {
      dates.sort((a, b) => a.getTime() - b.getTime());
      stats.min = dates[0];
      stats.max = dates[dates.length - 1];
    }
  } else if (type === 'string' && nonNullValues.length > 0) {
    const strings = nonNullValues.map(v => v.toString()).sort();
    stats.min = strings[0];
    stats.max = strings[strings.length - 1];
  }

  return stats;
}

/**
 * Parse CSV content and return structured data
 */
export function parseCsvContent(
  content: string,
  delimiter?: string
): Promise<CsvData> {
  return new Promise((resolve, reject) => {
    const detectedDelimiter = delimiter || detectDelimiter(content);

    Papa.parse(content, {
      delimiter: detectedDelimiter,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // We'll handle type conversion ourselves
      complete: results => {
        try {
          const parseErrors: string[] = results.errors.map(err => err.message);
          const rows = results.data as Record<string, any>[];

          if (rows.length === 0) {
            resolve({
              columns: [],
              rows: [],
              totalRows: 0,
              delimiter: detectedDelimiter,
              encoding: 'utf-8',
              hasHeader: true,
              parseErrors,
            });
            return;
          }

          // Analyze columns
          const columnNames = Object.keys(rows[0]);
          const columns: CsvColumn[] = columnNames.map(name => {
            const values = rows.map(row => row[name]);
            const type = detectColumnType(values);
            const stats = calculateColumnStats(values, type);

            return {
              key: name,
              name: name,
              type,
              nullable: stats.nullCount > 0,
              unique: stats.uniqueCount === stats.count,
              stats,
            };
          });

          // Convert values based on detected types
          const processedRows = rows.map(row => {
            const processedRow: Record<string, any> = {};
            columns.forEach(col => {
              const value = row[col.key];

              if (value === null || value === undefined || value === '') {
                processedRow[col.key] = null;
                return;
              }

              switch (col.type) {
                case 'number':
                  const num = Number(value);
                  processedRow[col.key] = isNaN(num) ? value : num;
                  break;
                case 'boolean':
                  processedRow[col.key] = /^(true|yes|y|1)$/i.test(
                    value.toString()
                  );
                  break;
                case 'date':
                  const date = new Date(value);
                  processedRow[col.key] = isNaN(date.getTime()) ? value : date;
                  break;
                default:
                  processedRow[col.key] = value;
              }
            });
            return processedRow;
          });

          resolve({
            columns,
            rows: processedRows,
            totalRows: processedRows.length,
            delimiter: detectedDelimiter,
            encoding: 'utf-8',
            hasHeader: true,
            parseErrors,
          });
        } catch (error) {
          reject(error);
        }
      },
      error: error => {
        reject(error);
      },
    });
  });
}

/**
 * Export data to CSV format
 */
export function exportToCsv(
  data: any[],
  filename: string = 'export.csv'
): void {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Format value for display based on column type
 */
export function formatValue(value: any, type: string): string {
  if (value === null || value === undefined) return '';

  switch (type) {
    case 'number':
      return typeof value === 'number'
        ? value.toLocaleString()
        : value.toString();
    case 'date':
      return value instanceof Date
        ? value.toLocaleDateString()
        : value.toString();
    case 'boolean':
      return typeof value === 'boolean'
        ? value
          ? 'Yes'
          : 'No'
        : value.toString();
    default:
      return value.toString();
  }
}

/**
 * Get sample SQL queries for the given columns
 */
export function getSampleQueries(
  columns: CsvColumn[]
): Array<{ name: string; query: string; description: string }> {
  if (columns.length === 0) return [];

  const numericColumns = columns.filter(col => col.type === 'number');
  const dateColumns = columns.filter(col => col.type === 'date');

  const queries = [
    {
      name: 'Show All Data',
      query: 'SELECT * FROM data',
      description: 'Display all rows and columns',
    },
    {
      name: 'Count Rows',
      query: 'SELECT COUNT(*) as total_rows FROM data',
      description: 'Count the total number of rows',
    },
  ];

  if (numericColumns.length > 0) {
    const numCol = numericColumns[0].key;
    queries.push({
      name: 'Filter by Number',
      query: `SELECT * FROM data WHERE ${numCol} > 0`,
      description: `Show rows where ${numCol} is greater than 0`,
    });

    queries.push({
      name: 'Aggregate Statistics',
      query: `SELECT AVG(${numCol}) as avg_${numCol}, MIN(${numCol}) as min_${numCol}, MAX(${numCol}) as max_${numCol} FROM data`,
      description: `Calculate statistics for ${numCol}`,
    });
  }

  if (columns.length > 1) {
    const groupByCol = columns.find(
      col =>
        col.type === 'string' &&
        col.stats &&
        col.stats.uniqueCount < col.stats.count / 2
    );
    if (groupByCol) {
      queries.push({
        name: 'Group By Category',
        query: `SELECT ${groupByCol.key}, COUNT(*) as count FROM data GROUP BY ${groupByCol.key} ORDER BY count DESC`,
        description: `Group data by ${groupByCol.key} and count occurrences`,
      });
    }
  }

  if (dateColumns.length > 0) {
    const dateCol = dateColumns[0].key;
    queries.push({
      name: 'Recent Data',
      query: `SELECT * FROM data ORDER BY ${dateCol} DESC LIMIT 10`,
      description: `Show the 10 most recent records by ${dateCol}`,
    });
  }

  queries.push({
    name: 'Top 10 Records',
    query: 'SELECT * FROM data LIMIT 10',
    description: 'Show the first 10 records',
  });

  return queries;
}
