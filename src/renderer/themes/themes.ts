import { Theme, ThemeName } from './types';

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    // Base colors
    background: '#282c34',
    foreground: '#e6e6e6',
    border: '#444',
    
    // UI elements
    headerBackground: '#2c313a',
    headerForeground: '#e6e6e6',
    sidebarBackground: '#1e1e1e',
    sidebarForeground: '#ccc',
    sidebarBorder: '#333',
    
    // Interactive elements
    buttonBackground: 'transparent',
    buttonForeground: '#ccc',
    buttonHover: '#333',
    buttonBorder: '#555',
    
    // File browser
    fileHover: '#2a2a2a',
    fileSelected: '#3a3a3a',
    folderIcon: '#e8d44d',
    fileIcon: '#aaa',
    markdownIcon: '#42a5f5',
    jsonIcon: '#ffa500',
    
    // Editor/Viewer
    codeBackground: '#2d323b',
    codeForeground: '#e6e6e6',
    linkColor: '#58a6ff',
    linkHover: '#79b8ff',
    blockquoteBorder: '#5a6377',
    blockquoteBackground: 'transparent',
    tableBorder: '#5a6377',
    tableHeaderBackground: '#2d323b',
    tableRowEven: '#2d323b',
    
    // Search/Find
    searchHighlight: '#ffeb3b',
    searchHighlightCurrent: '#ff8c00',
    searchInputBackground: '#2d323b',
    searchInputForeground: '#ffffff',
    
    // Status
    error: '#ff6b6b',
    success: '#4caf50',
    warning: '#ff9800',
    info: '#2196f3',
    
    // Scrollbar
    scrollbarThumb: '#555',
    scrollbarTrack: '#2a2a2a',
  },
  syntaxTheme: 'vscDarkPlus'
};

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    // Base colors
    background: '#ffffff',
    foreground: '#24292e',
    border: '#e1e4e8',
    
    // UI elements
    headerBackground: '#f6f8fa',
    headerForeground: '#24292e',
    sidebarBackground: '#fafbfc',
    sidebarForeground: '#24292e',
    sidebarBorder: '#e1e4e8',
    
    // Interactive elements
    buttonBackground: '#fafbfc',
    buttonForeground: '#24292e',
    buttonHover: '#f3f4f6',
    buttonBorder: '#d1d5db',
    
    // File browser
    fileHover: '#f6f8fa',
    fileSelected: '#e1e4e8',
    folderIcon: '#79b8ff',
    fileIcon: '#6a737d',
    markdownIcon: '#0366d6',
    jsonIcon: '#f9c513',
    
    // Editor/Viewer
    codeBackground: '#f6f8fa',
    codeForeground: '#24292e',
    linkColor: '#0366d6',
    linkHover: '#0056b3',
    blockquoteBorder: '#dfe2e5',
    blockquoteBackground: '#f6f8fa',
    tableBorder: '#dfe2e5',
    tableHeaderBackground: '#f6f8fa',
    tableRowEven: '#f6f8fa',
    
    // Search/Find
    searchHighlight: '#fff3cd',
    searchHighlightCurrent: '#ffc107',
    searchInputBackground: '#ffffff',
    searchInputForeground: '#24292e',
    
    // Status
    error: '#d73a49',
    success: '#28a745',
    warning: '#f9c513',
    info: '#0366d6',
    
    // Scrollbar
    scrollbarThumb: '#d1d5db',
    scrollbarTrack: '#f3f4f6',
  },
  syntaxTheme: 'prism'
};

export const synthwaveTheme: Theme = {
  name: 'synthwave',
  colors: {
    // Base colors
    background: '#262335',
    foreground: '#f92aad',
    border: '#495495',
    
    // UI elements
    headerBackground: '#241b2f',
    headerForeground: '#ff6ac1',
    sidebarBackground: '#1a1626',
    sidebarForeground: '#ff6ac1',
    sidebarBorder: '#495495',
    
    // Interactive elements
    buttonBackground: 'rgba(255, 106, 193, 0.1)',
    buttonForeground: '#ff6ac1',
    buttonHover: 'rgba(255, 106, 193, 0.2)',
    buttonBorder: '#ff6ac1',
    
    // File browser
    fileHover: 'rgba(255, 106, 193, 0.1)',
    fileSelected: 'rgba(255, 106, 193, 0.2)',
    folderIcon: '#72f1b8',
    fileIcon: '#b893ce',
    markdownIcon: '#00eeff',
    jsonIcon: '#ff6ac1',
    
    // Editor/Viewer
    codeBackground: '#241b2f',
    codeForeground: '#ff6ac1',
    linkColor: '#00eeff',
    linkHover: '#72f1b8',
    blockquoteBorder: '#ff6ac1',
    blockquoteBackground: 'rgba(255, 106, 193, 0.1)',
    tableBorder: '#495495',
    tableHeaderBackground: '#241b2f',
    tableRowEven: 'rgba(255, 106, 193, 0.05)',
    
    // Search/Find
    searchHighlight: '#72f1b8',
    searchHighlightCurrent: '#ffee00',
    searchInputBackground: '#241b2f',
    searchInputForeground: '#ff6ac1',
    
    // Status
    error: '#ff3e3e',
    success: '#72f1b8',
    warning: '#ffee00',
    info: '#00eeff',
    
    // Scrollbar
    scrollbarThumb: '#ff6ac1',
    scrollbarTrack: '#241b2f',
  },
  syntaxTheme: 'synthwave84'
};

