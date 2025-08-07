import React, { useState } from 'react';
import styled from 'styled-components';
import { CsvColumn } from '@shared/types';

const Container = styled.div`
  flex: 1;
  padding: 12px;
  background-color: ${props => props.theme.colors.surface};
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.foreground};
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 4px 8px;
  border: none;
  background-color: ${props =>
    props.$active
      ? props.theme.colors.linkColor
      : props.theme.colors.background};
  color: ${props =>
    props.$active ? '#ffffff' : props.theme.colors.foreground};
  cursor: pointer;
  font-size: 11px;
  font-weight: ${props => (props.$active ? '600' : '500')};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props =>
      props.$active
        ? props.theme.colors.linkHover
        : props.theme.colors.fileHover};
    color: ${props =>
      props.$active ? '#ffffff' : props.theme.colors.foreground};
  }

  &:focus {
    outline: 2px solid ${props => props.theme.colors.linkColor};
    outline-offset: 2px;
  }
`;

const ColumnList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ColumnCard = styled.div<{ $expanded: boolean }>`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background-color: ${props => props.theme.colors.background};
  overflow: hidden;
  transition: all 0.2s ease;
`;

const ColumnHeader = styled.div`
  padding: 8px 12px;
  background-color: ${props => props.theme.colors.muted};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

const ColumnName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
`;

const TypeBadge = styled.span<{ $type: string }>`
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.$type) {
      case 'number':
        return '#3b82f6';
      case 'date':
        return '#10b981';
      case 'boolean':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  }};
  color: white;
`;

const ExpandIcon = styled.span<{ $expanded: boolean }>`
  transition: transform 0.2s ease;
  transform: rotate(${props => (props.$expanded ? '90deg' : '0deg')});
  font-size: 10px;
`;

const ColumnDetails = styled.div<{ $expanded: boolean }>`
  max-height: ${props => (props.$expanded ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const DetailsContent = styled.div`
  padding: 12px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 11px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  color: ${props => props.theme.colors.mutedForeground};
  font-weight: 500;
`;

const StatValue = styled.span`
  color: ${props => props.theme.colors.foreground};
  font-family: monospace;
`;

const QualityIndicator = styled.div<{ $quality: 'good' | 'warning' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: ${props => {
    switch (props.$quality) {
      case 'good':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
    }
  }};
`;

const TopValues = styled.div`
  margin-top: 8px;
`;

const TopValuesTitle = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.theme.colors.mutedForeground};
  margin-bottom: 4px;
`;

const ValueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ValueItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 4px;
  background-color: ${props => props.theme.colors.muted};
  border-radius: 3px;
  font-size: 10px;
`;

const ValueBar = styled.div<{ $percentage: number }>`
  height: 2px;
  background-color: ${props => props.theme.colors.primary};
  width: ${props => props.$percentage}%;
  margin-top: 2px;
  border-radius: 1px;
`;

const SummaryStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
`;

const SummaryCard = styled.div`
  padding: 8px;
  background-color: ${props => props.theme.colors.muted};
  border-radius: 4px;
  text-align: center;
`;

const SummaryValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.foreground};
`;

const SummaryLabel = styled.div`
  font-size: 10px;
  color: ${props => props.theme.colors.mutedForeground};
  text-transform: uppercase;
`;

interface ColumnStatsProps {
  columns: CsvColumn[];
}

type ViewMode = 'summary' | 'detailed';

