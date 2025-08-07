import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { SelectedFile } from '@shared/types';

interface ImageViewerProps {
  selectedFile: SelectedFile;
}

const ViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.colors.background};
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 20px;
  background-color: ${props => props.theme.colors.background};
`;

const Image = styled.img<{ $zoom: number }>`
  max-width: none;
  max-height: none;
  transform: scale(${props => props.$zoom});
  transition: transform 0.2s ease;
  cursor: ${props => (props.$zoom === 1 ? 'zoom-in' : 'zoom-out')};
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background-color: ${props => props.theme.colors.surface};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ControlButton = styled.button`
  padding: 8px 16px;
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

  &:disabled {
    background-color: ${props => props.theme.colors.muted};
    cursor: not-allowed;
  }
`;

const ZoomInfo = styled.span`
  color: ${props => props.theme.colors.foreground};
  font-size: 14px;
  min-width: 60px;
  text-align: center;
`;

const ImageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: ${props => props.theme.colors.muted};
  font-size: 12px;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.destructive};
  font-size: 16px;
`;

const ImageViewer: React.FC<ImageViewerProps> = ({ selectedFile }) => {
  const [zoom, setZoom] = useState(1);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset zoom when file changes
  useEffect(() => {
    setZoom(1);
    setImageSize(null);
    setError(null);
  }, [selectedFile.path]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  };

  const handleImageError = () => {
    setError('Failed to load image');
  };

  const handleImageClick = () => {
    if (zoom === 1) {
      setZoom(2);
    } else {
      setZoom(1);
    }
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 5));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.1));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const fitToWindow = () => {
    if (imageRef.current && imageSize) {
      const container = imageRef.current.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const scaleX = (containerRect.width - 40) / imageSize.width;
        const scaleY = (containerRect.height - 40) / imageSize.height;
        const scale = Math.min(scaleX, scaleY, 1);
        setZoom(scale);
      }
    }
  };

  if (selectedFile.error || error) {
    return (
      <ViewerContainer>
        <ErrorMessage>{selectedFile.error || error}</ErrorMessage>
      </ViewerContainer>
    );
  }

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  const getMimeType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      default:
        return 'image/*';
    }
  };

  const imageDataUrl = `data:${getMimeType(selectedFile.name)};base64,${selectedFile.content}`;

  return (
    <ViewerContainer>
      <ImageContainer>
        <Image
          ref={imageRef}
          src={imageDataUrl}
          alt={selectedFile.name}
          $zoom={zoom}
          onClick={handleImageClick}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </ImageContainer>

      <Controls>
        <ControlButton onClick={zoomOut} disabled={zoom <= 0.1}>
          Zoom Out
        </ControlButton>

        <ZoomInfo>{Math.round(zoom * 100)}%</ZoomInfo>

        <ControlButton onClick={zoomIn} disabled={zoom >= 5}>
          Zoom In
        </ControlButton>

        <ControlButton onClick={resetZoom}>Reset</ControlButton>

        <ControlButton onClick={fitToWindow}>Fit to Window</ControlButton>

        {imageSize && (
          <ImageInfo>
            <span>{getFileExtension(selectedFile.name)}</span>
            <span>
              {imageSize.width} × {imageSize.height}
            </span>
            <span>
              {Math.round((selectedFile.content.length * 0.75) / 1024)} KB
            </span>
          </ImageInfo>
        )}
      </Controls>
    </ViewerContainer>
  );
};

export default ImageViewer;
