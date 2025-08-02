import styled from 'styled-components';

export const FindBarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-left: 10px;
`;

export const FindInput = styled.input<{ $hasMatches: boolean }>`
  background-color: ${props => props.$hasMatches === false ? 
    props.theme.colors.error + '20' : 
    props.theme.colors.searchInputBackground};
  color: ${props => props.$hasMatches === false ? 
    props.theme.colors.error : 
    props.theme.colors.searchInputForeground};
  border: 1px solid ${props => props.$hasMatches === false ? 
    props.theme.colors.error : 
    props.theme.colors.border};
  border-radius: 4px;
  padding: 4px 8px;
  width: 150px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.info};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.fileIcon};
  }
`;

export const MatchCounter = styled.div`
  margin: 0 8px;
  font-size: 12px;
  color: ${props => props.theme.colors.foreground};
  min-width: 60px;
  text-align: center;
`;

export const NavigationButtons = styled.div`
  display: flex;
`;

export const NavButton = styled.button`
  background: ${props => props.theme.colors.buttonBackground};
  border: 1px solid ${props => props.theme.colors.buttonBorder};
  border-radius: 4px;
  color: ${props => props.disabled ? props.theme.colors.fileIcon : props.theme.colors.buttonForeground};
  padding: 2px 6px;
  margin-left: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.buttonHover};
    color: ${props => props.theme.colors.foreground};
  }
`;