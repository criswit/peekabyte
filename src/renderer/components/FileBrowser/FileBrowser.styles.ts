import styled from 'styled-components';

export const FileBrowserContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.sidebarBackground};
  border-right: 1px solid ${props => props.theme.colors.sidebarBorder};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export const DirectoryHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid ${props => props.theme.colors.sidebarBorder};
`;

export const CurrentPath = styled.div`
  font-size: 0.9em;
  color: ${props => props.theme.colors.sidebarForeground};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.sidebarForeground};
  cursor: pointer;
  padding: 5px;
  margin-right: 5px;
  
  &:hover {
    color: ${props => props.theme.colors.foreground};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FavoriteButton = styled.button<{ $isFavorite: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$isFavorite ? props.theme.colors.error : props.theme.colors.sidebarForeground};
  cursor: pointer;
  padding: 5px;
  margin-left: 5px;
  font-size: 1.2em;
  
  &:hover {
    color: ${props => props.$isFavorite ? props.theme.colors.error : props.theme.colors.foreground};
  }
`;

export const FileList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
`;

export const FileItem = styled.li<{ $selected?: boolean }>`
  padding: 8px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: ${props => props.theme.colors.fileHover};
  }
  
  ${props => props.$selected && `
    background-color: ${props.theme.colors.fileSelected};
  `}
`;

export const FolderIcon = styled.span`
  margin-right: 8px;
  color: ${props => props.theme.colors.folderIcon};
`;

export const SymlinkIcon = styled.span`
  margin-right: 8px;
  color: ${props => props.theme.colors.info};
`;

export const FileIcon = styled.span<{ $isMarkdown?: boolean }>`
  margin-right: 8px;
  color: ${props => props.$isMarkdown ? props.theme.colors.markdownIcon : props.theme.colors.fileIcon};
`;

export const FileName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FavoritesSection = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.sidebarBorder};
`;

export const FavoritesHeader = styled.div`
  padding: 10px;
  font-size: 0.9em;
  color: ${props => props.theme.colors.sidebarForeground};
  background-color: ${props => props.theme.colors.fileHover};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FavoritesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 150px;
  overflow-y: auto;
`;

export const FavoriteItem = styled.li`
  padding: 8px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: ${props => props.theme.colors.fileHover};
  }
`;

export const RemoveFavoriteButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.fileIcon};
  cursor: pointer;
  margin-left: auto;
  padding: 2px 5px;
  
  &:hover {
    color: ${props => props.theme.colors.error};
  }
`;

export const OpenFolderButton = styled.button`
  margin: 10px;
  padding: 8px 16px;
  background-color: ${props => props.theme.colors.buttonBackground};
  color: ${props => props.theme.colors.buttonForeground};
  border: 1px solid ${props => props.theme.colors.buttonBorder};
  border-radius: 4px;
  cursor: pointer;
  width: calc(100% - 20px);
  
  &:hover {
    background-color: ${props => props.theme.colors.buttonHover};
  }
`;

export const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background-color: ${props => props.theme.colors.fileHover};
  border-bottom: 1px solid ${props => props.theme.colors.sidebarBorder};
`;

export const ToolbarButton = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.theme.colors.sidebarForeground};
  cursor: pointer;
  font-size: 0.8em;
  padding: 3px 6px;
  border-radius: 3px;
  margin-left: 5px;
  
  &:hover {
    background-color: ${props => props.theme.colors.fileSelected};
  }
  
  ${props => props.$active && `
    background-color: ${props.theme.colors.fileSelected};
    color: ${props.theme.colors.foreground};
  `}
`;

export const RefreshButton = styled(ToolbarButton)`
  color: ${props => props.theme.colors.success};
  
  &:hover {
    color: ${props => props.theme.colors.success};
    opacity: 0.8;
  }
`;