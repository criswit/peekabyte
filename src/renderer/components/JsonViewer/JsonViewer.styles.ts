import styled from 'styled-components';

export const JsonContainer = styled.div`
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 16px;
  overflow: auto;
  height: 100%;
`;

export const JsonLine = styled.div<{ $depth: number }>`
  padding-left: ${props => props.$depth * 20}px;
  position: relative;
`;

export const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.fileIcon};
  cursor: pointer;
  padding: 0;
  margin-right: 4px;
  font-family: monospace;
  font-size: 12px;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.colors.foreground};
  }
`;

export const JsonKey = styled.span`
  color: ${props => props.theme.colors.info};
  margin-right: 8px;
`;

export const JsonString = styled.span`
  color: ${props => props.theme.colors.success};
`;

export const JsonNumber = styled.span`
  color: ${props => props.theme.colors.warning};
`;

export const JsonBoolean = styled.span`
  color: ${props => props.theme.colors.error};
`;

export const JsonNull = styled.span`
  color: ${props => props.theme.colors.fileIcon};
  font-style: italic;
`;

export const JsonBracket = styled.span`
  color: ${props => props.theme.colors.foreground};
`;

export const JsonComma = styled.span`
  color: ${props => props.theme.colors.foreground};
`;

export const CollapsedPreview = styled.span`
  color: ${props => props.theme.colors.fileIcon};
  font-style: italic;
  margin-left: 8px;
`;

export const ArrayIndex = styled.span`
  color: ${props => props.theme.colors.fileIcon};
  margin-right: 8px;
`;