import styled from 'styled-components';

export const JsonContainer = styled.div`
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 16px;
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const QueryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
`;

export const QueryTypeSelector = styled.div`
  display: flex;
  gap: 16px;

  label {
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${props => props.theme.colors.foreground};
    cursor: pointer;
    font-size: 13px;

    input[type='radio'] {
      margin: 0;
    }
  }
`;

export const QueryInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.muted};
  }
`;

export const QueryButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primaryForeground};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.muted};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const ClearButton = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  color: ${props => props.theme.colors.foreground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.surface};
    border-color: ${props => props.theme.colors.foreground};
  }
`;

export const QueryResults = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  padding: 12px;
  background-color: ${props => props.theme.colors.background};
`;

export const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.destructive};
  background-color: ${props => props.theme.colors.destructive}10;
  border: 1px solid ${props => props.theme.colors.destructive}30;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 12px;
  font-size: 13px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
`;

export const QueryInfo = styled.div`
  color: ${props => props.theme.colors.success};
  background-color: ${props => props.theme.colors.success}10;
  border: 1px solid ${props => props.theme.colors.success}30;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 12px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
