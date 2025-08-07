import React, { useState, useMemo, useRef } from 'react';
import * as jsonpath from 'jsonpath';
import jq from 'jq-in-the-browser';
import { JsonViewerProps, JsonNodeProps } from './types';
import {
  JsonContainer,
  JsonLine,
  ToggleButton,
  JsonKey,
  JsonString,
  JsonNumber,
  JsonBoolean,
  JsonNull,
  JsonBracket,
  JsonComma,
  CollapsedPreview,
  ArrayIndex,
  QueryContainer,
  QueryInput,
  QueryButton,
  QueryTypeSelector,
  QueryResults,
  ErrorMessage,
  QueryInfo,
  ClearButton,
} from './JsonViewer.styles';

// Helper to create highlighted text
const HighlightedText: React.FC<{
  text: string;
  searchTerm: string;
  currentMatchIndex: number;
  onSetMatchRefs: (index: number, element: HTMLElement | null) => void;
}> = ({ text, searchTerm, currentMatchIndex, onSetMatchRefs }) => {
  const matchIndexRef = useRef(0);

  if (!searchTerm) return <>{text}</>;

  const parts: React.ReactNode[] = [];
  const regex = new RegExp(
    searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    'gi'
  );
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchIndex = matchIndexRef.current++;

    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    parts.push(
      <span
        key={`match-${matchIndex}`}
        ref={el => onSetMatchRefs(matchIndex, el)}
        style={{
          backgroundColor:
            matchIndex === currentMatchIndex ? '#ff8c00' : '#ffeb3b',
          color: '#000',
          borderRadius: '2px',
        }}
      >
        {match[0]}
      </span>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
};

const JsonNode: React.FC<JsonNodeProps> = ({
  keyName,
  value,
  depth,
  searchTerm,
  currentMatchIndex,
  onSetMatchRefs,
  isArrayItem,
  index,
  isLast = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderValue = () => {
    if (value === null) {
      return <JsonNull>null</JsonNull>;
    }

    if (typeof value === 'string') {
      return (
        <JsonString>
          &quot;
          <HighlightedText
            text={value}
            searchTerm={searchTerm}
            currentMatchIndex={currentMatchIndex}
            onSetMatchRefs={onSetMatchRefs}
          />
          &quot;
        </JsonString>
      );
    }

    if (typeof value === 'number') {
      return <JsonNumber>{value}</JsonNumber>;
    }

    if (typeof value === 'boolean') {
      return <JsonBoolean>{value.toString()}</JsonBoolean>;
    }

    if (Array.isArray(value)) {
      if (isCollapsed) {
        return (
          <>
            <JsonBracket>[</JsonBracket>
            <CollapsedPreview>...{value.length} items</CollapsedPreview>
            <JsonBracket>]</JsonBracket>
          </>
        );
      }

      return (
        <>
          <JsonBracket>[</JsonBracket>
          {value.map((item, idx) => (
            <JsonNode
              key={idx}
              keyName=''
              value={item}
              depth={depth + 1}
              searchTerm={searchTerm}
              currentMatchIndex={currentMatchIndex}
              onSetMatchRefs={onSetMatchRefs}
              isArrayItem={true}
              index={idx}
              isLast={idx === value.length - 1}
            />
          ))}
          <JsonLine $depth={depth}>
            <JsonBracket>]</JsonBracket>
          </JsonLine>
        </>
      );
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value);

      if (isCollapsed) {
        return (
          <>
            <JsonBracket>{'{'}</JsonBracket>
            <CollapsedPreview>...{entries.length} properties</CollapsedPreview>
            <JsonBracket>{'}'}</JsonBracket>
          </>
        );
      }

      return (
        <>
          <JsonBracket>{'{'}</JsonBracket>
          {entries.map(([key, val], idx) => (
            <JsonNode
              key={key}
              keyName={key}
              value={val}
              depth={depth + 1}
              searchTerm={searchTerm}
              currentMatchIndex={currentMatchIndex}
              onSetMatchRefs={onSetMatchRefs}
              isLast={idx === entries.length - 1}
            />
          ))}
          <JsonLine $depth={depth}>
            <JsonBracket>{'}'}</JsonBracket>
          </JsonLine>
        </>
      );
    }

    return null;
  };

  const isExpandable = value && typeof value === 'object';
  const showComma = !isLast;

  return (
    <JsonLine $depth={depth}>
      {isExpandable && (
        <ToggleButton onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? '▶' : '▼'}
        </ToggleButton>
      )}
      {isArrayItem && index !== undefined && <ArrayIndex>{index}:</ArrayIndex>}
      {keyName && (
        <JsonKey>
          <HighlightedText
            text={keyName}
            searchTerm={searchTerm}
            currentMatchIndex={currentMatchIndex}
            onSetMatchRefs={onSetMatchRefs}
          />
          :
        </JsonKey>
      )}
      {renderValue()}
      {showComma && <JsonComma>,</JsonComma>}
    </JsonLine>
  );
};

