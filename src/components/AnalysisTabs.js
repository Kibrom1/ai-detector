import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faCode, faUpload, faSearch, faTrash, faPaste, faDownload, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import TextAnalysis from './TextAnalysis';
import CodeAnalysis from './CodeAnalysis';
import FileUpload from './FileUpload';
import Results from './Results';
import { useAnalyzer } from '../hooks/useAnalyzer';

function AnalysisTabs({
  activeTab,
  onTabChange,
  content,
  onContentChange,
  fileInfo,
  onFileSelect,
  isLoading,
  onAnalyze
}) {
  const { analyzeContent } = useAnalyzer();

  const handleAnalyze = async () => {
    if (!content) return;

    onAnalyze(true);
    try {
      const analysisResults = await analyzeContent(content, activeTab);
      onAnalyze(false, analysisResults);
    } catch (error) {
      console.error('Analysis error:', error);
      onAnalyze(false);
    }
  };

  return (
    <div className="analysis-container">
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => onTabChange('text')}
          data-testid="text-tab"
        >
          <FontAwesomeIcon icon={faFileAlt} />
          Text Analysis
        </button>
        <button 
          className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => onTabChange('code')}
          data-testid="code-tab"
        >
          <FontAwesomeIcon icon={faCode} />
          Code Analysis
        </button>
        <button 
          className={`tab-btn ${activeTab === 'file' ? 'active' : ''}`}
          onClick={() => onTabChange('file')}
          data-testid="file-tab"
        >
          <FontAwesomeIcon icon={faUpload} />
          File Upload
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'text' && (
          <TextAnalysis 
            content={content}
            onContentChange={onContentChange}
          />
        )}
        {activeTab === 'code' && (
          <CodeAnalysis 
            content={content}
            onContentChange={onContentChange}
          />
        )}
        {activeTab === 'file' && (
          <FileUpload 
            onFileSelect={onFileSelect}
            fileInfo={fileInfo}
          />
        )}
      </div>

      <button 
        className="analyze-btn"
        onClick={handleAnalyze}
        disabled={!content || isLoading}
        data-testid="analyze-button"
      >
        <FontAwesomeIcon icon={faSearch} />
        Analyze Content
      </button>

      {isLoading && (
        <div className="loading-section" data-testid="loading-section">
          <div className="spinner"></div>
          <div className="progress-bar">
            <div className="progress"></div>
          </div>
          <p>Analyzing content...</p>
        </div>
      )}
    </div>
  );
}

export default AnalysisTabs; 