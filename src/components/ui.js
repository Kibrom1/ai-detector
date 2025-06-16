/**
 * UI components module for common UI elements
 */

class UI {
    constructor() {
        this.loadingSection = document.getElementById('loadingSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.errorContainer = document.createElement('div');
        this.errorContainer.className = 'error-message';
    }

    /**
     * Show loading state
     */
    showLoading() {
        if (this.loadingSection) {
            this.loadingSection.classList.remove('hidden');
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        if (this.loadingSection) {
            this.loadingSection.classList.add('hidden');
        }
    }

    /**
     * Show results
     * @param {Object} results - Analysis results
     */
    showResults(results) {
        if (this.resultsSection) {
            this.resultsSection.classList.remove('hidden');
            this.updateResultsContent(results);
        }
    }

    /**
     * Hide results
     */
    hideResults() {
        if (this.resultsSection) {
            this.resultsSection.classList.add('hidden');
        }
    }

    /**
     * Update results content
     * @param {Object} results - Analysis results
     */
    updateResultsContent(results) {
        const resultsContent = document.getElementById('resultsContent');
        if (!resultsContent) return;

        const content = this.formatResults(results);
        resultsContent.innerHTML = content;
    }

    /**
     * Format results for display
     * @param {Object} results - Analysis results
     * @returns {string} Formatted HTML content
     */
    formatResults(results) {
        const { patterns, stats } = results;
        const aiProbability = this.calculateAIProbability(patterns);

        return `
            <div class="results-header">
                <h3>Analysis Results</h3>
                <div class="ai-probability ${this.getScoreClass(aiProbability)}">
                    AI Probability: ${aiProbability.toFixed(1)}%
                </div>
            </div>
            <div class="results-content">
                <div class="patterns-section">
                    <h4>Pattern Analysis</h4>
                    ${this.formatPatterns(patterns)}
                </div>
                <div class="stats-section">
                    <h4>Statistics</h4>
                    ${this.formatStats(stats)}
                </div>
            </div>
        `;
    }

    /**
     * Format patterns for display
     * @param {Object} patterns - Pattern analysis results
     * @returns {string} Formatted HTML content
     */
    formatPatterns(patterns) {
        return Object.entries(patterns)
            .map(([name, score]) => `
                <div class="pattern-item">
                    <span class="pattern-name">${this.formatPatternName(name)}</span>
                    <div class="pattern-score ${this.getScoreClass(score)}">
                        ${score.toFixed(1)}%
                    </div>
                </div>
            `)
            .join('');
    }

    /**
     * Format stats for display
     * @param {Object} stats - Statistics
     * @returns {string} Formatted HTML content
     */
    formatStats(stats) {
        return Object.entries(stats)
            .map(([name, value]) => `
                <div class="stat-item">
                    <span class="stat-name">${this.formatStatName(name)}</span>
                    <span class="stat-value">${value.toFixed(2)}</span>
                </div>
            `)
            .join('');
    }

    /**
     * Calculate AI probability from patterns
     * @param {Object} patterns - Pattern analysis results
     * @returns {number} AI probability score
     */
    calculateAIProbability(patterns) {
        const weights = {
            repetition: 0.4,
            complexity: 0.3,
            consistency: 0.3
        };

        return Object.entries(patterns)
            .reduce((sum, [name, score]) => sum + (score * (weights[name] || 0)), 0);
    }

    /**
     * Get score class based on value
     * @param {number} score - Score value
     * @returns {string} CSS class name
     */
    getScoreClass(score) {
        if (score >= 70) return 'score-high';
        if (score >= 40) return 'score-medium';
        return 'score-low';
    }

    /**
     * Format pattern name for display
     * @param {string} name - Pattern name
     * @returns {string} Formatted name
     */
    formatPatternName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    /**
     * Format stat name for display
     * @param {string} name - Stat name
     * @returns {string} Formatted name
     */
    formatStatName(name) {
        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.errorContainer.textContent = message;
        document.body.appendChild(this.errorContainer);
        
        setTimeout(() => {
            this.errorContainer.remove();
        }, 3000);
    }
}

export default new UI(); 