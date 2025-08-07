import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { SelectedFile, CsvData, QueryResult } from '@shared/types';
import { parseCsvContent } from '../../utils/csvUtils';
import { executeQuery } from '../../utils/sqlUtils';
import DataTable from './DataTable';
import QueryInterface from './QueryInterface';
import FilterPanel from './FilterPanel';
import ColumnStats from './ColumnStats';
import ExportOptions from './ExportOptions';
import LoadingSpinner from './LoadingSpinner';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.surface};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.foreground};
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 8px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border: 1px solid
    ${props =>
      props.$active ? props.theme.colors.linkColor : props.theme.colors.border};
  background-color: ${props =>
    props.$active
      ? props.theme.colors.linkColor
      : props.theme.colors.background};
  color: ${props =>
    props.$active ? '#ffffff' : props.theme.colors.foreground};
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: ${props => (props.$active ? '600' : '500')};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props =>
      props.$active
        ? props.theme.colors.linkHover
        : props.theme.colors.fileHover};
    border-color: ${props => props.theme.colors.linkColor};
    color: ${props =>
      props.$active ? '#ffffff' : props.theme.colors.foreground};
  }

  &:focus {
    outline: 2px solid ${props => props.theme.colors.linkColor};
    outline-offset: 2px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const LeftPanel = styled.div<{ $collapsed: boolean }>`
  width: ${props => (props.$collapsed ? '0' : '300px')};
  min-width: ${props => (props.$collapsed ? '0' : '250px')};
  max-width: 400px;
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s ease;
`;

const DataArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const QuerySection = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TableSection = styled.div`
  flex: 1;
  overflow: hidden;
`;

const ErrorMessage = styled.div`
  padding: 16px;
  background-color: ${props => props.theme.colors.destructive};
  color: ${props => props.theme.colors.destructiveForeground};
  border-radius: 4px;
  margin: 16px;
`;

const InfoBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: ${props => props.theme.colors.muted};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: 12px;
  color: ${props => props.theme.colors.mutedForeground};
`;

const CollapseButton = styled.button`
  padding: 4px 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.foreground};
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 8px;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

interface CsvViewerProps {
  selectedFile: SelectedFile;
}

type ViewMode = 'table' | 'source' | 'query';

const CsvViewer: React.FC<CsvViewerProps> = ({ selectedFile }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(
    'SELECT * FROM data LIMIT 100'
  );
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Parse CSV data when file content changes
  useEffect(() => {
    const parseData = async () => {
      if (!selectedFile?.content) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await parseCsvContent(selectedFile.content);
        setCsvData(data);

        if (data.parseErrors.length > 0) {
          console.warn('CSV parsing warnings:', data.parseErrors);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to parse CSV file'
        );
      } finally {
        setLoading(false);
      }
    };

    parseData();
  }, [selectedFile?.content]);

  // Execute initial query when CSV data is loaded
  useEffect(() => {
    if (csvData && viewMode === 'query') {
      executeCurrentQuery();
    }
  }, [csvData, viewMode, executeCurrentQuery]);

  const executeCurrentQuery = useCallback(async () => {
    if (!csvData || !currentQuery.trim()) return;

    setLoading(true);
    try {
      const result = await executeQuery(currentQuery, csvData.rows);
      setQueryResult(result);
    } catch (err) {
      setQueryResult({
        columns: [],
        rows: [],
        totalRows: 0,
        executionTime: 0,
        error: err instanceof Error ? err.message : 'Query execution failed',
      });
    } finally {
      setLoading(false);
    }
  }, [csvData, currentQuery]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (!csvData) return null;

    const hasFilters = Object.keys(filters).length > 0;
    if (!hasFilters) return csvData;

    const filteredRows = csvData.rows.filter(row => {
      return Object.entries(filters).every(([column, filterValue]) => {
        if (!filterValue) return true;

        const cellValue = row[column];
        if (cellValue === null || cellValue === undefined) return false;

        const stringValue = cellValue.toString().toLowerCase();
        const filterString = filterValue.toString().toLowerCase();

        return stringValue.includes(filterString);
      });
    });

    return {
      ...csvData,
      rows: filteredRows,
      totalRows: filteredRows.length,
    };
  }, [csvData, filters]);

  const handleQueryChange = (query: string) => {
    setCurrentQuery(query);
  };

  const handleQueryExecute = () => {
    executeCurrentQuery();
  };

  const handleFilterChange = (column: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [column]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const displayData = viewMode === 'query' ? queryResult : filteredData;

  if (loading) {
    return (
      <Container>
        <LoadingSpinner message='Processing CSV file...' />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      </Container>
    );
  }

  if (!csvData) {
    return (
      <Container>
        <ErrorMessage>No CSV data available</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          {selectedFile.name}
          <CollapseButton
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
          >
            {leftPanelCollapsed ? '→' : '←'} Panel
          </CollapseButton>
        </Title>
        <ViewToggle>
          <ToggleButton
            $active={viewMode === 'table'}
            onClick={() => setViewMode('table')}
          >
            Table View
          </ToggleButton>
          <ToggleButton
            $active={viewMode === 'query'}
            onClick={() => setViewMode('query')}
          >
            Query View
          </ToggleButton>
          <ToggleButton
            $active={viewMode === 'source'}
            onClick={() => setViewMode('source')}
          >
            Source View
          </ToggleButton>
        </ViewToggle>
      </Header>

      <InfoBar>
        <span>
          {displayData?.totalRows || 0} rows × {csvData.columns.length} columns
          {viewMode === 'table' && Object.keys(filters).length > 0 && (
            <span> (filtered from {csvData.totalRows} total)</span>
          )}
          {viewMode === 'query' && queryResult && (
            <span>
              {' '}
              • Query executed in {queryResult.executionTime.toFixed(2)}ms
            </span>
          )}
        </span>
        <span>
          Delimiter: {csvData.delimiter === '\t' ? 'Tab' : csvData.delimiter} •
          Encoding: {csvData.encoding.toUpperCase()}
        </span>
      </InfoBar>

      {viewMode === 'source' ? (
        <pre
          style={{
            padding: '16px',
            margin: 0,
            overflow: 'auto',
            backgroundColor: '#f5f5f5',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          {selectedFile.content}
        </pre>
      ) : (
        <MainContent>
          <LeftPanel $collapsed={leftPanelCollapsed}>
            {viewMode === 'table' ? (
              <>
                <FilterPanel
                  columns={csvData.columns}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
                <ColumnStats columns={csvData.columns} />
              </>
            ) : (
              <ExportOptions
                data={displayData}
                filename={selectedFile.name.replace(/\.[^/.]+$/, '')}
              />
            )}
          </LeftPanel>

          <DataArea>
            {viewMode === 'query' && (
              <QuerySection>
                <QueryInterface
                  query={currentQuery}
                  columns={csvData.columns}
                  onQueryChange={handleQueryChange}
                  onExecute={handleQueryExecute}
                  result={queryResult}
                />
              </QuerySection>
            )}

            <TableSection>
              <DataTable
                data={displayData}
                loading={loading}
                error={displayData?.error}
              />
            </TableSection>
          </DataArea>
        </MainContent>
      )}
    </Container>
  );
};

export default CsvViewer;
