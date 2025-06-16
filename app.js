// Main Application Logic
let currentResults = null;
let currentContent = '';
let currentContentType = 'text';
let analysisTimeout = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupRealTimeAnalysis();
});

function initializeApp() {
    // Tab switching functionality
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });

    // File upload handling
    document.getElementById('fileInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('fileName').textContent = `Selected: ${file.name}`;
            const reader = new FileReader();
            reader.onload = function(e) {
                currentContent = e.target.result;
                triggerRealTimeAnalysis();
            };
            reader.readAsText(file);
        }
    });

    // Initialize tooltips
    initializeTooltips();
}

function setupRealTimeAnalysis() {
    const textInput = document.getElementById('textInput');
    const codeInput = document.getElementById('codeInput');

    [textInput, codeInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                triggerRealTimeAnalysis();
            });
        }
    });
}

function triggerRealTimeAnalysis() {
    if (analysisTimeout) {
        clearTimeout(analysisTimeout);
    }

    analysisTimeout = setTimeout(() => {
        const textInput = document.getElementById('textInput');
        const codeInput = document.getElementById('codeInput');
        
        let content = '';
        if (currentContentType === 'text' && textInput) {
            content = textInput.value;
        } else if (currentContentType === 'code' && codeInput) {
            content = codeInput.value;
        } else if (currentContentType === 'file') {
            content = currentContent;
        }

        if (content.trim().length > 50) { // Only analyze if content is substantial
            analyzeContent();
        }
    }, 1000); // Debounce for 1 second
}

function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });

    // Show/hide tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(tabName + '-tab').classList.remove('hidden');
    
    currentContentType = tabName;
    triggerRealTimeAnalysis();
}

// Main analysis function
async function analyzeContent() {
    const textInput = document.getElementById('textInput');
    const codeInput = document.getElementById('codeInput');
    
    let content = '';
    if (currentContentType === 'text' && textInput) {
        content = textInput.value;
    } else if (currentContentType === 'code' && codeInput) {
        content = codeInput.value;
    } else if (currentContentType === 'file') {
        content = currentContent;
    }

    if (!content.trim()) {
        return;
    }

    // Show loading
    document.getElementById('loadingSection').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');

    try {
        // Simulate processing time for realism
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Analyze content using AIDetector
        const results = AIDetector.analyzeContent(content, currentContentType);
        
        currentResults = results;
        displayResults(results);
        
        // Update progress indicators
        updateProgressIndicators(results);
        
        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');
    } catch (error) {
        console.error('Analysis error:', error);
        showError('An error occurred during analysis. Please try again.');
    }
}

function displayResults(results) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';

    // Create overall assessment first
    const overall = calculateOverallScore(results);
    const overallCard = createOverallCard(overall);
    container.appendChild(overallCard);

    // Create detailed analysis cards
    Object.entries(results).forEach(([testName, result]) => {
        const card = createResultCard(testName, result);
        container.appendChild(card);
    });

    // Add visualization
    addVisualization(results);
}

function createResultCard(testName, result) {
    const card = document.createElement('div');
    card.className = 'result-card';

    const scoreClass = result.score > 70 ? 'score-high' : result.score > 40 ? 'score-medium' : 'score-low';
    const testDisplayName = testName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    card.innerHTML = `
        <div class="result-header">
            <div class="result-title">${testDisplayName}</div>
            <div class="confidence-score ${scoreClass}">${result.score.toFixed(1)}% AI Likelihood</div>
        </div>
        <div class="progress-bar">
            <div class="progress-fill ${scoreClass}" style="width: ${result.score}%"></div>
        </div>
        <div class="result-details">
            ${Object.entries(result.details).map(([key, value]) => 
                `<div class="detail-item" data-tooltip="${getTooltipText(key)}">
                    <strong>${formatDetailKey(key)}:</strong> ${formatDetailValue(value)}
                </div>`
            ).join('')}
        </div>
    `;

    return card;
}

function createOverallCard(overall) {
    const card = document.createElement('div');
    card.className = 'result-card overall-card';
    card.style.border = '3px solid #3498db';

    const scoreClass = overall.score > 70 ? 'score-high' : overall.score > 40 ? 'score-medium' : 'score-low';

    card.innerHTML = `
        <div class="result-header">
            <div class="result-title">🎯 Overall Assessment</div>
            <div class="confidence-score ${scoreClass}">${overall.score.toFixed(1)}% AI Generated</div>
        </div>
        <div class="progress-bar">
            <div class="progress-fill ${scoreClass}" style="width: ${overall.score}%"></div>
        </div>
        <div class="result-details">
            <div class="detail-item" data-tooltip="How confident the system is in its assessment">
                <strong>Confidence Level:</strong> ${overall.confidence}
            </div>
            <div class="detail-item" data-tooltip="Key factors that influenced the assessment">
                <strong>Primary Indicators:</strong> ${overall.indicators.join(', ')}
            </div>
            <div class="detail-item" data-tooltip="Suggested next steps based on the analysis">
                <strong>Recommendation:</strong> ${overall.recommendation}
            </div>
        </div>
    `;

    return card;
}

