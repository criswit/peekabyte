import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

const MermaidContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  overflow: auto;
  background-color: ${props => props.theme.colors.codeBackground};
  border-radius: 6px;
  padding: 20px;
  
  svg {
    max-width: 100%;
    height: auto;
  }
`;

const ErrorContainer = styled.div`
  color: ${props => props.theme.colors.error};
  font-family: monospace;
  font-size: 14px;
  padding: 10px;
  background-color: ${props => props.theme.colors.codeBackground};
  border-radius: 4px;
  margin: 10px 0;
`;

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { themeName } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const loadAndRenderMermaid = async () => {
      try {
        // Dynamic import to reduce initial bundle size
        const mermaid = (await import('mermaid')).default;
        
        // Configure mermaid based on theme
        const isDark = themeName === 'dark' || themeName === 'monokai' || 
                       themeName === 'dracula' || themeName === 'synthwave';
        
        mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      themeVariables: {
        darkMode: isDark,
        background: 'transparent',
        primaryColor: isDark ? '#bb86fc' : '#f4511e',
        primaryTextColor: isDark ? '#fff' : '#000',
        primaryBorderColor: isDark ? '#6200ee' : '#ff6e40',
        lineColor: isDark ? '#bb86fc' : '#ff6e40',
        secondaryColor: isDark ? '#03dac6' : '#018786',
        tertiaryColor: isDark ? '#3700b3' : '#6200ee',
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      },
      securityLevel: 'loose',
        });

        // Render the diagram
        setError(null);
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('Mermaid error:', err);
        setError((err as Error).message);
      }
    };

    loadAndRenderMermaid();
  }, [chart, themeName]);

  if (error) {
    return (
      <ErrorContainer>
        <strong>Mermaid Error:</strong> {error}
      </ErrorContainer>
    );
  }

  return <MermaidContainer ref={containerRef} />;
};

export default MermaidDiagram;