const ColumnStats: React.FC<ColumnStatsProps> = ({ columns }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('summary');
  const [expandedColumns, setExpandedColumns] = useState<Set<string>>(
    new Set()
  );

  const toggleColumn = (columnKey: string) => {
    setExpandedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  };

  const getDataQuality = (column: CsvColumn): 'good' | 'warning' | 'error' => {
    if (!column.stats) return 'good';

    const nullPercentage = (column.stats.nullCount / column.stats.count) * 100;

    if (nullPercentage > 50) return 'error';
    if (nullPercentage > 20) return 'warning';
    return 'good';
  };

  const getQualityIcon = (quality: 'good' | 'warning' | 'error') => {
    switch (quality) {
      case 'good':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✗';
    }
  };

  const formatValue = (value: any, type: string): string => {
    if (value === null || value === undefined) return 'N/A';

    switch (type) {
      case 'number':
        return typeof value === 'number'
          ? value.toLocaleString()
          : value.toString();
      case 'date':
        return value instanceof Date
          ? value.toLocaleDateString()
          : value.toString();
      default:
        return value.toString();
    }
  };

  const totalRows = columns.length > 0 ? columns[0].stats?.count || 0 : 0;
  const totalColumns = columns.length;
  const numericColumns = columns.filter(col => col.type === 'number').length;
  const dateColumns = columns.filter(col => col.type === 'date').length;

  if (viewMode === 'summary') {
    return (
      <Container>
        <Header>
          <Title>Data Overview</Title>
          <ViewToggle>
            <ToggleButton
              $active={viewMode === 'summary'}
              onClick={() => setViewMode('summary')}
            >
              Summary
            </ToggleButton>
            <ToggleButton
              $active={viewMode === 'detailed'}
              onClick={() => setViewMode('detailed')}
            >
              Detailed
            </ToggleButton>
          </ViewToggle>
        </Header>

        <SummaryStats>
          <SummaryCard>
            <SummaryValue>{totalRows.toLocaleString()}</SummaryValue>
            <SummaryLabel>Total Rows</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>{totalColumns}</SummaryValue>
            <SummaryLabel>Columns</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>{numericColumns}</SummaryValue>
            <SummaryLabel>Numeric</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>{dateColumns}</SummaryValue>
            <SummaryLabel>Date</SummaryLabel>
          </SummaryCard>
        </SummaryStats>

        <ColumnList>
          {columns.map(column => {
            const quality = getDataQuality(column);
            const nullPercentage = column.stats
              ? (column.stats.nullCount / column.stats.count) * 100
              : 0;

            return (
              <ColumnCard key={column.key} $expanded={false}>
                <ColumnHeader>
                  <ColumnName>
                    <span>{column.name}</span>
                    <TypeBadge $type={column.type}>{column.type}</TypeBadge>
                  </ColumnName>
                  <QualityIndicator $quality={quality}>
                    {getQualityIcon(quality)}
                    {nullPercentage.toFixed(1)}% null
                  </QualityIndicator>
                </ColumnHeader>
              </ColumnCard>
            );
          })}
        </ColumnList>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Column Statistics</Title>
        <ViewToggle>
          <ToggleButton
            $active={viewMode === 'summary'}
            onClick={() => setViewMode('summary')}
          >
            Summary
          </ToggleButton>
          <ToggleButton
            $active={viewMode === 'detailed'}
            onClick={() => setViewMode('detailed')}
          >
            Detailed
          </ToggleButton>
        </ViewToggle>
      </Header>

      <ColumnList>
        {columns.map(column => {
          const isExpanded = expandedColumns.has(column.key);
          const quality = getDataQuality(column);

          return (
            <ColumnCard key={column.key} $expanded={isExpanded}>
              <ColumnHeader onClick={() => toggleColumn(column.key)}>
                <ColumnName>
                  <ExpandIcon $expanded={isExpanded}>▶</ExpandIcon>
                  <span>{column.name}</span>
                  <TypeBadge $type={column.type}>{column.type}</TypeBadge>
                </ColumnName>
                <QualityIndicator $quality={quality}>
                  {getQualityIcon(quality)}
                </QualityIndicator>
              </ColumnHeader>

              <ColumnDetails $expanded={isExpanded}>
                <DetailsContent>
                  {column.stats && (
                    <>
                      <StatRow>
                        <StatLabel>Total Count</StatLabel>
                        <StatValue>
                          {column.stats.count.toLocaleString()}
                        </StatValue>
                      </StatRow>
                      <StatRow>
                        <StatLabel>Unique Values</StatLabel>
                        <StatValue>
                          {column.stats.uniqueCount.toLocaleString()}
                        </StatValue>
                      </StatRow>
                      <StatRow>
                        <StatLabel>Null Values</StatLabel>
                        <StatValue>
                          {column.stats.nullCount.toLocaleString()}(
                          {(
                            (column.stats.nullCount / column.stats.count) *
                            100
                          ).toFixed(1)}
                          %)
                        </StatValue>
                      </StatRow>

                      {column.stats.min !== undefined && (
                        <StatRow>
                          <StatLabel>Min Value</StatLabel>
                          <StatValue>
                            {formatValue(column.stats.min, column.type)}
                          </StatValue>
                        </StatRow>
                      )}

                      {column.stats.max !== undefined && (
                        <StatRow>
                          <StatLabel>Max Value</StatLabel>
                          <StatValue>
                            {formatValue(column.stats.max, column.type)}
                          </StatValue>
                        </StatRow>
                      )}

                      {column.stats.avg !== undefined && (
                        <StatRow>
                          <StatLabel>Average</StatLabel>
                          <StatValue>{column.stats.avg.toFixed(2)}</StatValue>
                        </StatRow>
                      )}

                      {column.stats.median !== undefined && (
                        <StatRow>
                          <StatLabel>Median</StatLabel>
                          <StatValue>
                            {column.stats.median.toFixed(2)}
                          </StatValue>
                        </StatRow>
                      )}

                      {column.stats.topValues &&
                        column.stats.topValues.length > 0 && (
                          <TopValues>
                            <TopValuesTitle>Most Common Values</TopValuesTitle>
                            <ValueList>
                              {column.stats.topValues
                                .slice(0, 5)
                                .map(({ value, count }, index) => {
                                  const percentage =
                                    (count / column.stats!.count) * 100;
                                  const maxCount =
                                    column.stats!.topValues![0].count;
                                  const barPercentage =
                                    (count / maxCount) * 100;

                                  return (
                                    <div key={index}>
                                      <ValueItem>
                                        <span>{value}</span>
                                        <span>
                                          {count} ({percentage.toFixed(1)}%)
                                        </span>
                                      </ValueItem>
                                      <ValueBar $percentage={barPercentage} />
                                    </div>
                                  );
                                })}
                            </ValueList>
                          </TopValues>
                        )}
                    </>
                  )}
                </DetailsContent>
              </ColumnDetails>
            </ColumnCard>
          );
        })}
      </ColumnList>
    </Container>
  );
};

export default ColumnStats;
