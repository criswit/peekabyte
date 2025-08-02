import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSelectorContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ThemeButton = styled.button`
  background: ${props => props.theme.colors.buttonBackground};
  border: 1px solid ${props => props.theme.colors.buttonBorder};
  border-radius: 4px;
  color: ${props => props.theme.colors.buttonForeground};
  padding: 5px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  
  &:hover {
    background-color: ${props => props.theme.colors.buttonHover};
  }
`;

const ThemeDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  background: ${props => props.theme.colors.sidebarBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1000;
  min-width: 150px;
`;

const ThemeOption = styled.button<{ $isActive: boolean }>`
  display: block;
  width: 100%;
  padding: 8px 16px;
  background: ${props => props.$isActive ? props.theme.colors.fileSelected : 'transparent'};
  border: none;
  color: ${props => props.theme.colors.foreground};
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  
  &:hover {
    background: ${props => props.theme.colors.fileHover};
  }
  
  &:first-child {
    border-radius: 3px 3px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 3px 3px;
  }
`;

const ThemeIcon = styled.span`
  font-size: 16px;
`;

const themeEmojis: Record<string, string> = {
  dark: '🌙',
  light: '☀️',
  synthwave: '🌆',
  monokai: '🎨',
  github: '🐙',
  dracula: '🧛',
};

const ThemeSelector: React.FC = () => {
  const { themeName, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleThemeSelect = (theme: any) => {
    setTheme(theme);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('[data-theme-selector]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <ThemeSelectorContainer data-theme-selector>
      <ThemeButton onClick={() => setIsOpen(!isOpen)}>
        <ThemeIcon>{themeEmojis[themeName]}</ThemeIcon>
        Theme
      </ThemeButton>
      <ThemeDropdown $isOpen={isOpen}>
        {availableThemes.map(theme => (
          <ThemeOption
            key={theme}
            $isActive={theme === themeName}
            onClick={() => handleThemeSelect(theme)}
          >
            <ThemeIcon>{themeEmojis[theme]}</ThemeIcon> {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </ThemeOption>
        ))}
      </ThemeDropdown>
    </ThemeSelectorContainer>
  );
};

export default ThemeSelector;