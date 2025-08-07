import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { FixedSizeList as List } from 'react-window';
import { CsvData, QueryResult } from '@shared/types';
import { formatValue } from '../../utils/csvUtils';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.muted};
  border-bottom: 2px solid ${props => props.theme.colors.border};
  font-weight: 600;
  font-size: 12px;
  color: ${props => props.theme.colors.mutedForeground};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderCell = styled.div<{ $width: number; $sortable?: boolean }>`
  width: ${props => props.$width}px;
  min-width: ${props => props.$width}px;
  padding: 8px 12px;
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: ${props => (props.$sortable ? 'pointer' : 'default')};
  user-select: none;

  &:hover {
    background-color: ${props =>
      props.$sortable ? props.theme.colors.hover : 'transparent'};
  }

  &:last-child {
    border-right: none;
  }
`;

const SortIcon = styled.span<{ $direction?: 'asc' | 'desc' }>`
  margin-left: 4px;
  opacity: ${props => (props.$direction ? 1 : 0.3)};
  font-size: 10px;

  &::after {
    content: ${props =>
      props.$direction === 'asc'
        ? '"▲"'
        : props.$direction === 'desc'
          ? '"▼"'
          : '"▲▼"'};
  }
`;

const TableBody = styled.div`
  flex: 1;
  overflow: hidden;
`;

