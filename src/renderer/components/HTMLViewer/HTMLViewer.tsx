import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { SelectedFile } from '@shared/types';

interface HTMLViewerProps {
  selectedFile: SelectedFile;
}

const ViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.colors.background};
`;

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 10px;
`;

const ViewModeSelector = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ModeButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  background-color: ${props =>
    props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props =>
    props.$active
      ? props.theme.colors.primaryForeground
      : props.theme.colors.foreground};
  border: 1px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props =>
      props.$active
        ? props.theme.colors.primaryHover
        : props.theme.colors.surface};
  }
`;

const RefreshButton = styled.button`
  padding: 6px 12px;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primaryForeground};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const HTMLFrame = styled.iframe`
  flex: 1;
  width: 100%;
  border: none;
  background-color: white;
`;

const SourceView = styled.pre`
  flex: 1;
  margin: 0;
  padding: 16px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;

  .match {
    background-color: #ffeb3b;
    color: #000;
    border-radius: 2px;
  }

  .current-match {
    background-color: #ff8c00;
    color: #000;
    border-radius: 2px;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.destructive};
  font-size: 16px;
  text-align: center;
  padding: 20px;
`;

const InfoPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: ${props => props.theme.colors.muted};
  font-size: 12px;
`;

const HTMLViewer: React.FC<HTMLViewerProps> = ({ selectedFile }) => {
  const [viewMode, setViewMode] = useState<'rendered' | 'source'>('rendered');
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Reset view mode when file changes
  useEffect(() => {
    setViewMode('rendered');
    setError(null);
  }, [selectedFile.path]);

  const handleRefresh = () => {
    if (iframeRef.current) {
      // Force iframe reload
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src;
        }
      }, 100);
    }
  };

  const handleIframeError = () => {
    setError('Failed to load HTML content');
  };

  if (selectedFile.error) {
    return (
      <ViewerContainer>
        <ErrorMessage>{selectedFile.error}</ErrorMessage>
      </ViewerContainer>
    );
  }

  // Create a data URL for the HTML content
  const htmlDataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(selectedFile.content)}`;

  // Get file size in KB
  const fileSizeKB = Math.round(selectedFile.content.length / 1024);

  return (
    <ViewerContainer>
      <ToolbarContainer>
        <ViewModeSelector>
          <ModeButton
            $active={viewMode === 'rendered'}
            onClick={() => setViewMode('rendered')}
          >
            Rendered
          </ModeButton>
          <ModeButton
            $active={viewMode === 'source'}
            onClick={() => setViewMode('source')}
          >
            Source
          </ModeButton>
        </ViewModeSelector>

        <InfoPanel>
          <span>HTML</span>
          <span>{fileSizeKB} KB</span>
          <span>{selectedFile.name}</span>
        </InfoPanel>

        {viewMode === 'rendered' && (
          <RefreshButton onClick={handleRefresh}>Refresh</RefreshButton>
        )}
      </ToolbarContainer>

      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : viewMode === 'rendered' ? (
        <HTMLFrame
          ref={iframeRef}
          src={htmlDataUrl}
          title={selectedFile.name}
          onError={handleIframeError}
          sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-modals'
        />
      ) : (
        <SourceView>{selectedFile.content}</SourceView>
      )}
    </ViewerContainer>
  );
};

export default HTMLViewer;
