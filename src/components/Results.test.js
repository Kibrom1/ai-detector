import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Results from './Results';

describe('Results', () => {
  const mockResults = {
    type: 'text',
    score: 75,
    patterns: [
      {
        name: 'Pattern 1',
        description: 'Description 1',
        severity: 'high'
      },
      {
        name: 'Pattern 2',
        description: 'Description 2',
        severity: 'medium'
      }
    ],
    recommendations: [
      'Recommendation 1',
      'Recommendation 2'
    ]
  };

  test.skip('renders results section', () => {
    render(<Results results={mockResults} />);
    expect(screen.getByTestId('results-section')).toBeInTheDocument();
  });

  test.skip('displays correct score class based on score', () => {
    const { rerender } = render(<Results results={mockResults} />);
    expect(screen.getByTestId('score-display')).toHaveClass('high');

    rerender(<Results results={{ ...mockResults, score: 45 }} />);
    expect(screen.getByTestId('score-display')).toHaveClass('medium');

    rerender(<Results results={{ ...mockResults, score: 25 }} />);
    expect(screen.getByTestId('score-display')).toHaveClass('low');
  });

  test.skip('displays patterns with correct severity classes', () => {
    render(<Results results={mockResults} />);
    const patterns = screen.getAllByTestId(/pattern-/);
    expect(patterns[0]).toHaveClass('high');
    expect(patterns[1]).toHaveClass('medium');
  });

  test.skip('displays recommendations for high scores', () => {
    render(<Results results={mockResults} />);
    expect(screen.getByTestId('recommendations')).toBeInTheDocument();
    expect(screen.getByText('Recommendation 1')).toBeInTheDocument();
    expect(screen.getByText('Recommendation 2')).toBeInTheDocument();
  });

  test.skip('does not display recommendations for low scores', () => {
    render(<Results results={{ ...mockResults, score: 25 }} />);
    expect(screen.queryByTestId('recommendations')).not.toBeInTheDocument();
  });

  test.skip('handles download as JSON', () => {
    render(<Results results={mockResults} />);
    const downloadButton = screen.getByTestId('download-json');
    fireEvent.click(downloadButton);
    // Add assertions for download functionality
  });

  test.skip('handles download as text', () => {
    render(<Results results={mockResults} />);
    const downloadButton = screen.getByTestId('download-text');
    fireEvent.click(downloadButton);
    // Add assertions for download functionality
  });

  test.skip('handles share results', async () => {
    const mockShare = jest.fn();
    Object.assign(navigator, {
      share: mockShare
    });

    render(<Results results={mockResults} />);
    const shareButton = screen.getByTestId('share-button');
    await fireEvent.click(shareButton);
    expect(mockShare).toHaveBeenCalled();
  });

  test.skip('handles empty results', () => {
    render(<Results results={null} />);
    expect(screen.getByTestId('no-results')).toBeInTheDocument();
  });

  test.skip('handles error state', () => {
    render(<Results error="Analysis failed" />);
    expect(screen.getByTestId('error-message')).toHaveTextContent('Analysis failed');
  });

  test.skip('formats results as text correctly', () => {
    render(<Results results={mockResults} />);
    const formattedText = screen.getByTestId('formatted-text');
    expect(formattedText).toHaveTextContent('Score: 75%');
    expect(formattedText).toHaveTextContent('Pattern 1');
    expect(formattedText).toHaveTextContent('Pattern 2');
  });
}); 