function addVisualization(results) {
    const container = document.getElementById('resultsContainer');
    const visualizationCard = document.createElement('div');
    visualizationCard.className = 'visualization-card';
    
    // Create radar chart data
    const chartData = {
        labels: Object.keys(results).map(key => 
            key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
        ),
        datasets: [{
            label: 'AI Likelihood',
            data: Object.values(results).map(r => r.score),
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            borderColor: 'rgba(52, 152, 219, 1)',
            pointBackgroundColor: 'rgba(52, 152, 219, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
        }]
    };

    visualizationCard.innerHTML = `
        <div class="chart-container">
            <canvas id="resultsChart"></canvas>
        </div>
    `;
    
    container.appendChild(visualizationCard);

    // Initialize chart
    const ctx = document.getElementById('resultsChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: chartData,
        options: {
            scale: {
                ticks: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updateProgressIndicators(results) {
    const overall = calculateOverallScore(results);
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${overall.score}%`;
        progressBar.className = `progress-bar ${overall.score > 70 ? 'high' : overall.score > 40 ? 'medium' : 'low'}`;
    }
}

function formatDetailKey(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/([A-Z])/g, match => match.toLowerCase());
}

function formatDetailValue(value) {
    if (typeof value === 'number') {
        return value.toFixed(2);
    }
    return value;
}

function getTooltipText(key) {
    const tooltips = {
        patterns: 'Number of AI-like patterns detected in the text',
        avgSentenceLength: 'Average number of characters per sentence',
        lengthVariation: 'Variation in sentence lengths (lower values may indicate AI generation)',
        totalSentences: 'Total number of sentences analyzed',
        repetitivePatterns: 'Number of repeated phrases or patterns',
        semanticConsistency: 'How consistent the text is in its meaning and structure',
        structureDiversity: 'Variation in sentence structure patterns',
        complexityScore: 'Overall code complexity score',
        styleConsistency: 'How consistent the code style is throughout'
    };
    return tooltips[key] || key;
}

function initializeTooltips() {
    document.addEventListener('mouseover', function(e) {
        const tooltip = e.target.getAttribute('data-tooltip');
        if (tooltip) {
            const tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip';
            tooltipEl.textContent = tooltip;
            document.body.appendChild(tooltipEl);

            const rect = e.target.getBoundingClientRect();
            tooltipEl.style.top = rect.bottom + 5 + 'px';
            tooltipEl.style.left = rect.left + 'px';
        }
    });

    document.addEventListener('mouseout', function(e) {
        const tooltip = e.target.getAttribute('data-tooltip');
        if (tooltip) {
            const tooltips = document.querySelectorAll('.tooltip');
            tooltips.forEach(t => t.remove());
        }
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function calculateOverallScore(results) {
    const scores = Object.values(results).map(r => r.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    let confidence, recommendation;
    let indicators = [];

    if (avgScore > 75) {
        confidence = 'High';
        recommendation = 'Content shows strong indicators of AI generation';
        indicators = ['High perplexity', 'Low burstiness', 'Formal language patterns'];
    } else if (avgScore > 50) {
        confidence = 'Medium';
        recommendation = 'Content shows moderate AI indicators, further review recommended';
        indicators = ['Mixed patterns', 'Some AI-like structures'];
    } else {
        confidence = 'Low';
        recommendation = 'Content appears to be human-generated';
        indicators = ['Natural variation', 'Human-like patterns'];
    }

    return {
        score: avgScore,
        confidence,
        recommendation,
        indicators
    };
}

function downloadReport(format) {
    if (!currentResults) return;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    let content, filename, mimeType;

    if (format === 'json') {
        content = JSON.stringify(currentResults, null, 2);
        filename = `ai-detection-report-${timestamp}.json`;
        mimeType = 'application/json';
    } else {
        content = generateTextReport(currentResults);
        filename = `ai-detection-report-${timestamp}.txt`;
        mimeType = 'text/plain';
    }

    downloadFile(content, filename, mimeType);
}

function generateTextReport(results) {
    let report = 'AI CONTENT DETECTION REPORT\n';
    report += '=' + '='.repeat(50) + '\n\n';
    report += `Generated: ${new Date().toLocaleString()}\n\n`;

    Object.entries(results).forEach(([testName, result]) => {
        report += `${testName.toUpperCase()}\n`;
        report += '-'.repeat(30) + '\n';
        report += `Score: ${result.score.toFixed(1)}% AI Likelihood\n`;
        report += 'Details:\n';
        Object.entries(result.details).forEach(([key, value]) => {
            report += `  - ${key}: ${value}\n`;
        });
        report += '\n';
    });

    const overall = calculateOverallScore(results);
    report += 'OVERALL ASSESSMENT\n';
    report += '-'.repeat(30) + '\n';
    report += `Score: ${overall.score.toFixed(1)}% AI Generated\n`;
    report += `Confidence: ${overall.confidence}\n`;
    report += `Recommendation: ${overall.recommendation}\n`;

    return report;
}

function downloadCode() {
    const codeContent = `// AI Content Detection Library
// Standalone version for local use

${AIDetector.toString()}

// Usage example:
// const result = AIDetector.analyzeContent("Your text here", "text");
// console.log(result);

// For Node.js:
// const AIDetector = require('./ai-detector');
// const result = AIDetector.analyzeContent("Your text here");
`;

    downloadFile(codeContent, 'ai-detector-library.js', 'text/javascript');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}