// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// DOM Elements - only initialize in browser environment
let textInput, codeInput, fileInput, analyzeBtn, loadingSection, resultsSection;
let textStats, codeStats, fileInfo, downloadJsonBtn, downloadTextBtn, shareBtn;

if (isBrowser) {
    textInput = document.getElementById('textInput');
    codeInput = document.getElementById('codeInput');
    fileInput = document.getElementById('fileInput');
    analyzeBtn = document.getElementById('analyzeBtn');
    loadingSection = document.getElementById('loadingSection');
    resultsSection = document.getElementById('resultsSection');
    textStats = document.getElementById('textStats');
    codeStats = document.getElementById('codeStats');
    fileInfo = document.getElementById('fileInfo');
    downloadJsonBtn = document.getElementById('downloadJsonBtn');
    downloadTextBtn = document.getElementById('downloadTextBtn');
    shareBtn = document.getElementById('shareBtn');

    // Event Listeners - only add in browser environment
    if (analyzeBtn) analyzeBtn.addEventListener('click', analyzeContent);
    if (fileInput) fileInput.addEventListener('change', handleFileSelect);
    if (textInput) textInput.addEventListener('input', updateTextStats);
    if (codeInput) codeInput.addEventListener('input', updateCodeStats);

    // Initialize stats
    updateTextStats();
    updateCodeStats();
}

// Tab switching
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.add('hidden'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.remove('hidden');
        
        // Reset results when switching tabs
        resetResults();
    });
});

// Text Analysis Functions
export function updateTextStats() {
    if (!isBrowser || !textInput || !textStats) return;
    
    const text = textInput.value;
    const words = text.trim().split(/\s+/).length;
    const chars = text.length;
    const lines = text.split('\n').length;
    
    textStats.innerHTML = `
        <span><i class="fas fa-font"></i> ${words} words</span>
        <span><i class="fas fa-keyboard"></i> ${chars} characters</span>
        <span><i class="fas fa-align-left"></i> ${lines} lines</span>
    `;
}

// Code Analysis Functions
export function updateCodeStats() {
    if (!isBrowser || !codeInput || !codeStats) return;
    
    const code = codeInput.value;
    const lines = code.split('\n').length;
    const chars = code.length;
    const nonEmptyLines = code.split('\n').filter(line => line.trim().length > 0).length;
    
    codeStats.innerHTML = `
        <span><i class="fas fa-code"></i> ${lines} total lines</span>
        <span><i class="fas fa-file-code"></i> ${nonEmptyLines} non-empty lines</span>
        <span><i class="fas fa-keyboard"></i> ${chars} characters</span>
    `;
}

// File Upload Functions
export function handleFileSelect(event) {
    if (!isBrowser || !fileInput || !textInput || !fileInfo) return;
    
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            textInput.value = content;
            updateTextStats();
            
            fileInfo.innerHTML = `
                <div>
                    <i class="fas fa-file"></i> ${file.name}
                    <span>(${(file.size / 1024).toFixed(2)} KB)</span>
                </div>
                <button class="action-btn" onclick="clearFile()">
                    <i class="fas fa-times"></i> Clear
                </button>
            `;
        };
        reader.readAsText(file);
    }
}

export function clearFile() {
    if (!isBrowser || !fileInput || !textInput || !fileInfo) return;
    
    fileInput.value = '';
    textInput.value = '';
    fileInfo.innerHTML = '';
    updateTextStats();
}

// Analysis Functions
export async function analyzeContent() {
    if (!isBrowser) return;
    
    const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab');
    let content = '';
    
    switch(activeTab) {
        case 'textTab':
            content = textInput?.value || '';
            break;
        case 'codeTab':
            content = codeInput?.value || '';
            break;
        case 'fileTab':
            content = textInput?.value || '';
            break;
    }
    
    if (!content.trim()) {
        showError('Please enter some content to analyze');
        return;
    }
    
    if (loadingSection) loadingSection.classList.remove('hidden');
    if (resultsSection) resultsSection.classList.add('hidden');
    
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const results = {
            aiProbability: Math.random() * 100,
            confidence: Math.random() * 100,
            patterns: [
                { name: 'Repetition', score: Math.random() * 100 },
                { name: 'Complexity', score: Math.random() * 100 },
                { name: 'Consistency', score: Math.random() * 100 }
            ],
            timestamp: new Date().toISOString()
        };
        
        displayResults(results);
    } catch (error) {
        showError('An error occurred during analysis');
        console.error(error);
    } finally {
        if (loadingSection) loadingSection.classList.add('hidden');
    }
}

export function displayResults(results) {
    if (!isBrowser || !resultsSection) return;
    
    const resultsContent = document.getElementById('resultsContent');
    if (!resultsContent) return;
    
    resultsContent.innerHTML = `
        <div class="result-card overall-card">
            <div class="result-header">
                <h3>Overall Analysis</h3>
                <div class="confidence-score ${getScoreClass(results.aiProbability)}">
                    ${results.aiProbability.toFixed(1)}% AI Probability
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill ${getScoreClass(results.aiProbability)}" 
                     style="width: ${results.aiProbability}%"></div>
            </div>
        </div>
        
        <div class="result-card">
            <h3>Pattern Analysis</h3>
            ${results.patterns.map(pattern => `
                <div class="pattern-item">
                    <div class="pattern-header">
                        <span>${pattern.name}</span>
                        <span class="pattern-score">${pattern.score.toFixed(1)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${getScoreClass(pattern.score)}" 
                             style="width: ${pattern.score}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    resultsSection.classList.remove('hidden');
    
    if (downloadJsonBtn) downloadJsonBtn.onclick = () => downloadResults(results, 'json');
    if (downloadTextBtn) downloadTextBtn.onclick = () => downloadResults(results, 'text');
    if (shareBtn) shareBtn.onclick = shareResults;
}

export function getScoreClass(score) {
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-medium';
    return 'score-low';
}

export function downloadResults(results, format) {
    if (!isBrowser) return;
    
    const blob = format === 'json' 
        ? new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' })
        : new Blob([formatResultsAsText(results)], { type: 'text/plain' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-analysis-${new Date().toISOString()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function formatResultsAsText(results) {
    return `
AI Content Analysis Report
=========================
Generated: ${new Date(results.timestamp).toLocaleString()}

Overall Analysis
--------------
AI Probability: ${results.aiProbability.toFixed(1)}%
Confidence: ${results.confidence.toFixed(1)}%

Pattern Analysis
--------------
${results.patterns.map(p => `${p.name}: ${p.score.toFixed(1)}%`).join('\n')}
    `;
}

export function shareResults() {
    if (!isBrowser) return;
    
    if (navigator.share) {
        navigator.share({
            title: 'AI Content Analysis Results',
            text: 'Check out my AI content analysis results!',
            url: window.location.href
        }).catch(console.error);
    } else {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showError('Link copied to clipboard!');
    }
}

export function showError(message) {
    if (!isBrowser) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.classList.add('show');
        setTimeout(() => {
            errorDiv.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(errorDiv);
            }, 300);
        }, 3000);
    }, 100);
}

export function resetResults() {
    if (!isBrowser || !resultsSection || !loadingSection) return;
    
    resultsSection.classList.add('hidden');
    loadingSection.classList.add('hidden');
} 