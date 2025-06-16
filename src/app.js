/**
 * Main application module
 */

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, 
  faChartLine, 
  faBolt, 
  faShieldAlt,
  faFileAlt,
  faCode,
  faUpload,
  faSearch,
  faTrash,
  faPaste,
  faDownload,
  faShareAlt,
  faGithub,
  faTwitter,
  faLinkedin
} from '@fortawesome/free-solid-svg-icons';
import { faGithub as faGithubBrand, faTwitter as faTwitterBrand, faLinkedin as faLinkedinBrand } from '@fortawesome/free-brands-svg-icons';
import Navbar from './components/Navbar';
import Header from './components/Header';
import AnalysisTabs from './components/AnalysisTabs';
import Results from './components/Results';
import Footer from './components/Footer';
import { useAnalyzer } from './hooks/useAnalyzer';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [content, setContent] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { analyzeContent } = useAnalyzer();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setContent('');
    setFileInfo(null);
    setResults(null);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    setResults(null);
  };

  const handleFileSelect = (file) => {
    setFileInfo(file);
    setContent(file.content);
    setResults(null);
  };

  const handleAnalyze = async () => {
    if (!content) return;

    setIsLoading(true);
    try {
      const analysisResults = await analyzeContent(content, activeTab);
      setResults(analysisResults);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (format) => {
    if (!results) return;

    const data = format === 'json'
      ? JSON.stringify(results, null, 2)
      : `AI Probability: ${results.score}%\n\nPatterns:\n${results.patterns.map(p => `- ${p.name}: ${p.description}`).join('\n')}`;

    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `detectly-analysis.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!results) return;

    const text = `AI Probability: ${results.score}%\nPatterns: ${results.patterns.map(p => p.name).join(', ')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Detectly Analysis Results',
          text
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('Results copied to clipboard!');
      } catch (error) {
        console.error('Copy failed:', error);
      }
    }
  };

  return (
    <div className="app">
      <Navbar />
      <Header />
      <main className="main-content" role="main">
        <AnalysisTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          content={content}
          onContentChange={handleContentChange}
          fileInfo={fileInfo}
          onFileSelect={handleFileSelect}
          isLoading={isLoading}
          onAnalyze={handleAnalyze}
        />
        {results && (
          <Results
            results={results}
            onDownload={handleDownload}
            onShare={handleShare}
            data-testid="results-section"
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App; 