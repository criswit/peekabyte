import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Components } from 'react-markdown';
import 'katex/dist/katex.min.css';
import FindBar from '../FindBar';
import createTextRenderer from '../TextRenderer';
import ThemeSelector from '../ThemeSelector';
import JsonViewer from '../JsonViewer';
import MermaidDiagram from '../MermaidDiagram';
import { MarkdownViewerProps } from './types';
import {
  ViewerContainer,
  ViewerHeader,
  ViewerTitle,
  ViewerButton,
  ContentContainer,
  MarkdownContent,
  SourceView,
  EmptyState,
  ErrorState,
  RefreshButton,
  FileDeletedMessage
} from './MarkdownViewer.styles';

// Helper function to escape special characters in RegExp
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Helper function to escape HTML for source view
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * SourceViewWithHighlights component for highlighting search matches in source view
 */
interface SourceViewWithHighlightsProps {
  content: string;
  searchTerm: string;
  currentMatchIndex: number;
}

const SourceViewWithHighlights: React.FC<SourceViewWithHighlightsProps> = ({ 
  content, 
  searchTerm, 
  currentMatchIndex 
}) => {
  const containerRef = useRef<HTMLPreElement>(null);
  const [highlightedContent, setHighlightedContent] = useState(content);
  
  useEffect(() => {
    if (!searchTerm) {
      setHighlightedContent(escapeHtml(content));
      return;
    }
    
    // Create highlighted HTML
    const regex = new RegExp(escapeRegExp(searchTerm), 'gi');
    let match;
    const matches: Array<{ index: number; length: number }> = [];
    
    // Find all matches
    while ((match = regex.exec(content)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
      });
    }
    
    // Replace matches with highlighted spans
    let html = '';
    let lastIndex = 0;
    
    matches.forEach((match, index) => {
      const isCurrentMatch = index === currentMatchIndex;
      
      html += escapeHtml(content.substring(lastIndex, match.index));
      html += `<span class="${isCurrentMatch ? 'current-match' : 'match'}">`;
      html += escapeHtml(content.substring(match.index, match.index + match.length));
      html += '</span>';
      
      lastIndex = match.index + match.length;
    });
    
    html += escapeHtml(content.substring(lastIndex));
    setHighlightedContent(html);
    
    // Scroll to current match
    if (matches.length > 0 && containerRef.current) {
      setTimeout(() => {
        const currentMatch = containerRef.current?.querySelector('.current-match');
        if (currentMatch) {
          currentMatch.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 0);
    }
  }, [content, searchTerm, currentMatchIndex]);
  
  return (
    <SourceView 
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: highlightedContent }}
      style={{
        ['--match-background' as any]: '#ffeb3b',
        ['--current-match-background' as any]: '#ff8c00'
      }}
    />
  );
};

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ 
  content, 
  showSource, 
  onToggleView, 
  selectedFile 
}) => {
  const [fileError, setFileError] = useState<string | null>(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [matches, setMatches] = useState<(HTMLElement | number)[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const matchRefs = useRef<{ [key: number]: HTMLElement }>({});
  const [forceUpdate, setForceUpdate] = useState(0); // Used to force re-renders
  
  // Debug: Log when ReactMarkdown renders
  useEffect(() => {
    // Reset match refs when ReactMarkdown re-renders
    if (!showSource) {
      matchRefs.current = {};
    }
  }, [content, showSource, debouncedSearchTerm, forceUpdate]);
  
  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timerId);
  }, [searchTerm]);
  
  // Reset search when content or view mode changes
  useEffect(() => {
    setMatches([]);
    setCurrentMatchIndex(0);
    matchRefs.current = {};
    
    // If we have a search term, force a re-render to ensure highlighting is applied
    if (debouncedSearchTerm) {
      // Use a small delay to ensure the DOM has updated
      setTimeout(() => {
        setForceUpdate(prev => prev + 1);
      }, 50);
    }
  }, [content, showSource, debouncedSearchTerm]);
  
  // Set match refs
  const setMatchRefs = useCallback((index: number, element: HTMLElement | null) => {
    if (element) {
      // Store the ref without triggering a re-render
      matchRefs.current[index] = element;
    }
  }, []);
  
  // Update matches when debounced search term changes
  useEffect(() => {
    if (!debouncedSearchTerm) {
      setMatches([]);
      setCurrentMatchIndex(0);
      return;
    }
    
    // For source view, we count matches differently
    if (showSource) {
      const regex = new RegExp(escapeRegExp(debouncedSearchTerm), 'gi');
      let match;
      let matchCount = 0;
      
      // Count matches in source view
      while ((match = regex.exec(content)) !== null) {
        matchCount++;
      }
      
      // Create array of match indices
      const matchIndices = Array.from({ length: matchCount }, (_, i) => i);
      setMatches(matchIndices);
      setCurrentMatchIndex(matchIndices.length > 0 ? 0 : -1);
      return;
    }
    
    // For rendered view, collect matches from refs
    // Use a timeout to ensure components have rendered
    const checkForMatches = () => {
      const matchElements = Object.values(matchRefs.current).filter(Boolean);
      
      // If we have matches, update state
      if (matchElements.length > 0) {
        setMatches(matchElements);
        setCurrentMatchIndex(0);
        return true;
      }
      
      // Check if we expect matches in the content
      const regex = new RegExp(escapeRegExp(debouncedSearchTerm), 'gi');
      const rawMatchCount = (content.match(regex) || []).length;
      
      // If we expect matches but don't have any, return false
      if (rawMatchCount > 0) {
        return false;
      }
      
      // No matches expected
      setMatches([]);
      setCurrentMatchIndex(-1);
      return true;
    };
    
    // Wait a bit for the components to render and refs to be collected
    setTimeout(() => {
      if (!checkForMatches()) {
        // If we didn't find matches but expect them, try again after a longer delay
        setTimeout(() => {
          if (!checkForMatches()) {
            // Last resort: force a re-render and try one more time
            setForceUpdate(prev => prev + 1);
            setTimeout(checkForMatches, 100);
          }
        }, 100);
      }
    }, 50);
  }, [debouncedSearchTerm, content, showSource]);
  
  // Navigation functions
  const goToNextMatch = useCallback(() => {
    if (matches.length === 0) return;
    
    const nextIndex = currentMatchIndex >= matches.length - 1 ? 0 : currentMatchIndex + 1;
    setCurrentMatchIndex(nextIndex);
    
    // Scroll to match
    if (!showSource && matchRefs.current[nextIndex]) {
      matchRefs.current[nextIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [matches.length, currentMatchIndex, showSource]);
  
  const goToPreviousMatch = useCallback(() => {
    if (matches.length === 0) return;
    
    const prevIndex = currentMatchIndex <= 0 ? matches.length - 1 : currentMatchIndex - 1;
    setCurrentMatchIndex(prevIndex);
    
    // Scroll to match
    if (!showSource && matchRefs.current[prevIndex]) {
      matchRefs.current[prevIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [matches.length, currentMatchIndex, showSource]);
  
  // Update error state when selectedFile changes
  useEffect(() => {
    if (selectedFile?.error) {
      setFileError(selectedFile.error);
    } else if (selectedFile?.deleted) {
      setFileError('The file has been deleted.');
    } else {
      setFileError(null);
    }
  }, [selectedFile]);
  
  const handleRefreshClick = async () => {
    if (!selectedFile || !window.electronAPI) return;
    
    try {
      // Try to read the file again
      const updatedContent = await window.electronAPI.readFile(selectedFile.path);
      
      // If successful, update the content and clear any errors
      selectedFile.content = updatedContent;
      setFileError(null);
    } catch (err) {
      // If the file doesn't exist, show a specific error
      const error = err as Error;
      if (error.message.includes('no such file') || error.message.includes('ENOENT')) {
        setFileError('The file no longer exists on disk.');
      } else {
        setFileError(`Error reading file: ${error.message}`);
      }
    }
  };

  // Custom renderer for code blocks and text nodes
  const components = useMemo<Components>(() => {
    // Create a new text renderer for each render cycle
    const textRenderer = createTextRenderer(debouncedSearchTerm || '', currentMatchIndex, setMatchRefs);
    
    // Create a wrapper for each component type that processes text children
    const createComponentWrapper = (type: string) => {
      return ({children, ...props}: any) => {
        // If children is a string and contains the search term, process it
        if (typeof children === 'string' && debouncedSearchTerm && 
            children.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) {
          
          // Process the text directly
          const processedChildren = textRenderer({children});
          
          // Return the component with processed children
          return React.createElement(type, props, processedChildren);
        }
        
        // Return the component with original children
        return React.createElement(type, props, children);
      };
    };
    
    return {
      // Override the default text renderer
      text: textRenderer as any,
      
      // Create a wrapper for each component type that passes children through
      p: createComponentWrapper('p'),
      h1: createComponentWrapper('h1'),
      h2: createComponentWrapper('h2'),
      h3: createComponentWrapper('h3'),
      h4: createComponentWrapper('h4'),
      h5: createComponentWrapper('h5'),
      h6: createComponentWrapper('h6'),
      a: createComponentWrapper('a'),
      strong: createComponentWrapper('strong'),
      em: createComponentWrapper('em'),
      ul: createComponentWrapper('ul'),
      ol: createComponentWrapper('ol'),
      li: createComponentWrapper('li'),
      blockquote: createComponentWrapper('blockquote'),
      
      // Special handling for code blocks
      code({node, inline, className, children, ...props}: any) {
        const match = /language-(\w+)/.exec(className || '');
        
        // Handle Mermaid diagrams
        if (!inline && match && match[1] === 'mermaid') {
          return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
        }
        
        return !inline && match ? (
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    };
  }, [debouncedSearchTerm, currentMatchIndex, setMatchRefs, content, forceUpdate]);

  return (
    <ViewerContainer>
      <ViewerHeader>
        <ViewerTitle>
          {selectedFile ? selectedFile.name : 'No file selected'}
        </ViewerTitle>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FindBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            currentMatch={currentMatchIndex + 1}
            totalMatches={matches.length}
            goToNextMatch={goToNextMatch}
            goToPreviousMatch={goToPreviousMatch}
            hasMatches={matches.length > 0}
          />
          
          {selectedFile && (
            <ViewerButton onClick={onToggleView}>
              {showSource ? 'Show Rendered' : 'Show Source'}
            </ViewerButton>
          )}
          
          <ThemeSelector />
        </div>
      </ViewerHeader>
      
      <ContentContainer>
        {fileError ? (
          <ErrorState>
            <h3>File Error</h3>
            <p>{fileError}</p>
            {!selectedFile?.deleted && (
              <RefreshButton onClick={handleRefreshClick}>
                Try Again
              </RefreshButton>
            )}
          </ErrorState>
        ) : selectedFile ? (
          showSource ? (
            searchTerm ? (
              <SourceViewWithHighlights
                content={content}
                searchTerm={debouncedSearchTerm}
                currentMatchIndex={currentMatchIndex}
              />
            ) : (
              <SourceView>{content}</SourceView>
            )
          ) : selectedFile.isJson ? (
            <JsonViewer
              content={content}
              searchTerm={debouncedSearchTerm}
              currentMatchIndex={currentMatchIndex}
              onSetMatchRefs={setMatchRefs}
            />
          ) : (
            <MarkdownContent>
              <div id="debug-info" style={{display: 'none'}}>
                Search Term: {debouncedSearchTerm || 'none'}, 
                Force Update: {forceUpdate},
                Matches: {matches.length}
              </div>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkMath]} 
                rehypePlugins={[rehypeKatex]}
                components={components}
                key={`markdown-${forceUpdate}-${debouncedSearchTerm}`} // Force re-render when forceUpdate or search term changes
              >
                {content}
              </ReactMarkdown>
            </MarkdownContent>
          )
        ) : (
          <EmptyState>
            <h3>No File Selected</h3>
            <p>Select a markdown or JSON file from the file browser to view its contents.</p>
          </EmptyState>
        )}
      </ContentContainer>
    </ViewerContainer>
  );
};

export default MarkdownViewer;