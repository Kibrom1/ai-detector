import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faShare, faRobot, faCode, faFile } from '@fortawesome/free-solid-svg-icons';

function Results({ results, onDownload, onShare }) {
  const getScoreClass = (score) => {
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  const getIcon = (type) => {
    switch (type) {
      case 'text':
        return faRobot;
      case 'code':
        return faCode;
      case 'file':
        return faFile;
      default:
        return faRobot;
    }
  };

  if (!results) return null;

  return (
    <div className="results-section" data-testid="results-section">
      <div className="results-header">
        <h2>Analysis Results</h2>
        <div className="results-actions">
          <button 
            className="action-btn" 
            onClick={() => onDownload('json')}
            data-testid="download-json-btn"
          >
            <FontAwesomeIcon icon={faDownload} />
            Download JSON
          </button>
          <button 
            className="action-btn" 
            onClick={() => onDownload('text')}
            data-testid="download-text-btn"
          >
            <FontAwesomeIcon icon={faDownload} />
            Download Text
          </button>
          <button 
            className="action-btn" 
            onClick={onShare}
            data-testid="share-btn"
          >
            <FontAwesomeIcon icon={faShare} />
            Share
          </button>
        </div>
      </div>

      <div className="results-content">
        <div className="score-section">
          <div className={`score ${getScoreClass(results.score)}`} data-testid="score-display">
            <FontAwesomeIcon icon={getIcon(results.type)} />
            <span>{results.score}%</span>
          </div>
          <p className="score-label">AI Probability</p>
        </div>

        <div className="patterns-section">
          <h3>Pattern Analysis</h3>
          <ul className="patterns-list" data-testid="patterns-list">
            {results.patterns.map((pattern, index) => (
              <li key={index} className={pattern.severity}>
                <span className="pattern-name">{pattern.name}</span>
                <span className="pattern-description">{pattern.description}</span>
              </li>
            ))}
          </ul>
        </div>

        {results.recommendations && (
          <div className="recommendations-section">
            <h3>Recommendations</h3>
            <ul className="recommendations-list" data-testid="recommendations-list">
              {results.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results; 