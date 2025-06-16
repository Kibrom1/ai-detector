import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPaste } from '@fortawesome/free-solid-svg-icons';

function TextAnalysis({ content, onContentChange }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (content) {
      const textStats = {
        wordCount: content.trim().split(/\s+/).filter(Boolean).length,
        characterCount: content.length,
        lineCount: content.split('\n').length
      };
      setStats(textStats);
    } else {
      setStats(null);
    }
  }, [content]);

  const handleClear = () => {
    onContentChange('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onContentChange(text);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  return (
    <div className="input-area" data-testid="text-analysis">
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Enter or paste your text here..."
        data-testid="text-input"
      />
      <div className="input-actions">
        <button 
          className="action-btn" 
          onClick={handleClear}
          data-testid="clear-button"
        >
          <FontAwesomeIcon icon={faTrash} />
          Clear
        </button>
        <button 
          className="action-btn" 
          onClick={handlePaste}
          data-testid="paste-button"
        >
          <FontAwesomeIcon icon={faPaste} />
          Paste
        </button>
      </div>
      {stats && (
        <div className="stats-display" data-testid="stats-display">
          <div className="stat-item" data-testid="word-count">{stats.wordCount} words</div>
          <div className="stat-item" data-testid="char-count">{stats.characterCount} characters</div>
          <div className="stat-item" data-testid="line-count">{stats.lineCount} lines</div>
        </div>
      )}
    </div>
  );
}

export default TextAnalysis; 