export const monokaiTheme: Theme = {
  name: 'monokai',
  colors: {
    // Base colors
    background: '#272822',
    foreground: '#f8f8f2',
    border: '#3e3d32',
    
    // UI elements
    headerBackground: '#1e1f1c',
    headerForeground: '#f8f8f2',
    sidebarBackground: '#1e1f1c',
    sidebarForeground: '#f8f8f2',
    sidebarBorder: '#3e3d32',
    
    // Interactive elements
    buttonBackground: '#3e3d32',
    buttonForeground: '#f8f8f2',
    buttonHover: '#524f3d',
    buttonBorder: '#75715e',
    
    // File browser
    fileHover: '#3e3d32',
    fileSelected: '#524f3d',
    folderIcon: '#a6e22e',
    fileIcon: '#75715e',
    markdownIcon: '#66d9ef',
    jsonIcon: '#e6db74',
    
    // Editor/Viewer
    codeBackground: '#3e3d32',
    codeForeground: '#f8f8f2',
    linkColor: '#66d9ef',
    linkHover: '#a6e22e',
    blockquoteBorder: '#75715e',
    blockquoteBackground: 'rgba(117, 113, 94, 0.2)',
    tableBorder: '#75715e',
    tableHeaderBackground: '#3e3d32',
    tableRowEven: '#3e3d32',
    
    // Search/Find
    searchHighlight: '#e6db74',
    searchHighlightCurrent: '#f92672',
    searchInputBackground: '#3e3d32',
    searchInputForeground: '#f8f8f2',
    
    // Status
    error: '#f92672',
    success: '#a6e22e',
    warning: '#e6db74',
    info: '#66d9ef',
    
    // Scrollbar
    scrollbarThumb: '#75715e',
    scrollbarTrack: '#3e3d32',
  },
  syntaxTheme: 'okaidia'
};

export const githubTheme: Theme = {
  name: 'github',
  colors: {
    // Base colors
    background: '#ffffff',
    foreground: '#24292f',
    border: '#d0d7de',
    
    // UI elements
    headerBackground: '#f6f8fa',
    headerForeground: '#24292f',
    sidebarBackground: '#ffffff',
    sidebarForeground: '#24292f',
    sidebarBorder: '#d0d7de',
    
    // Interactive elements
    buttonBackground: '#f6f8fa',
    buttonForeground: '#24292f',
    buttonHover: '#f3f4f6',
    buttonBorder: '#d0d7de',
    
    // File browser
    fileHover: '#f6f8fa',
    fileSelected: '#ddf4ff',
    folderIcon: '#54aeff',
    fileIcon: '#57606a',
    markdownIcon: '#0969da',
    jsonIcon: '#ec8e2c',
    
    // Editor/Viewer
    codeBackground: '#f6f8fa',
    codeForeground: '#24292f',
    linkColor: '#0969da',
    linkHover: '#0860ca',
    blockquoteBorder: '#d0d7de',
    blockquoteBackground: '#f6f8fa',
    tableBorder: '#d0d7de',
    tableHeaderBackground: '#f6f8fa',
    tableRowEven: '#f6f8fa',
    
    // Search/Find
    searchHighlight: '#fff8c5',
    searchHighlightCurrent: '#fb8500',
    searchInputBackground: '#f6f8fa',
    searchInputForeground: '#24292f',
    
    // Status
    error: '#cf222e',
    success: '#1a7f37',
    warning: '#9a6700',
    info: '#0969da',
    
    // Scrollbar
    scrollbarThumb: '#d0d7de',
    scrollbarTrack: '#f6f8fa',
  },
  syntaxTheme: 'ghcolors'
};

export const draculaTheme: Theme = {
  name: 'dracula',
  colors: {
    // Base colors
    background: '#282a36',
    foreground: '#f8f8f2',
    border: '#44475a',
    
    // UI elements
    headerBackground: '#21222c',
    headerForeground: '#f8f8f2',
    sidebarBackground: '#21222c',
    sidebarForeground: '#f8f8f2',
    sidebarBorder: '#44475a',
    
    // Interactive elements
    buttonBackground: '#44475a',
    buttonForeground: '#f8f8f2',
    buttonHover: '#6272a4',
    buttonBorder: '#6272a4',
    
    // File browser
    fileHover: '#44475a',
    fileSelected: '#6272a4',
    folderIcon: '#f1fa8c',
    fileIcon: '#6272a4',
    markdownIcon: '#8be9fd',
    jsonIcon: '#ffb86c',
    
    // Editor/Viewer
    codeBackground: '#44475a',
    codeForeground: '#f8f8f2',
    linkColor: '#8be9fd',
    linkHover: '#80ffea',
    blockquoteBorder: '#6272a4',
    blockquoteBackground: 'rgba(98, 114, 164, 0.1)',
    tableBorder: '#6272a4',
    tableHeaderBackground: '#44475a',
    tableRowEven: '#44475a',
    
    // Search/Find
    searchHighlight: '#f1fa8c',
    searchHighlightCurrent: '#ff79c6',
    searchInputBackground: '#44475a',
    searchInputForeground: '#f8f8f2',
    
    // Status
    error: '#ff5555',
    success: '#50fa7b',
    warning: '#ffb86c',
    info: '#8be9fd',
    
    // Scrollbar
    scrollbarThumb: '#6272a4',
    scrollbarTrack: '#44475a',
  },
  syntaxTheme: 'dracula'
};

export const themes: Record<ThemeName, Theme> = {
  dark: darkTheme,
  light: lightTheme,
  synthwave: synthwaveTheme,
  monokai: monokaiTheme,
  github: githubTheme,
  dracula: draculaTheme,
};