import { useCallback } from 'react';

export const useAnalyzer = () => {
  const analyzeText = useCallback((text) => {
    if (!text) return null;

    const words = text.trim().split(/\s+/);
    const characters = text.length;
    const lines = text.split('\n').length;

    return {
      wordCount: words.length,
      characterCount: characters,
      lineCount: lines
    };
  }, []);

  const analyzeCode = useCallback((code) => {
    if (!code) return null;

    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0).length;
    const characters = code.length;

    return {
      totalLines: lines.length,
      nonEmptyLines,
      characterCount: characters
    };
  }, []);

  const analyzeContent = useCallback(async (content, type) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock analysis results
    const score = Math.floor(Math.random() * 100);
    const patterns = [
      {
        name: 'Pattern 1',
        description: 'Description of pattern 1',
        severity: score > 70 ? 'high' : score > 40 ? 'medium' : 'low'
      },
      {
        name: 'Pattern 2',
        description: 'Description of pattern 2',
        severity: score > 70 ? 'high' : score > 40 ? 'medium' : 'low'
      }
    ];

    const recommendations = score > 70 ? [
      'Consider adding more human-like variations',
      'Include more personal experiences',
      'Add more context-specific details'
    ] : null;

    return {
      type,
      score,
      patterns,
      recommendations
    };
  }, []);

  return {
    analyzeText,
    analyzeCode,
    analyzeContent
  };
}; 