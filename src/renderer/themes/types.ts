export interface Theme {
  name: string;
  colors: {
    // Base colors
    background: string;
    foreground: string;
    border: string;

    // UI elements
    headerBackground: string;
    headerForeground: string;
    sidebarBackground: string;
    sidebarForeground: string;
    sidebarBorder: string;

    // Interactive elements
    buttonBackground: string;
    buttonForeground: string;
    buttonHover: string;
    buttonBorder: string;

    // File browser
    fileHover: string;
    fileSelected: string;
    folderIcon: string;
    fileIcon: string;
    markdownIcon: string;
    jsonIcon: string;

    // Editor/Viewer
    codeBackground: string;
    codeForeground: string;
    linkColor: string;
    linkHover: string;
    blockquoteBorder: string;
    blockquoteBackground: string;
    tableBorder: string;
    tableHeaderBackground: string;
    tableRowEven: string;

    // Search/Find
    searchHighlight: string;
    searchHighlightCurrent: string;
    searchInputBackground: string;
    searchInputForeground: string;

    // Status
    error: string;
    success: string;
    warning: string;
    info: string;

    // Scrollbar
    scrollbarThumb: string;
    scrollbarTrack: string;
  };

  // Syntax highlighting for code blocks
  syntaxTheme?: string; // Name of the prism theme to use
}

export type ThemeName =
  | 'dark'
  | 'light'
  | 'synthwave'
  | 'monokai'
  | 'github'
  | 'dracula';
