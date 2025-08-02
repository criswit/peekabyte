import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  ArrayIndex
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
  const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
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
        ref={(el) => onSetMatchRefs(matchIndex, el)}
        style={{
          backgroundColor: matchIndex === currentMatchIndex ? '#ff8c00' : '#ffeb3b',
          color: '#000',
          borderRadius: '2px'
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
  isLast = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const renderValue = () => {
    if (value === null) {
      return <JsonNull>null</JsonNull>;
    }
    
    if (typeof value === 'string') {
      return (
        <JsonString>
          "
          <HighlightedText 
            text={value} 
            searchTerm={searchTerm}
            currentMatchIndex={currentMatchIndex}
            onSetMatchRefs={onSetMatchRefs}
          />
          "
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
              keyName=""
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
      {isArrayItem && index !== undefined && (
        <ArrayIndex>{index}:</ArrayIndex>
      )}
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
  onSetMatchRefs 
}) => {
  const parsedJson = useMemo(() => {
    try {
      return JSON.parse(content);
    } catch (e) {
      return null;
    }
  }, [content]);
  
  if (!parsedJson) {
    return (
      <JsonContainer>
        <div style={{ color: 'red' }}>Invalid JSON</div>
      </JsonContainer>
    );
  }
  
  return (
    <JsonContainer>
      <JsonNode
        keyName=""
        value={parsedJson}
        depth={0}
        searchTerm={searchTerm}
        currentMatchIndex={currentMatchIndex}
        onSetMatchRefs={onSetMatchRefs}
      />
    </JsonContainer>
  );
};

export default JsonViewer;