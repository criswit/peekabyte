import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.muted};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 16px;
`;

const Message = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.mutedForeground};
  text-align: center;
`;

const ProgressBar = styled.div<{ $progress?: number }>`
  width: 200px;
  height: 4px;
  background-color: ${props => props.theme.colors.muted};
  border-radius: 2px;
  margin-top: 12px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.$progress || 0}%;
    background-color: ${props => props.theme.colors.primary};
    border-radius: 2px;
    transition: width 0.3s ease;
  }
`;

const Details = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: ${props => props.theme.colors.mutedForeground};
  text-align: center;
`;

interface LoadingSpinnerProps {
  message?: string;
  progress?: number;
  details?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  progress,
  details,
}) => {
  return (
    <Container>
      <Spinner />
      <Message>{message}</Message>
      {progress !== undefined && <ProgressBar $progress={progress} />}
      {details && <Details>{details}</Details>}
    </Container>
  );
};

export default LoadingSpinner;
