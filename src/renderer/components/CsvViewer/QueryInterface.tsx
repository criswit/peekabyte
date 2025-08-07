import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { CsvColumn, QueryResult, SavedQuery } from '@shared/types';
import {
  formatSqlQuery,
  validateQuery,
  getSavedQueries,
  saveQuery,
  deleteSavedQuery,
  generateQueryId,
  updateQueryUsage,
} from '../../utils/sqlUtils';
import { getSampleQueries } from '../../utils/csvUtils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const QueryEditor = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const EditorTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.foreground};
`;

const EditorActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  padding: 4px 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => {
    switch (props.$variant) {
      case 'primary':
        return props.theme.colors.primary;
      case 'danger':
        return props.theme.colors.destructive;
      default:
        return props.theme.colors.surface;
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'primary':
        return props.theme.colors.primaryForeground;
      case 'danger':
        return props.theme.colors.destructiveForeground;
      default:
        return props.theme.colors.foreground;
    }
  }};
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  max-height: 200px;
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const ValidationMessage = styled.div<{ $type: 'error' | 'success' }>`
  margin-top: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  background-color: ${props =>
    props.$type === 'error'
      ? props.theme.colors.destructive
      : props.theme.colors.success};
  color: ${props =>
    props.$type === 'error'
      ? props.theme.colors.destructiveForeground
      : props.theme.colors.successForeground};
`;

const SuggestionsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

const SampleQueries = styled.div`
  flex: 1;
`;

const SavedQueries = styled.div`
  flex: 1;
`;

const SectionTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.mutedForeground};
  text-transform: uppercase;
`;

const QueryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 120px;
  overflow-y: auto;
`;

const QueryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background-color: ${props => props.theme.colors.muted};
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

const QueryText = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
`;

const QueryActions = styled.div`
  display: flex;
  gap: 4px;
`;

const SmallButton = styled.button`
  padding: 2px 4px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.mutedForeground};
  cursor: pointer;
  font-size: 10px;
  border-radius: 2px;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.foreground};
  }
`;

