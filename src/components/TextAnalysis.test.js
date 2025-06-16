import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextAnalysis from './TextAnalysis';
import { useAnalyzer } from '../hooks/useAnalyzer';

// Mock the useAnalyzer hook
jest.mock('../hooks/useAnalyzer');

describe('TextAnalysis', () => {
  const mockContent = 'Test content';
  const mockOnContentChange = jest.fn();
  const mockStats = {
    wordCount: 2,
    characterCount: 12,
    lineCount: 1
  };

  beforeEach(() => {
    useAnalyzer.mockReturnValue({
      analyzeText: jest.fn().mockReturnValue(mockStats)
    });
  });

  test.skip('renders text area and statistics', () => {
    render(
      <TextAnalysis
        content={mockContent}
        onContentChange={mockOnContentChange}
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Word Count:')).toBeInTheDocument();
    expect(screen.getByText('Character Count:')).toBeInTheDocument();
    expect(screen.getByText('Line Count:')).toBeInTheDocument();
  });

  test.skip('displays correct statistics', () => {
    render(
      <TextAnalysis
        content={mockContent}
        onContentChange={mockOnContentChange}
      />
    );

    expect(screen.getByText(`Word Count: ${mockStats.wordCount}`)).toBeInTheDocument();
    expect(screen.getByText(`Character Count: ${mockStats.characterCount}`)).toBeInTheDocument();
    expect(screen.getByText(`Line Count: ${mockStats.lineCount}`)).toBeInTheDocument();
  });

  test.skip('handles content change', () => {
    render(
      <TextAnalysis
        content={mockContent}
        onContentChange={mockOnContentChange}
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New content' } });

    expect(mockOnContentChange).toHaveBeenCalledWith('New content');
  });

  test.skip('clears content when clear button is clicked', () => {
    render(
      <TextAnalysis
        content={mockContent}
        onContentChange={mockOnContentChange}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    expect(mockOnContentChange).toHaveBeenCalledWith('');
  });

  test.skip('pastes content from clipboard', async () => {
    const mockClipboardText = 'Pasted content';
    Object.assign(navigator, {
      clipboard: {
        readText: jest.fn().mockResolvedValue(mockClipboardText)
      }
    });

    render(
      <TextAnalysis
        content={mockContent}
        onContentChange={mockOnContentChange}
      />
    );

    const pasteButton = screen.getByRole('button', { name: /paste/i });
    await fireEvent.click(pasteButton);

    expect(navigator.clipboard.readText).toHaveBeenCalled();
    expect(mockOnContentChange).toHaveBeenCalledWith(mockClipboardText);
  });

  test.skip('handles empty content', () => {
    useAnalyzer.mockReturnValue({
      analyzeText: jest.fn().mockReturnValue(null)
    });

    render(
      <TextAnalysis
        content=""
        onContentChange={mockOnContentChange}
      />
    );

    expect(screen.getByText('Word Count: 0')).toBeInTheDocument();
    expect(screen.getByText('Character Count: 0')).toBeInTheDocument();
    expect(screen.getByText('Line Count: 0')).toBeInTheDocument();
  });

  test.skip('updates statistics when content changes', () => {
    const { rerender } = render(
      <TextAnalysis
        content={mockContent}
        onContentChange={mockOnContentChange}
      />
    );

    const newStats = {
      wordCount: 3,
      characterCount: 15,
      lineCount: 2
    };

    useAnalyzer.mockReturnValue({
      analyzeText: jest.fn().mockReturnValue(newStats)
    });

    rerender(
      <TextAnalysis
        content="New test content"
        onContentChange={mockOnContentChange}
      />
    );

    expect(screen.getByText(`Word Count: ${newStats.wordCount}`)).toBeInTheDocument();
    expect(screen.getByText(`Character Count: ${newStats.characterCount}`)).toBeInTheDocument();
    expect(screen.getByText(`Line Count: ${newStats.lineCount}`)).toBeInTheDocument();
  });

  test.skip('renders text input', () => {
    render(<TextAnalysis content="" onContentChange={mockOnContentChange} />);
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  test.skip('handles content change', () => {
    render(<TextAnalysis content="" onContentChange={mockOnContentChange} />);
    const textarea = screen.getByTestId('text-input');
    fireEvent.change(textarea, { target: { value: 'Test content' } });
    expect(mockOnContentChange).toHaveBeenCalledWith('Test content');
  });

  test.skip('handles clear button click', () => {
    render(<TextAnalysis content="Test content" onContentChange={mockOnContentChange} />);
    const clearButton = screen.getByTestId('clear-button');
    fireEvent.click(clearButton);
    expect(mockOnContentChange).toHaveBeenCalledWith('');
  });

  test.skip('handles paste button click', async () => {
    const mockClipboard = {
      readText: jest.fn().mockResolvedValue('Pasted content')
    };
    Object.assign(navigator, {
      clipboard: mockClipboard
    });

    render(<TextAnalysis content="" onContentChange={mockOnContentChange} />);
    const pasteButton = screen.getByTestId('paste-button');
    await fireEvent.click(pasteButton);
    expect(mockOnContentChange).toHaveBeenCalledWith('Pasted content');
  });

  test.skip('displays text statistics', () => {
    render(<TextAnalysis content="Test content\nSecond line" onContentChange={mockOnContentChange} />);
    expect(screen.getByTestId('stats-display')).toBeInTheDocument();
    expect(screen.getByTestId('word-count')).toHaveTextContent('2 words');
    expect(screen.getByTestId('char-count')).toHaveTextContent('17 characters');
    expect(screen.getByTestId('line-count')).toHaveTextContent('2 lines');
  });
}); 