const JsonViewer: React.FC<JsonViewerProps> = ({
  content,
  searchTerm,
  currentMatchIndex,
  onSetMatchRefs,
}) => {
  const [queryType, setQueryType] = useState<'jsonpath' | 'jq'>('jsonpath');
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(true);

  const parsedJson = useMemo(() => {
    try {
      return JSON.parse(content);
    } catch (e) {
      return null;
    }
  }, [content]);

  const executeQuery = () => {
    if (!parsedJson || !query.trim()) {
      setQueryResult(null);
      setQueryError(null);
      return;
    }

    try {
      setQueryError(null);

      if (queryType === 'jsonpath') {
        const result = jsonpath.query(parsedJson, query);
        setQueryResult(result);
        setShowOriginal(false);
      } else if (queryType === 'jq') {
        const result = jq(query)(parsedJson);
        setQueryResult(result);
        setShowOriginal(false);
      }
    } catch (error) {
      setQueryError(
        `${queryType.toUpperCase()} Error: ${(error as Error).message}`
      );
      setQueryResult(null);
    }
  };

  const clearQuery = () => {
    setQuery('');
    setQueryResult(null);
    setQueryError(null);
    setShowOriginal(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      executeQuery();
    }
  };

  // Sample queries for different types
  const getSampleQueries = () => {
    if (queryType === 'jsonpath') {
      return ['$.*', '$..*', '$..name', '$[*].id', '$[?(@.price < 10)]'];
    } else {
      return ['.', '.[]', '.[] | .name', 'map(.id)', 'select(.price < 10)'];
    }
  };

  if (!parsedJson) {
    return (
      <JsonContainer>
        <div style={{ color: 'red' }}>Invalid JSON</div>
      </JsonContainer>
    );
  }

  const dataToDisplay = showOriginal ? parsedJson : queryResult;

  return (
    <JsonContainer>
      <QueryContainer>
        <QueryTypeSelector>
          <label>
            <input
              type='radio'
              value='jsonpath'
              checked={queryType === 'jsonpath'}
              onChange={e => setQueryType(e.target.value as 'jsonpath')}
            />
            JSONPath
          </label>
          <label>
            <input
              type='radio'
              value='jq'
              checked={queryType === 'jq'}
              onChange={e => setQueryType(e.target.value as 'jq')}
            />
            jq
          </label>
        </QueryTypeSelector>

        <div
          style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}
        >
          <QueryInput
            type='text'
            placeholder={
              queryType === 'jsonpath'
                ? 'Enter JSONPath query (e.g., $.store.book[*].title)'
                : 'Enter jq expression (e.g., .store.book[] | .title)'
            }
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <QueryButton onClick={executeQuery} disabled={!query.trim()}>
            Execute
          </QueryButton>
          {(queryResult !== null || queryError) && (
            <ClearButton onClick={clearQuery}>Clear</ClearButton>
          )}
        </div>
      </QueryContainer>

      {queryError && <ErrorMessage>{queryError}</ErrorMessage>}

      {queryResult !== null && !queryError && (
        <QueryInfo>
          Query executed successfully.
          {Array.isArray(queryResult) &&
            ` Found ${queryResult.length} result(s).`}
          {!showOriginal && (
            <button
              onClick={() => setShowOriginal(true)}
              style={{
                marginLeft: '10px',
                background: 'none',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '2px 8px',
                cursor: 'pointer',
              }}
            >
              Show Original
            </button>
          )}
        </QueryInfo>
      )}

      <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        <strong>Sample {queryType} queries:</strong>{' '}
        {getSampleQueries().join(' | ')}
        <br />
        <strong>Tip:</strong> Press Ctrl+Enter (Cmd+Enter on Mac) to execute
        query
      </div>

      {dataToDisplay !== null ? (
        <QueryResults>
          <JsonNode
            keyName=''
            value={dataToDisplay}
            depth={0}
            searchTerm={searchTerm}
            currentMatchIndex={currentMatchIndex}
            onSetMatchRefs={onSetMatchRefs}
          />
        </QueryResults>
      ) : (
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          No query results to display
        </div>
      )}
    </JsonContainer>
  );
};

export default JsonViewer;
