import styled from 'styled-components';

export const ViewerContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
`;

export const ViewerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.headerBackground};
  min-height: 24px; /* Ensure minimum height for the header */
`;

export const ViewerTitle = styled.div`
  font-size: 1.1em;
  font-weight: 500;
  color: ${props => props.theme.colors.headerForeground};
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ViewerButton = styled.button`
  background: ${props => props.theme.colors.buttonBackground};
  border: 1px solid ${props => props.theme.colors.buttonBorder};
  border-radius: 4px;
  color: ${props => props.theme.colors.buttonForeground};
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 10px;
  white-space: nowrap; /* Prevent text wrapping */

  &:hover {
    background-color: ${props => props.theme.colors.buttonHover};
    color: ${props => props.theme.colors.foreground};
  }
`;

export const ContentContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  line-height: 1.6;
`;

export const MarkdownContent = styled.div`
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${props => props.theme.colors.foreground};
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }

  h1 {
    font-size: 1.8em;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    padding-bottom: 0.3em;
  }

  h2 {
    font-size: 1.5em;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    padding-bottom: 0.3em;
  }

  a {
    color: ${props => props.theme.colors.linkColor};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      color: ${props => props.theme.colors.linkHover};
    }
  }

  blockquote {
    border-left: 4px solid ${props => props.theme.colors.blockquoteBorder};
    margin-left: 0;
    padding-left: 1em;
    background-color: ${props => props.theme.colors.blockquoteBackground};
  }

  code {
    background-color: ${props => props.theme.colors.codeBackground};
    color: ${props => props.theme.colors.codeForeground};
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family:
      'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 85%;
  }

  pre {
    background-color: ${props => props.theme.colors.codeBackground};
    border-radius: 6px;
    padding: 16px;
    overflow: auto;

    code {
      background-color: transparent;
      padding: 0;
    }
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }

  th,
  td {
    border: 1px solid ${props => props.theme.colors.tableBorder};
    padding: 8px 12px;
  }

  th {
    background-color: ${props => props.theme.colors.tableHeaderBackground};
  }

  tr:nth-child(even) {
    background-color: ${props => props.theme.colors.tableRowEven};
  }

  img {
    max-width: 100%;
  }

  ul,
  ol {
    padding-left: 2em;
  }

  li {
    margin: 0.3em 0;
  }

  hr {
    border: none;
    border-top: 1px solid ${props => props.theme.colors.border};
    margin: 1.5em 0;
  }

  /* Math equation styles */
  .katex {
    font-size: 1.1em;
    color: ${props => props.theme.colors.foreground};
  }

  .katex-display {
    margin: 1em 0;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.5em 0;
  }

  /* Inline math */
  .katex:not(.katex-display) {
    padding: 0 0.2em;
  }
`;

export const SourceView = styled.pre`
  background-color: ${props => props.theme.colors.codeBackground};
  color: ${props => props.theme.colors.codeForeground};
  border-radius: 6px;
  padding: 16px;
  margin: 0;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow: auto;
  height: calc(100% - 32px);
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.fileIcon};
  text-align: center;
  padding: 20px;
`;

export const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.error};
  text-align: center;
  padding: 20px;

  h3 {
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 20px;
    max-width: 400px;
  }
`;

export const RefreshButton = styled.button`
  background-color: ${props => props.theme.colors.success};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    opacity: 0.9;
  }
`;

export const FileDeletedMessage = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: ${props => props.theme.colors.codeBackground};
  border-radius: 4px;
  font-size: 14px;
  color: ${props => props.theme.colors.fileIcon};
`;

export const HighlightedText = styled.span<{ $isCurrent: boolean }>`
  background-color: ${props =>
    props.$isCurrent
      ? props.theme.colors.searchHighlightCurrent
      : props.theme.colors.searchHighlight};
  color: #000;
  border-radius: 2px;
`;
