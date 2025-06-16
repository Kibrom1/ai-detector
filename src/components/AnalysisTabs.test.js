import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AnalysisTabs from './AnalysisTabs';
import { useAnalyzer } from '../hooks/useAnalyzer';

// Mock the useAnalyzer hook
jest.mock('../hooks/useAnalyzer');

describe('AnalysisTabs', () => {
  const mockProps = {
    activeTab: 'text',
    onTabChange: jest.fn(),
    onContentChange: jest.fn(),
    onFileSelect: jest.fn(),
    onAnalyze: jest.fn(),
    isLoading: false,
    error: null
  };

  beforeEach(() => {
    useAnalyzer.mockReturnValue({
      analyzeContent: jest.fn().mockResolvedValue({
        type: 'text',
        score: 75,
        patterns: [],
        recommendations: []
      })
    });
  });

  test.skip('renders tab buttons', () => {
    render(<AnalysisTabs {...mockProps} />);
    expect(screen.getByTestId('text-tab')).toBeInTheDocument();
    expect(screen.getByTestId('code-tab')).toBeInTheDocument();
    expect(screen.getByTestId('file-tab')).toBeInTheDocument();
  });

  test.skip('shows text analysis tab by default', () => {
    render(<AnalysisTabs {...mockProps} />);
    expect(screen.getByTestId('text-analysis')).toBeInTheDocument();
  });

  test.skip('switches to code analysis tab', () => {
    render(<AnalysisTabs {...mockProps} />);
    const codeTab = screen.getByTestId('code-tab');
    fireEvent.click(codeTab);
    expect(mockProps.onTabChange).toHaveBeenCalledWith('code');
  });

  test.skip('switches to file upload tab', () => {
    render(<AnalysisTabs {...mockProps} />);
    const fileTab = screen.getByTestId('file-tab');
    fireEvent.click(fileTab);
    expect(mockProps.onTabChange).toHaveBeenCalledWith('file');
  });

  test.skip('handles tab change', () => {
    render(<AnalysisTabs {...mockProps} />);
    const codeTab = screen.getByTestId('code-tab');
    fireEvent.click(codeTab);
    expect(mockProps.onTabChange).toHaveBeenCalledWith('code');
  });

  test.skip('handles content change', () => {
    render(<AnalysisTabs {...mockProps} />);
    const textarea = screen.getByTestId('text-input');
    fireEvent.change(textarea, { target: { value: 'Test content' } });
    expect(mockProps.onContentChange).toHaveBeenCalledWith('Test content');
  });

  test.skip('handles file selection', () => {
    render(<AnalysisTabs {...mockProps} />);
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockProps.onFileSelect).toHaveBeenCalledWith(file);
  });

  test.skip('handles analyze button click', () => {
    render(<AnalysisTabs {...mockProps} content="Test content" />);
    const analyzeButton = screen.getByTestId('analyze-button');
    fireEvent.click(analyzeButton);
    expect(mockProps.onAnalyze).toHaveBeenCalled();
  });

  test.skip('disables analyze button when no content', () => {
    render(<AnalysisTabs {...mockProps} content="" />);
    const analyzeButton = screen.getByTestId('analyze-button');
    expect(analyzeButton).toBeDisabled();
  });

  test.skip('shows loading state', () => {
    render(<AnalysisTabs {...mockProps} isLoading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test.skip('maintains content when switching tabs', () => {
    const { rerender } = render(<AnalysisTabs {...mockProps} content="Test content" />);
    expect(screen.getByTestId('text-input')).toHaveValue('Test content');
    
    rerender(<AnalysisTabs {...mockProps} activeTab="code" content="Test content" />);
    expect(screen.getByTestId('code-input')).toHaveValue('Test content');
  });
}); 