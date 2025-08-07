import React from 'react';
import styled from 'styled-components';
import { SelectedFile } from '@shared/types';

interface PDFViewerProps {
  selectedFile: SelectedFile;
}

const ViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.colors.background};
`;

const PDFEmbed = styled.embed`
  flex: 1;
  width: 100%;
  border: none;
  background-color: ${props => props.theme.colors.background};
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.destructive};
  font-size: 16px;
  text-align: center;
  gap: 10px;
`;

const InfoMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.muted};
  font-size: 14px;
  text-align: center;
  gap: 15px;
`;

const DownloadButton = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primaryForeground};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const PDFViewer: React.FC<PDFViewerProps> = ({ selectedFile }) => {
  if (selectedFile.error) {
    return (
      <ViewerContainer>
        <ErrorMessage>
          <div>Error loading PDF:</div>
          <div>{selectedFile.error}</div>
        </ErrorMessage>
      </ViewerContainer>
    );
  }

  const handleDownload = () => {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(selectedFile.content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  // Create data URL for PDF
  const pdfDataUrl = `data:application/pdf;base64,${selectedFile.content}`;

  return (
    <ViewerContainer>
      <InfoMessage>
        <div>
          <strong>{selectedFile.name}</strong>
        </div>
        <div>
          PDF files are displayed using your browser&apos;s built-in PDF viewer.
          <br />
          If the PDF doesn&apos;t display properly, you can download it to view
          in an external application.
        </div>
        <DownloadButton onClick={handleDownload}>Download PDF</DownloadButton>
      </InfoMessage>
      <PDFEmbed
        src={pdfDataUrl}
        type='application/pdf'
        title={selectedFile.name}
      />
    </ViewerContainer>
  );
};

export default PDFViewer;
