import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPaste } from '@fortawesome/free-solid-svg-icons';

function CodeAnalysis({ content, onContentChange }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (content) {
      const lines = content.split('\n');
      const codeStats = {
        totalLines: lines.length,
        nonEmptyLines: lines.filter(line => line.trim().length > 0).length,
        characterCount: content.length
      };
      setStats(codeStats);
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
    <div className="input-area" data-testid="code-analysis">
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Enter or paste your code here..."
        className="code-input"
        data-testid="code-input"
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
          <div className="stat-item" data-testid="total-lines">{stats.totalLines} total lines</div>
          <div className="stat-item" data-testid="non-empty-lines">{stats.nonEmptyLines} non-empty lines</div>
          <div className="stat-item" data-testid="char-count">{stats.characterCount} characters</div>
        </div>
      )}
    </div>
  );
}

export default CodeAnalysis; 