const ResultSummary = styled.div`
  padding: 8px 12px;
  background-color: ${props => props.theme.colors.muted};
  border-top: 1px solid ${props => props.theme.colors.border};
  font-size: 12px;
  color: ${props => props.theme.colors.mutedForeground};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SaveQueryModal = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.surface};
  padding: 20px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  min-width: 300px;
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 16px;
  color: ${props => props.theme.colors.foreground};
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  font-size: 12px;
  margin-bottom: 12px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

interface QueryInterfaceProps {
  query: string;
  columns: CsvColumn[];
  onQueryChange: (query: string) => void;
  onExecute: () => void;
  result?: QueryResult | null;
}

const QueryInterface: React.FC<QueryInterfaceProps> = ({
  query,
  columns,
  onQueryChange,
  onExecute,
  result,
}) => {
  const [validation, setValidation] = useState<{
    isValid: boolean;
    error?: string;
  }>({ isValid: true });
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveQueryName, setSaveQueryName] = useState('');
  const [saveQueryDescription, setSaveQueryDescription] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved queries
  useEffect(() => {
    setSavedQueries(getSavedQueries());
  }, []);

  // Validate query when it changes
  useEffect(() => {
    const validationResult = validateQuery(query);
    setValidation(validationResult);
  }, [query]);

  const sampleQueries = getSampleQueries(columns);

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onQueryChange(e.target.value);
  };

  const handleExecute = () => {
    if (validation.isValid) {
      onExecute();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    }
  };

  const handleFormatQuery = () => {
    const formatted = formatSqlQuery(query);
    onQueryChange(formatted);
  };

  const handleLoadQuery = (queryToLoad: string) => {
    onQueryChange(queryToLoad);
  };

  const handleSaveQuery = () => {
    if (!saveQueryName.trim()) return;

    const newQuery: SavedQuery = {
      id: generateQueryId(),
      name: saveQueryName.trim(),
      query: query,
      description: saveQueryDescription.trim() || undefined,
      createdAt: new Date(),
      lastUsed: new Date(),
      favorite: false,
    };

    saveQuery(newQuery);
    setSavedQueries(getSavedQueries());
    setShowSaveModal(false);
    setSaveQueryName('');
    setSaveQueryDescription('');
  };

  const handleDeleteSavedQuery = (id: string) => {
    deleteSavedQuery(id);
    setSavedQueries(getSavedQueries());
  };

  const handleUseSavedQuery = (savedQuery: SavedQuery) => {
    onQueryChange(savedQuery.query);
    updateQueryUsage(savedQuery.id);
    setSavedQueries(getSavedQueries());
  };

  const handleToggleFavorite = (savedQuery: SavedQuery) => {
    const updated = { ...savedQuery, favorite: !savedQuery.favorite };
    saveQuery(updated);
    setSavedQueries(getSavedQueries());
  };

  return (
    <Container>
      <QueryEditor>
        <EditorHeader>
          <EditorTitle>SQL Query Editor</EditorTitle>
          <EditorActions>
            <ActionButton onClick={handleFormatQuery}>Format</ActionButton>
            <ActionButton onClick={() => setShowSaveModal(true)}>
              Save
            </ActionButton>
            <ActionButton
              $variant='primary'
              onClick={handleExecute}
              disabled={!validation.isValid}
            >
              Execute (Ctrl+Enter)
            </ActionButton>
          </EditorActions>
        </EditorHeader>

        <TextArea
          ref={textAreaRef}
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter your SQL query here... (e.g., SELECT * FROM data WHERE column_name = 'value')"
        />

        {!validation.isValid && validation.error && (
          <ValidationMessage $type='error'>
            {validation.error}
          </ValidationMessage>
        )}

        <SuggestionsContainer>
          <SampleQueries>
            <SectionTitle>Sample Queries</SectionTitle>
            <QueryList>
              {sampleQueries.map((sample, index) => (
                <QueryItem
                  key={index}
                  onClick={() => handleLoadQuery(sample.query)}
                >
                  <QueryText title={sample.description}>
                    {sample.name}: {sample.query}
                  </QueryText>
                </QueryItem>
              ))}
            </QueryList>
          </SampleQueries>

          <SavedQueries>
            <SectionTitle>Saved Queries ({savedQueries.length})</SectionTitle>
            <QueryList>
              {savedQueries
                .sort((a, b) => {
                  if (a.favorite && !b.favorite) return -1;
                  if (!a.favorite && b.favorite) return 1;
                  return b.lastUsed.getTime() - a.lastUsed.getTime();
                })
                .map(savedQuery => (
                  <QueryItem key={savedQuery.id}>
                    <QueryText
                      title={savedQuery.description || savedQuery.query}
                      onClick={() => handleUseSavedQuery(savedQuery)}
                    >
                      {savedQuery.favorite && '⭐ '}
                      {savedQuery.name}
                    </QueryText>
                    <QueryActions>
                      <SmallButton
                        onClick={e => {
                          e.stopPropagation();
                          handleToggleFavorite(savedQuery);
                        }}
                        title={
                          savedQuery.favorite
                            ? 'Remove from favorites'
                            : 'Add to favorites'
                        }
                      >
                        {savedQuery.favorite ? '⭐' : '☆'}
                      </SmallButton>
                      <SmallButton
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteSavedQuery(savedQuery.id);
                        }}
                        title='Delete query'
                      >
                        ×
                      </SmallButton>
                    </QueryActions>
                  </QueryItem>
                ))}
              {savedQueries.length === 0 && (
                <div
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '11px',
                  }}
                >
                  No saved queries yet
                </div>
              )}
            </QueryList>
          </SavedQueries>
        </SuggestionsContainer>
      </QueryEditor>

      {result && (
        <ResultSummary>
          <span>
            {result.error ? (
              <span style={{ color: '#ef4444' }}>Error: {result.error}</span>
            ) : (
              <span>
                {result.totalRows} rows returned in{' '}
                {result.executionTime.toFixed(2)}ms
              </span>
            )}
          </span>
          {!result.error && result.columns.length > 0 && (
            <span>Columns: {result.columns.join(', ')}</span>
          )}
        </ResultSummary>
      )}

      <SaveQueryModal $show={showSaveModal}>
        <ModalContent>
          <ModalTitle>Save Query</ModalTitle>
          <Input
            type='text'
            placeholder='Query name'
            value={saveQueryName}
            onChange={e => setSaveQueryName(e.target.value)}
          />
          <Input
            type='text'
            placeholder='Description (optional)'
            value={saveQueryDescription}
            onChange={e => setSaveQueryDescription(e.target.value)}
          />
          <ModalActions>
            <ActionButton onClick={() => setShowSaveModal(false)}>
              Cancel
            </ActionButton>
            <ActionButton
              $variant='primary'
              onClick={handleSaveQuery}
              disabled={!saveQueryName.trim()}
            >
              Save
            </ActionButton>
          </ModalActions>
        </ModalContent>
      </SaveQueryModal>
    </Container>
  );
};

export default QueryInterface;
