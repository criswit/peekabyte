import React, { useState } from 'react';
import styled from 'styled-components';
import { CsvData, QueryResult } from '@shared/types';
import { exportToCsv } from '../../utils/csvUtils';

const Container = styled.div`
  padding: 12px;
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Header = styled.div`
  margin-bottom: 12px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.foreground};
`;

const ExportSection = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.colors.mutedForeground};
  text-transform: uppercase;
`;

const ExportGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const ExportButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props =>
    props.$variant === 'primary'
      ? props.theme.colors.primary
      : props.theme.colors.surface};
  color: ${props =>
    props.$variant === 'primary'
      ? props.theme.colors.primaryForeground
      : props.theme.colors.foreground};
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover {
    background-color: ${props =>
      props.$variant === 'primary'
        ? props.theme.colors.primary
        : props.theme.colors.hover};
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FullWidthButton = styled(ExportButton)`
  grid-column: 1 / -1;
`;

const FilenameInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  font-size: 11px;
  margin-bottom: 8px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const DataInfo = styled.div`
  padding: 8px;
  background-color: ${props => props.theme.colors.muted};
  border-radius: 4px;
  font-size: 11px;
  color: ${props => props.theme.colors.mutedForeground};
  margin-bottom: 12px;
`;

const OptionsSection = styled.div`
  margin-bottom: 16px;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: ${props => props.theme.colors.foreground};
  cursor: pointer;
  margin-bottom: 4px;
`;

const Checkbox = styled.input`
  margin: 0;
`;

const SelectContainer = styled.div`
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  font-size: 11px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Label = styled.label`
  display: block;
  font-size: 11px;
  color: ${props => props.theme.colors.mutedForeground};
  margin-bottom: 4px;
`;

interface ExportOptionsProps {
  data: CsvData | QueryResult | null;
  filename: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ data, filename }) => {
  const [exportFilename, setExportFilename] = useState(filename);
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [delimiter, setDelimiter] = useState(',');
  const [encoding, setEncoding] = useState('utf-8');

  const isQueryResult =
    data &&
    'columns' in data &&
    Array.isArray(data.columns) &&
    typeof data.columns[0] === 'string';
  const isCsvData =
    data &&
    'columns' in data &&
    Array.isArray(data.columns) &&
    data.columns.length > 0 &&
    typeof data.columns[0] === 'object';

  const getExportData = () => {
    if (!data) return [];

    if (isQueryResult) {
      const queryResult = data as QueryResult;
      return queryResult.rows.map(row => {
        const obj: Record<string, any> = {};
        queryResult.columns.forEach((col, index) => {
          obj[col] = row[index];
        });
        return obj;
      });
    } else if (isCsvData) {
      const csvData = data as CsvData;
      return csvData.rows;
    }

    return [];
  };

  const handleExportCsv = () => {
    const exportData = getExportData();
    if (exportData.length === 0) return;

    const csvFilename = exportFilename.endsWith('.csv')
      ? exportFilename
      : `${exportFilename}.csv`;
    exportToCsv(exportData, csvFilename);
  };

  const handleExportJson = () => {
    const exportData = getExportData();
    if (exportData.length === 0) return;

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportFilename.endsWith('.json')
      ? exportFilename
      : `${exportFilename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    // For now, export as CSV with .xlsx extension
    // In a real implementation, you'd use a library like xlsx
    const exportData = getExportData();
    if (exportData.length === 0) return;

    const csvFilename = exportFilename.endsWith('.xlsx')
      ? exportFilename
      : `${exportFilename}.xlsx`;
    exportToCsv(exportData, csvFilename);
  };

  const handleCopyToClipboard = async () => {
    const exportData = getExportData();
    if (exportData.length === 0) return;

    try {
      const csvContent = convertToCSV(exportData);
      await navigator.clipboard.writeText(csvContent);
      // You could show a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      includeHeaders ? headers.join(delimiter) : '',
      ...data.map(row =>
        headers
          .map(header => {
            const value = row[header];
            const stringValue =
              value === null || value === undefined ? '' : String(value);
            // Escape quotes and wrap in quotes if contains delimiter, quote, or newline
            return new RegExp(`[${delimiter}"\n\r]`).test(stringValue)
              ? `"${stringValue.replace(/"/g, '""')}"`
              : stringValue;
          })
          .join(delimiter)
      ),
    ]
      .filter(line => line !== '')
      .join('\n');

    return csvContent;
  };

  if (!data) {
    return (
      <Container>
        <Header>
          <Title>Export Options</Title>
        </Header>
        <DataInfo>No data available for export</DataInfo>
      </Container>
    );
  }

  const exportData = getExportData();
  const rowCount = exportData.length;
  const columnCount = isQueryResult
    ? (data as QueryResult).columns.length
    : isCsvData
      ? (data as CsvData).columns.length
      : 0;

  return (
    <Container>
      <Header>
        <Title>Export Options</Title>
      </Header>

      <DataInfo>
        Ready to export: {rowCount.toLocaleString()} rows × {columnCount}{' '}
        columns
      </DataInfo>

      <ExportSection>
        <SectionTitle>Filename</SectionTitle>
        <FilenameInput
          type='text'
          value={exportFilename}
          onChange={e => setExportFilename(e.target.value)}
          placeholder='Enter filename...'
        />
      </ExportSection>

      <OptionsSection>
        <SectionTitle>Export Options</SectionTitle>

        <CheckboxContainer>
          <Checkbox
            type='checkbox'
            checked={includeHeaders}
            onChange={e => setIncludeHeaders(e.target.checked)}
          />
          Include column headers
        </CheckboxContainer>

        <SelectContainer>
          <Label>Delimiter</Label>
          <Select
            value={delimiter}
            onChange={e => setDelimiter(e.target.value)}
          >
            <option value=','>Comma (,)</option>
            <option value=';'>Semicolon (;)</option>
            <option value='\t'>Tab</option>
            <option value='|'>Pipe (|)</option>
          </Select>
        </SelectContainer>

        <SelectContainer>
          <Label>Encoding</Label>
          <Select value={encoding} onChange={e => setEncoding(e.target.value)}>
            <option value='utf-8'>UTF-8</option>
            <option value='utf-16'>UTF-16</option>
            <option value='iso-8859-1'>ISO-8859-1</option>
          </Select>
        </SelectContainer>
      </OptionsSection>

      <ExportSection>
        <SectionTitle>Export Formats</SectionTitle>
        <ExportGrid>
          <ExportButton $variant='primary' onClick={handleExportCsv}>
            📄 CSV
          </ExportButton>
          <ExportButton onClick={handleExportJson}>📋 JSON</ExportButton>
          <ExportButton onClick={handleExportExcel}>📊 Excel</ExportButton>
          <ExportButton onClick={handleCopyToClipboard}>📋 Copy</ExportButton>
        </ExportGrid>
      </ExportSection>

      <ExportSection>
        <SectionTitle>Quick Actions</SectionTitle>
        <FullWidthButton
          onClick={() => {
            const csvData = convertToCSV(exportData);
            const blob = new Blob([csvData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${exportFilename}_preview.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
        >
          📝 Preview Export
        </FullWidthButton>
      </ExportSection>
    </Container>
  );
};

export default ExportOptions;
