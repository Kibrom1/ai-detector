import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBolt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1>AI Content Analysis</h1>
        <p>Detect and analyze AI-generated content with advanced pattern recognition</p>
        <div className="stats">
          <div className="stat-item">
            <FontAwesomeIcon icon={faChartLine} />
            <span>95% Accuracy</span>
          </div>
          <div className="stat-item">
            <FontAwesomeIcon icon={faBolt} />
            <span>Real-time Analysis</span>
          </div>
          <div className="stat-item">
            <FontAwesomeIcon icon={faShieldAlt} />
            <span>Secure & Private</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 