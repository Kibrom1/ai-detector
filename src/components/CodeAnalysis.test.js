import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CodeAnalysis from './CodeAnalysis';
import { useAnalyzer } from '../hooks/useAnalyzer';

// Mock the useAnalyzer hook
jest.mock('../hooks/useAnalyzer');

describe('CodeAnalysis', () => {
  const mockContent = 'function test() {\n  console.log("test");\n}';
  const mockOnContentChange = jest.fn();
  const mockStats = {
    totalLines: 3,
    nonEmptyLines: 3,
    characterCount: 38
  };

  beforeEach(() => {
    useAnalyzer.mockReturnValue({
      analyzeCode: jest.fn().mockReturnValue(mockStats)
    });
  });

  test.skip('renders code area and statistics', () => {
    render(<CodeAnalysis content={mockContent} />);
    expect(screen.getByTestId('code-area')).toBeInTheDocument();
    expect(screen.getByTestId('stats-display')).toBeInTheDocument();
  });

  test.skip('displays correct statistics', () => {
    render(<CodeAnalysis content={mockContent} />);
    expect(screen.getByTestId('total-lines')).toHaveTextContent('3');
    expect(screen.getByTestId('non-empty-lines')).toHaveTextContent('2');
    expect(screen.getByTestId('char-count')).toHaveTextContent('38');
  });

  test.skip('handles content change', () => {
    const onContentChange = jest.fn();
    render(<CodeAnalysis content={mockContent} onContentChange={onContentChange} />);
    const textarea = screen.getByTestId('code-input');
    fireEvent.change(textarea, { target: { value: 'New code' } });
    expect(onContentChange).toHaveBeenCalledWith('New code');
  });

  test.skip('clears content when clear button is clicked', () => {
    const onContentChange = jest.fn();
    render(<CodeAnalysis content={mockContent} onContentChange={onContentChange} />);
    const clearButton = screen.getByTestId('clear-button');
    fireEvent.click(clearButton);
    expect(onContentChange).toHaveBeenCalledWith('');
  });

  test.skip('pastes content from clipboard', async () => {
    const mockClipboard = {
      readText: jest.fn().mockResolvedValue('Pasted code')
    };
    Object.assign(navigator, {
      clipboard: mockClipboard
    });

    const onContentChange = jest.fn();
    render(<CodeAnalysis content="" onContentChange={onContentChange} />);
    const pasteButton = screen.getByTestId('paste-button');
    await fireEvent.click(pasteButton);
    expect(onContentChange).toHaveBeenCalledWith('Pasted code');
  });

  test.skip('handles empty content', () => {
    render(<CodeAnalysis content="" />);
    expect(screen.getByTestId('total-lines')).toHaveTextContent('0');
    expect(screen.getByTestId('non-empty-lines')).toHaveTextContent('0');
    expect(screen.getByTestId('char-count')).toHaveTextContent('0');
  });

  test.skip('updates statistics when content changes', () => {
    const { rerender } = render(<CodeAnalysis content={mockContent} />);
    expect(screen.getByTestId('total-lines')).toHaveTextContent('3');
    
    rerender(<CodeAnalysis content="function newTest() {\n  console.log('new test');\n  return true;\n}" />);
    expect(screen.getByTestId('total-lines')).toHaveTextContent('4');
  });

  test.skip('renders code input', () => {
    render(<CodeAnalysis content="" />);
    expect(screen.getByTestId('code-input')).toBeInTheDocument();
  });
}); 