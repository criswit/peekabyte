import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import FileBrowser from './components/FileBrowser';
import MarkdownViewer from './components/MarkdownViewer';
import ImageViewer from './components/ImageViewer';
import PDFViewer from './components/PDFViewer';
import HTMLViewer from './components/HTMLViewer';
import CsvViewer from './components/CsvViewer/CsvViewer';
import { SelectedFile } from '@shared/types';

// Log that App.tsx is being loaded
console.log('App.tsx is loading');

const AppContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  min-width: 600px; /* Ensure minimum width for the app */
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
`;

const FileBrowserContainer = styled.div<{ $width: number }>`
  height: 100%;
  width: ${props => props.$width}px;
  min-width: 200px;
  max-width: 600px;
  flex-shrink: 0;
  overflow: hidden; /* Prevent content from overflowing */
`;

const MarkdownViewerContainer = styled.div`
  flex-grow: 1;
  height: 100%;
  min-width: 300px; /* Ensure minimum width for content */
  overflow: hidden; /* Prevent content from overflowing */
`;

const ResizeHandle = styled.div<{ $left: number }>`
  position: absolute;
  top: 0;
  left: ${props => props.$left}px;
  width: 10px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;

  &:hover {
    background-color: rgba(100, 100, 100, 0.1);
  }

  &:active {
    background-color: rgba(100, 100, 100, 0.2);
  }
`;

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [showSource, setShowSource] = useState(false);
  const [panelWidth, setPanelWidth] = useState(() => {
    // Get saved width from localStorage or default to 300px
    const savedWidth = localStorage.getItem('markdownViewerPanelWidth');
    return savedWidth ? parseInt(savedWidth, 10) : 300;
  });

  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  // Check if electronAPI is available
  useEffect(() => {
    console.log('Checking electronAPI availability:', {
      electronAPIExists: !!window.electronAPI,
      availableMethods: window.electronAPI
        ? Object.keys(window.electronAPI)
        : [],
    });
  }, []);

  // Set up file watcher for the selected file
  useEffect(() => {
    if (!selectedFile || !selectedFile.isMarkdown || !window.electronAPI)
      return;

    const setupFileWatcher = async () => {
      try {
        console.log(`Setting up file watcher for: ${selectedFile.path}`);
        // Start watching the selected file
        await window.electronAPI.watchFile(selectedFile.path);

        // Set up file change listener
        const removeFileListener = window.electronAPI.onFileChanged(data => {
          console.log('File changed event received:', data);

          if (data.path === selectedFile.path) {
            if (data.deleted) {
              // Handle file deletion
              console.log('Selected file was deleted');
              setSelectedFile(prevFile =>
                prevFile
                  ? {
                      ...prevFile,
                      deleted: true,
                      error: 'The file has been deleted.',
                    }
                  : null
              );
            } else if (data.content) {
              // Update the file content
              console.log(
                'Updating file content with:',
                data.content.substring(0, 50) + '...'
              );
              setSelectedFile(prevFile =>
                prevFile
                  ? {
                      ...prevFile,
                      content: data.content,
                      error: null,
                      deleted: false,
                    }
                  : null
              );
            }
          }
        });

        // Clean up listener when component unmounts or file changes
        return () => {
          console.log(`Cleaning up file watcher for: ${selectedFile.path}`);
          removeFileListener();
          window.electronAPI.unwatchFile();
        };
      } catch (err) {
        console.error('Error setting up file watcher:', err);
      }
    };

    const cleanup = setupFileWatcher();

    // Clean up when component unmounts or selected file changes
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
      window.electronAPI.unwatchFile();
    };
  }, [selectedFile]);

  const handleFileSelect = async (file: SelectedFile) => {
    try {
      console.log('File selected in App.tsx:', file);
      console.log('File properties:', {
        name: file.name,
        isMarkdown: file.isMarkdown,
        isJson: file.isJson,
        isImage: file.isImage,
        isPdf: file.isPdf,
        isHtml: file.isHtml,
        isCsv: file.isCsv,
        contentLength: file.content?.length,
      });
      setSelectedFile(file);
    } catch (err) {
      console.error('Error selecting file:', err);
    }
  };

  const toggleViewMode = () => {
    setShowSource(!showSource);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    startXRef.current = e.clientX;
    startWidthRef.current = panelWidth;
    setIsResizing(true);

    document.body.classList.add('resize-active');
  };

  useEffect(() => {
    const handleResizeMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = startWidthRef.current + (e.clientX - startXRef.current);
      // Constrain width between min and max values
      const constrainedWidth = Math.max(200, Math.min(600, newWidth));
      setPanelWidth(constrainedWidth);
    };

    const handleResizeEnd = () => {
      if (!isResizing) return;

      setIsResizing(false);
      document.body.classList.remove('resize-active');

      // Save the width to localStorage
      localStorage.setItem('markdownViewerPanelWidth', panelWidth.toString());
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, panelWidth]);

  return (
    <AppContainer>
      <FileBrowserContainer $width={panelWidth}>
        <FileBrowser
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
        />
      </FileBrowserContainer>

      <ResizeHandle $left={panelWidth} onMouseDown={handleResizeStart} />

      <MarkdownViewerContainer>
        {selectedFile?.isImage ? (
          <ImageViewer selectedFile={selectedFile} />
        ) : selectedFile?.isPdf ? (
          <PDFViewer selectedFile={selectedFile} />
        ) : selectedFile?.isHtml ? (
          <HTMLViewer selectedFile={selectedFile} />
        ) : selectedFile?.isCsv ? (
          <CsvViewer selectedFile={selectedFile} />
        ) : (
          <MarkdownViewer
            content={selectedFile ? selectedFile.content : ''}
            showSource={showSource}
            onToggleView={toggleViewMode}
            selectedFile={selectedFile}
          />
        )}
      </MarkdownViewerContainer>
    </AppContainer>
  );
};

export default App;
