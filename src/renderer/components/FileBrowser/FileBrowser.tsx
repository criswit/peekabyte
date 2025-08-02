import React, { useState, useEffect } from 'react';
import { FileItem, SelectedFile, Favorite } from '@shared/types';
import { FileBrowserProps } from './types';
import {
  FileBrowserContainer,
  DirectoryHeader,
  CurrentPath,
  BackButton,
  FavoriteButton,
  FileList,
  FileItem as FileItemStyled,
  FolderIcon,
  SymlinkIcon,
  FileIcon,
  FileName,
  FavoritesSection,
  FavoritesHeader,
  FavoritesList,
  FavoriteItem,
  RemoveFavoriteButton,
  OpenFolderButton,
  ToolbarContainer,
  ToolbarButton,
  RefreshButton
} from './FileBrowser.styles';

const FileBrowser: React.FC<FileBrowserProps> = ({ onFileSelect, selectedFile }) => {
  const [currentPath, setCurrentPath] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showDotFiles, setShowDotFiles] = useState(false);

  // Initialize with home directory
  useEffect(() => {
    const initializeHomeDir = async () => {
      try {
        // Use Electron API to get home directory
        if (window.electronAPI) {
          console.log('Electron API available, getting home directory');
          const homeDir = await window.electronAPI.getHomeDir();
          console.log('Home directory:', homeDir);
          setCurrentPath(homeDir);
          loadDirectoryContents(homeDir);
        } else {
          console.error('Electron API not available');
          setError('Electron API not available. This app requires Electron to access the file system.');
        }
        
        // Load favorites from localStorage if available
        const savedFavorites = localStorage.getItem('markdownViewerFavorites');
        if (savedFavorites) {
          try {
            setFavorites(JSON.parse(savedFavorites));
          } catch (e) {
            console.error('Error loading favorites:', e);
            setFavorites([]);
          }
        }
        
        // Load dot files preference from localStorage if available
        const savedShowDotFiles = localStorage.getItem('markdownViewerShowDotFiles');
        if (savedShowDotFiles !== null) {
          setShowDotFiles(savedShowDotFiles === 'true');
        }
      } catch (err) {
        console.error('Error initializing home directory:', err);
        setError(`Error initializing: ${(err as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeHomeDir();
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('markdownViewerFavorites', JSON.stringify(favorites));
    }
  }, [favorites]);
  
  // Save dot files preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('markdownViewerShowDotFiles', showDotFiles.toString());
    
    // Reload current directory when the setting changes
    if (currentPath) {
      loadDirectoryContents(currentPath);
    }
  }, [showDotFiles]);

  const loadDirectoryContents = async (dirPath: string) => {
    try {
      setIsLoading(true);
      console.log(`Loading directory contents for: ${dirPath}`);
      
      const dirContents = await window.electronAPI.readDirectory(dirPath, showDotFiles);
      
      // Sort directories first, then files alphabetically
      const sortedFiles = dirContents.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
      
      setFiles(sortedFiles);
      setError(null);
    } catch (err) {
      console.error(`Error loading directory contents for ${dirPath}:`, err);
      setError(`Error reading directory: ${(err as Error).message}`);
      setFiles([]);
      
      // If the directory doesn't exist anymore, try to navigate to parent
      if ((err as Error).message.includes('no such file') || (err as Error).message.includes('ENOENT')) {
        const pathParts = dirPath.split(/[/\\]/);
        pathParts.pop(); // Remove last part
        const parentPath = pathParts.join('/');
        
        if (parentPath && parentPath !== dirPath) {
          console.log(`Directory not found, navigating to parent: ${parentPath}`);
          setCurrentPath(parentPath);
          loadDirectoryContents(parentPath);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileClick = async (file: FileItem) => {
    if (file.isDirectory) {
      setCurrentPath(file.path);
      loadDirectoryContents(file.path);
    } else if (file.isMarkdown || file.isJson) {
      try {
        // Check if file still exists before trying to read it
        const content = await window.electronAPI.readFile(file.path);
          
        onFileSelect({
          ...file,
          content,
          error: null,
          deleted: false
        });
      } catch (err) {
        console.error('Error reading file:', err);
        
        // Still pass the file to the parent component, but without content
        // The MarkdownViewer will handle displaying the error
        onFileSelect({
          ...file,
          content: '',
          error: (err as Error).message,
          deleted: (err as Error).message.includes('no such file') || (err as Error).message.includes('ENOENT')
        });
      }
    }
  };

  const handleBackClick = () => {
    // Get parent directory path
    const pathParts = currentPath.split(/[/\\]/);
    pathParts.pop(); // Remove last part
    const parentPath = pathParts.join('/');
    
    if (parentPath) {
      setCurrentPath(parentPath);
      loadDirectoryContents(parentPath);
    }
  };

  const handleOpenFolder = async () => {
    try {
      const selectedDir = await window.electronAPI.openDirectoryDialog();
      if (selectedDir) {
        setCurrentPath(selectedDir);
        loadDirectoryContents(selectedDir);
      }
    } catch (err) {
      console.error('Error opening directory:', err);
      setError(`Error opening directory: ${(err as Error).message}`);
    }
  };

  const toggleFavorite = () => {
    // Check if current path is already a favorite
    const isFavorite = favorites.some(fav => fav.path === currentPath);
    
    if (isFavorite) {
      // Remove from favorites
      setFavorites(favorites.filter(fav => fav.path !== currentPath));
    } else {
      // Add to favorites
      const newFavorite: Favorite = {
        name: currentPath.split(/[/\\]/).pop() || currentPath,
        path: currentPath
      };
      setFavorites([...favorites, newFavorite]);
    }
  };

  const removeFavorite = (e: React.MouseEvent, favPath: string) => {
    e.stopPropagation(); // Prevent navigating to the favorite when removing it
    setFavorites(favorites.filter(fav => fav.path !== favPath));
  };

  const navigateToFavorite = (favPath: string) => {
    setCurrentPath(favPath);
    loadDirectoryContents(favPath);
  };

  const toggleFavoritesSection = () => {
    setShowFavorites(!showFavorites);
  };
  
  const toggleDotFiles = () => {
    setShowDotFiles(!showDotFiles);
  };

  const isFavorite = favorites.some(fav => fav.path === currentPath);

  return (
    <FileBrowserContainer>
      <FavoritesSection>
        <FavoritesHeader>
          <span>Favorites</span>
          <span 
            onClick={toggleFavoritesSection} 
            style={{ cursor: 'pointer' }}
          >
            {showFavorites ? '▼' : '►'}
          </span>
        </FavoritesHeader>
        
        {showFavorites && (
          <FavoritesList>
            {favorites.length === 0 ? (
              <FileItemStyled style={{ color: '#666' }}>
                No favorites yet
              </FileItemStyled>
            ) : (
              favorites.map((fav) => (
                <FavoriteItem 
                  key={fav.path} 
                  onClick={() => navigateToFavorite(fav.path)}
                >
                  <FolderIcon>📁</FolderIcon>
                  <FileName>{fav.name}</FileName>
                  <RemoveFavoriteButton 
                    onClick={(e) => removeFavorite(e, fav.path)}
                  >
                    ✕
                  </RemoveFavoriteButton>
                </FavoriteItem>
              ))
            )}
          </FavoritesList>
        )}
      </FavoritesSection>
      
      <OpenFolderButton onClick={handleOpenFolder}>
        Open Folder
      </OpenFolderButton>
      
      <ToolbarContainer>
        <div>
          <ToolbarButton 
            onClick={toggleDotFiles}
            $active={showDotFiles}
            title={showDotFiles ? "Hide dot files" : "Show dot files"}
          >
            {showDotFiles ? "Hide Dot Files" : "Show Dot Files"}
          </ToolbarButton>
        </div>
        <RefreshButton 
          onClick={() => loadDirectoryContents(currentPath)}
          title="Refresh directory"
        >
          🔄 Refresh
        </RefreshButton>
      </ToolbarContainer>
      
      <DirectoryHeader>
        <BackButton 
          onClick={handleBackClick} 
          disabled={currentPath === '/' || currentPath.length <= 1}
        >
          ←
        </BackButton>
        <CurrentPath title={currentPath}>{currentPath}</CurrentPath>
        <FavoriteButton 
          onClick={toggleFavorite}
          $isFavorite={isFavorite}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? '♥' : '♡'}
        </FavoriteButton>
      </DirectoryHeader>
      
      {error ? (
        <div style={{ padding: '10px', color: 'red' }}>{error}</div>
      ) : isLoading ? (
        <div style={{ padding: '10px', color: '#ccc', textAlign: 'center' }}>Loading...</div>
      ) : (
        <FileList>
          {files.map((file) => (
            <FileItemStyled 
              key={file.path} 
              onClick={() => handleFileClick(file)}
              $selected={selectedFile && selectedFile.path === file.path}
            >
              {file.isDirectory ? (
                file.isSymlink ? (
                  <SymlinkIcon title="Symbolic Link to Directory">🔗📁</SymlinkIcon>
                ) : (
                  <FolderIcon>📁</FolderIcon>
                )
              ) : file.isMarkdown ? (
                file.isSymlink ? (
                  <SymlinkIcon title="Symbolic Link to Markdown File">🔗📄</SymlinkIcon>
                ) : (
                  <FileIcon $isMarkdown>📄</FileIcon>
                )
              ) : file.isJson ? (
                file.isSymlink ? (
                  <SymlinkIcon title="Symbolic Link to JSON File">🔗📋</SymlinkIcon>
                ) : (
                  <FileIcon style={{ color: 'var(--json-icon-color)' }}>📋</FileIcon>
                )
              ) : (
                file.isSymlink ? (
                  <SymlinkIcon title="Symbolic Link to File">🔗</SymlinkIcon>
                ) : (
                  <FileIcon>📄</FileIcon>
                )
              )}
              <FileName>{file.name}</FileName>
            </FileItemStyled>
          ))}
        </FileList>
      )}
    </FileBrowserContainer>
  );
};

export default FileBrowser;