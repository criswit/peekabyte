import React from 'react';
import styled from 'styled-components';

// Define the HighlightedText component directly in this file
const HighlightedText = styled.span<{ $isCurrent: boolean }>`
  background-color: ${props => props.$isCurrent ? 
    props.theme.colors.searchHighlightCurrent : 
    props.theme.colors.searchHighlight};
  color: #000;
  border-radius: 2px;
`;

/**
 * Helper function to escape special characters in regex
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

type SetMatchRefs = (index: number, element: HTMLElement | null) => void;

interface TextRendererProps {
  children: React.ReactNode;
}

/**
 * Factory function to create a custom text renderer for react-markdown
 */
const createTextRenderer = (
  searchTerm: string, 
  currentMatchIndex: number, 
  setMatchRefs: SetMatchRefs
): React.FC<TextRendererProps> => {
  // Use a closure to maintain state across all text nodes
  let globalMatchCount = 0;
  
  // Reset the counter before each render cycle
  const resetCounter = () => {
    globalMatchCount = 0;
  };
  
  // Call reset at the beginning of each render cycle
  resetCounter();
  
  // Return a function that will be called for each text node
  return function TextRenderer(props: TextRendererProps) {
    // Extract text from props
    const { children } = props;
    
    // Handle different types of children
    let text = '';
    if (typeof children === 'string') {
      text = children;
    } else if (Array.isArray(children)) {
      text = children.join('');
    } else if (children && typeof children === 'object') {
      try {
        text = JSON.stringify(children);
      } catch (e) {
        // Handle circular references
        text = '';
      }
    }
    
    // If no search term or empty text, just return the text
    if (!searchTerm || !text) {
      return <>{children}</>;
    }
    
    try {
      // Check if this text node contains the search term
      const hasMatch = text.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!hasMatch) return <>{children}</>;
      
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      const regex = new RegExp(escapeRegExp(searchTerm), 'gi');
      let match: RegExpExecArray | null;
      
      // Find all matches in this text node
      while ((match = regex.exec(text)) !== null) {
        const matchIndex = globalMatchCount++;
        const matchText = match[0]; // Store match text in a variable
        
        // Add text before match
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        
        // Add highlighted match
        const isCurrentMatch = matchIndex === currentMatchIndex;
        
        // Create a stable reference function that doesn't change on re-renders
        // This is crucial to avoid React errors with refs
        const refCallback = (el: HTMLElement | null) => {
          if (el && setMatchRefs) {
            // Use setTimeout to avoid React errors during rendering
            setTimeout(() => {
              setMatchRefs(matchIndex, el);
            }, 0);
          }
        };
        
        // Create the highlighted match element
        const highlightedMatch = (
          <HighlightedText
            key={`match-${matchIndex}`}
            ref={refCallback}
            $isCurrent={isCurrentMatch}
          >
            {matchText}
          </HighlightedText>
        );
        
        parts.push(highlightedMatch);
        lastIndex = regex.lastIndex;
      }
      
      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }
      
      return <>{parts.length > 0 ? parts : children}</>;
    } catch (error) {
      console.error('Error in text renderer:', error);
      return <>{children}</>;
    }
  };
};

export default createTextRenderer;