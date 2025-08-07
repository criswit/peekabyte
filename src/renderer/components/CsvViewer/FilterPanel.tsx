import React, { useState } from 'react';
import styled from 'styled-components';
import { CsvColumn } from '@shared/types';

const Container = styled.div`
  padding: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.surface};
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

const ClearButton = styled.button`
  padding: 4px 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.foreground};
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
`;

const FilterItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.colors.foreground};
  display: flex;
  align-items: center;
  gap: 4px;
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

const FilterInput = styled.input`
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  font-size: 12px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const FilterSelect = styled.select`
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  font-size: 12px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const RangeContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const RangeInput = styled(FilterInput)`
  flex: 1;
`;

const RangeLabel = styled.span`
  font-size: 11px;
  color: ${props => props.theme.colors.mutedForeground};
`;

const UniqueValues = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
  max-height: 80px;
  overflow-y: auto;
`;

const ValueChip = styled.button<{ $selected: boolean }>`
  padding: 2px 6px;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props =>
    props.$selected ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props =>
    props.$selected
      ? props.theme.colors.primaryForeground
      : props.theme.colors.foreground};
  border-radius: 12px;
  cursor: pointer;
  font-size: 10px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props =>
      props.$selected ? props.theme.colors.primary : props.theme.colors.hover};
  }
`;

const FilterStats = styled.div`
  margin-top: 8px;
  padding: 8px;
  background-color: ${props => props.theme.colors.muted};
  border-radius: 4px;
  font-size: 11px;
  color: ${props => props.theme.colors.mutedForeground};
`;

interface FilterPanelProps {
  columns: CsvColumn[];
  filters: Record<string, any>;
  onFilterChange: (column: string, value: any) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  columns,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [expandedColumns, setExpandedColumns] = useState<Set<string>>(
    new Set()
  );

  const hasActiveFilters = Object.keys(filters).some(key => filters[key]);

  const toggleColumnExpanded = (columnKey: string) => {
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

  const renderFilter = (column: CsvColumn) => {
    const isExpanded = expandedColumns.has(column.key);
    const currentFilter = filters[column.key];

    const renderBasicFilter = () => (
      <FilterInput
        type='text'
        placeholder={`Filter ${column.name}...`}
        value={currentFilter || ''}
        onChange={e => onFilterChange(column.key, e.target.value)}
      />
    );

    const renderNumberFilter = () => (
      <RangeContainer>
        <RangeInput
          type='number'
          placeholder='Min'
          value={currentFilter?.min || ''}
          onChange={e =>
            onFilterChange(column.key, {
              ...currentFilter,
              min: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
        <RangeLabel>to</RangeLabel>
        <RangeInput
          type='number'
          placeholder='Max'
          value={currentFilter?.max || ''}
          onChange={e =>
            onFilterChange(column.key, {
              ...currentFilter,
              max: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </RangeContainer>
    );

    const renderDateFilter = () => (
      <RangeContainer>
        <RangeInput
          type='date'
          value={currentFilter?.start || ''}
          onChange={e =>
            onFilterChange(column.key, {
              ...currentFilter,
              start: e.target.value,
            })
          }
        />
        <RangeLabel>to</RangeLabel>
        <RangeInput
          type='date'
          value={currentFilter?.end || ''}
          onChange={e =>
            onFilterChange(column.key, {
              ...currentFilter,
              end: e.target.value,
            })
          }
        />
      </RangeContainer>
    );

    const renderBooleanFilter = () => (
      <FilterSelect
        value={currentFilter || ''}
        onChange={e => onFilterChange(column.key, e.target.value)}
      >
        <option value=''>All values</option>
        <option value='true'>True</option>
        <option value='false'>False</option>
      </FilterSelect>
    );

    const renderUniqueValues = () => {
      if (!column.stats?.topValues) return null;

      const selectedValues = new Set(
        Array.isArray(currentFilter) ? currentFilter : []
      );

      return (
        <UniqueValues>
          {column.stats.topValues.slice(0, 10).map(({ value, count }) => (
            <ValueChip
              key={value}
              $selected={selectedValues.has(value)}
              onClick={() => {
                const newSelected = new Set(selectedValues);
                if (newSelected.has(value)) {
                  newSelected.delete(value);
                } else {
                  newSelected.add(value);
                }
                onFilterChange(column.key, Array.from(newSelected));
              }}
            >
              {value} ({count})
            </ValueChip>
          ))}
        </UniqueValues>
      );
    };

    return (
      <FilterItem key={column.key}>
        <FilterLabel onClick={() => toggleColumnExpanded(column.key)}>
          <span style={{ cursor: 'pointer' }}>
            {isExpanded ? '▼' : '▶'} {column.name}
          </span>
          <TypeBadge $type={column.type}>{column.type}</TypeBadge>
        </FilterLabel>

        {isExpanded && (
          <>
            {column.type === 'number'
              ? renderNumberFilter()
              : column.type === 'date'
                ? renderDateFilter()
                : column.type === 'boolean'
                  ? renderBooleanFilter()
                  : renderBasicFilter()}

            {column.stats &&
              column.stats.uniqueCount <= 20 &&
              renderUniqueValues()}

            <FilterStats>
              {column.stats && (
                <>
                  <div>Total: {column.stats.count.toLocaleString()}</div>
                  <div>Unique: {column.stats.uniqueCount.toLocaleString()}</div>
                  <div>Null: {column.stats.nullCount.toLocaleString()}</div>
                  {column.stats.min !== undefined && (
                    <div>
                      Range: {column.stats.min} - {column.stats.max}
                    </div>
                  )}
                  {column.stats.avg !== undefined && (
                    <div>Average: {column.stats.avg.toFixed(2)}</div>
                  )}
                </>
              )}
            </FilterStats>
          </>
        )}
      </FilterItem>
    );
  };

  return (
    <Container>
      <Header>
        <Title>Filters</Title>
        <ClearButton onClick={onClearFilters} disabled={!hasActiveFilters}>
          Clear All
        </ClearButton>
      </Header>

      <FilterList>{columns.map(renderFilter)}</FilterList>

      {hasActiveFilters && (
        <FilterStats>
          Active filters:{' '}
          {Object.keys(filters).filter(key => filters[key]).length}
        </FilterStats>
      )}
    </Container>
  );
};

export default FilterPanel;
