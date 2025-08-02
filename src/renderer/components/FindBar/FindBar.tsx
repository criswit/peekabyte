import React, { useRef, useEffect } from 'react';
import { FindBarProps } from './types';
import {
  FindBarContainer,
  FindInput,
  MatchCounter,
  NavigationButtons,
  NavButton
} from './FindBar.styles';

/**
 * FindBar component for searching text within documents
 */
const FindBar: React.FC<FindBarProps> = ({
  searchTerm,
  setSearchTerm,
  currentMatch,
  totalMatches,
  goToNextMatch,
  goToPreviousMatch,
  hasMatches,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when Cmd+F is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          // Select all text in the input when Cmd+F is pressed
          inputRef.current.select();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        goToPreviousMatch();
      } else {
        goToNextMatch();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSearchTerm('');
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      // Let the default Cmd+A behavior work
      return;
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
      // Select all text when Cmd+F is pressed while input is already focused
      e.preventDefault();
      e.currentTarget.select();
    }
  };
  
  return (
    <FindBarContainer>
      <FindInput
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          // Select all text when input is focused if there's any text
          if (searchTerm) {
            e.target.select();
          }
        }}
        placeholder="Find in document"
        $hasMatches={hasMatches}
      />
      <MatchCounter>
        {searchTerm ? 
          (hasMatches ? `${currentMatch} of ${totalMatches}` : 'No matches found') 
          : ''}
      </MatchCounter>
      <NavigationButtons>
        <NavButton onClick={goToPreviousMatch} disabled={!hasMatches}>
          ▲
        </NavButton>
        <NavButton onClick={goToNextMatch} disabled={!hasMatches}>
          ▼
        </NavButton>
      </NavigationButtons>
    </FindBarContainer>
  );
};

export default FindBar;