const Row = styled.div<{ $isEven: boolean }>`
  display: flex;
  background-color: ${props =>
    props.$isEven ? props.theme.colors.background : props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

const Cell = styled.div<{ $width: number; $type?: string }>`
  width: ${props => props.$width}px;
  min-width: ${props => props.$width}px;
  padding: 6px 12px;
  border-right: 1px solid ${props => props.theme.colors.border};
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;

  ${props =>
    props.$type === 'number' &&
    `
    justify-content: flex-end;
    font-family: monospace;
  `}

  ${props =>
    props.$type === 'date' &&
    `
    font-family: monospace;
  `}

  &:last-child {
    border-right: none;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${props => props.theme.colors.mutedForeground};
  font-size: 14px;
`;

const ErrorState = styled.div`
  padding: 16px;
  background-color: ${props => props.theme.colors.destructive};
  color: ${props => props.theme.colors.destructiveForeground};
  border-radius: 4px;
  margin: 16px;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${props => props.theme.colors.mutedForeground};
`;

interface DataTableProps {
  data: CsvData | QueryResult | null;
  loading?: boolean;
  error?: string;
}

interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

const COLUMN_MIN_WIDTH = 100;
const COLUMN_MAX_WIDTH = 300;
const ROW_HEIGHT = 32;

const DataTable: React.FC<DataTableProps> = ({ data, loading, error }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Determine if this is CSV data or query result
  const isCsvData =
    data &&
    'columns' in data &&
    Array.isArray(data.columns) &&
    data.columns.length > 0 &&
    typeof data.columns[0] === 'object';

  // Extract columns and rows based on data type
  const { columns, rows, columnTypes } = useMemo(() => {
    if (!data) return { columns: [], rows: [], columnTypes: {} };

    if (isCsvData) {
      const csvData = data as CsvData;
      return {
        columns: csvData.columns.map(col => col.key),
        rows: csvData.rows,
        columnTypes: csvData.columns.reduce(
          (acc, col) => {
            acc[col.key] = col.type;
            return acc;
          },
          {} as Record<string, string>
        ),
      };
    } else {
      const queryResult = data as QueryResult;
      const rowObjects = queryResult.rows.map(row => {
        const obj: Record<string, any> = {};
        queryResult.columns.forEach((col, index) => {
          obj[col] = row[index];
        });
        return obj;
      });

      return {
        columns: queryResult.columns,
        rows: rowObjects,
        columnTypes: {},
      };
    }
  }, [data, isCsvData]);

  // Calculate column widths
  const columnWidths = useMemo(() => {
    if (columns.length === 0) return {};

    const widths: Record<string, number> = {};
    const availableWidth = window.innerWidth - 350; // Account for left panel
    const baseWidth = Math.max(
      COLUMN_MIN_WIDTH,
      Math.min(COLUMN_MAX_WIDTH, availableWidth / columns.length)
    );

    columns.forEach(column => {
      // Calculate width based on column name and sample data
      const headerWidth = column.length * 8 + 40; // Rough estimate
      let contentWidth = baseWidth;

      if (rows.length > 0) {
        // Sample first few rows to estimate content width
        const sampleRows = rows.slice(0, 10);
        const maxContentLength = Math.max(
          ...sampleRows.map(row => {
            const value = row[column];
            return value ? value.toString().length : 0;
          })
        );
        contentWidth = Math.min(COLUMN_MAX_WIDTH, maxContentLength * 8 + 24);
      }

      widths[column] = Math.max(
        COLUMN_MIN_WIDTH,
        Math.max(headerWidth, contentWidth)
      );
    });

    return widths;
  }, [columns, rows]);

  // Sort data
  const sortedRows = useMemo(() => {
    if (!sortConfig || rows.length === 0) return rows;

    return [...rows].sort((a, b) => {
      const aValue = a[sortConfig.column];
      const bValue = b[sortConfig.column];

      // Handle null values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Type-specific sorting
      const columnType = columnTypes[sortConfig.column] || 'string';
      let comparison = 0;

      switch (columnType) {
        case 'number':
          comparison = Number(aValue) - Number(bValue);
          break;
        case 'date':
          const dateA = aValue instanceof Date ? aValue : new Date(aValue);
          const dateB = bValue instanceof Date ? bValue : new Date(bValue);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case 'boolean':
          comparison = (aValue ? 1 : 0) - (bValue ? 1 : 0);
          break;
        default:
          comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [rows, sortConfig, columnTypes]);

  const handleSort = useCallback((column: string) => {
    setSortConfig(current => {
      if (current?.column === column) {
        return current.direction === 'asc'
          ? { column, direction: 'desc' }
          : null; // Remove sort
      }
      return { column, direction: 'asc' };
    });
  }, []);

  // Row renderer for virtual scrolling
  const RowRenderer = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const row = sortedRows[index];
      const isEven = index % 2 === 0;

      return (
        <div style={style}>
          <Row $isEven={isEven}>
            {columns.map(column => {
              const value = row[column];
              const columnType = columnTypes[column] || 'string';
              const formattedValue = formatValue(value, columnType);

              return (
                <Cell
                  key={column}
                  $width={columnWidths[column]}
                  $type={columnType}
                  title={formattedValue} // Tooltip for truncated content
                >
                  {formattedValue}
                </Cell>
              );
            })}
          </Row>
        </div>
      );
    },
    [sortedRows, columns, columnTypes, columnWidths]
  );

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading data...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorState>
          <strong>Error:</strong> {error}
        </ErrorState>
      </Container>
    );
  }

  if (!data || columns.length === 0) {
    return (
      <Container>
        <EmptyState>
          <div>No data to display</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>
            The file appears to be empty or could not be parsed
          </div>
        </EmptyState>
      </Container>
    );
  }

  const totalWidth = columns.reduce((sum, col) => sum + columnWidths[col], 0);

  return (
    <Container>
      <TableHeader>
        {columns.map(column => (
          <HeaderCell
            key={column}
            $width={columnWidths[column]}
            $sortable={true}
            onClick={() => handleSort(column)}
          >
            <span>{column}</span>
            <SortIcon
              $direction={
                sortConfig?.column === column ? sortConfig.direction : undefined
              }
            />
          </HeaderCell>
        ))}
      </TableHeader>

      <TableBody>
        {sortedRows.length === 0 ? (
          <EmptyState>
            <div>No rows match the current filters</div>
          </EmptyState>
        ) : (
          <List
            height={400} // This will be overridden by CSS
            itemCount={sortedRows.length}
            itemSize={ROW_HEIGHT}
            width={totalWidth}
            style={{ height: '100%' }}
          >
            {RowRenderer}
          </List>
        )}
      </TableBody>
    </Container>
  );
};

export default DataTable;
