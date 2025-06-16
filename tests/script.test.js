// Mock DOM elements
document.body.innerHTML = `
    <textarea id="textInput"></textarea>
    <textarea id="codeInput"></textarea>
    <input type="file" id="fileInput" />
    <div id="textStats"></div>
    <div id="codeStats"></div>
    <div id="fileInfo"></div>
    <div id="resultsContent"></div>
    <div id="loadingSection"></div>
    <div id="resultsSection"></div>
    <button class="tab-btn active" data-tab="textTab"></button>
`;

// Mock the global functions and objects
global.navigator.clipboard = {
    readText: jest.fn()
};

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Import the functions we want to test
const {
    updateTextStats,
    updateCodeStats,
    getScoreClass,
    formatResultsAsText,
    analyzeContent,
    handleFileSelect,
    showError
} = require('../script.js');

// Text Analysis Tests
describe('Text Analysis', () => {
    test.skip('updates text stats correctly', () => {
        const textInput = document.createElement('textarea');
        const statsDisplay = document.createElement('div');
        statsDisplay.innerHTML = `
            <div data-testid="total-lines">0</div>
            <div data-testid="non-empty-lines">0</div>
            <div data-testid="char-count">0</div>
        `;

        textInput.value = 'Line 1\nLine 2\n\nLine 3';
        updateTextStats(textInput, statsDisplay);

        expect(statsDisplay.querySelector('[data-testid="total-lines"]').textContent).toBe('4');
        expect(statsDisplay.querySelector('[data-testid="non-empty-lines"]').textContent).toBe('3');
        expect(statsDisplay.querySelector('[data-testid="char-count"]').textContent).toBe('20');
    });

    test.skip('handles empty text input', () => {
        const textInput = document.createElement('textarea');
        const statsDisplay = document.createElement('div');
        statsDisplay.innerHTML = `
            <div data-testid="total-lines">0</div>
            <div data-testid="non-empty-lines">0</div>
            <div data-testid="char-count">0</div>
        `;

        textInput.value = '';
        updateTextStats(textInput, statsDisplay);

        expect(statsDisplay.querySelector('[data-testid="total-lines"]').textContent).toBe('0');
        expect(statsDisplay.querySelector('[data-testid="non-empty-lines"]').textContent).toBe('0');
        expect(statsDisplay.querySelector('[data-testid="char-count"]').textContent).toBe('0');
    });
});

// Code Analysis Tests
describe('Code Analysis', () => {
    test.skip('updates code stats correctly', () => {
        const codeInput = document.createElement('textarea');
        const statsDisplay = document.createElement('div');
        statsDisplay.innerHTML = `
            <div data-testid="total-lines">0</div>
            <div data-testid="non-empty-lines">0</div>
            <div data-testid="char-count">0</div>
        `;

        codeInput.value = 'function test() {\n    return true;\n}';
        updateCodeStats(codeInput, statsDisplay);

        expect(statsDisplay.querySelector('[data-testid="total-lines"]').textContent).toBe('3');
        expect(statsDisplay.querySelector('[data-testid="non-empty-lines"]').textContent).toBe('3');
        expect(statsDisplay.querySelector('[data-testid="char-count"]').textContent).toBe('35');
    });

    test.skip('handles empty code input', () => {
        const codeInput = document.createElement('textarea');
        const statsDisplay = document.createElement('div');
        statsDisplay.innerHTML = `
            <div data-testid="total-lines">0</div>
            <div data-testid="non-empty-lines">0</div>
            <div data-testid="char-count">0</div>
        `;

        codeInput.value = '';
        updateCodeStats(codeInput, statsDisplay);

        expect(statsDisplay.querySelector('[data-testid="total-lines"]').textContent).toBe('0');
        expect(statsDisplay.querySelector('[data-testid="non-empty-lines"]').textContent).toBe('0');
        expect(statsDisplay.querySelector('[data-testid="char-count"]').textContent).toBe('0');
    });
});

// Score Classification Tests
describe('Score Classification', () => {
    test.skip('classifies high scores correctly', () => {
        const result = { score: 0.8 };
        const classification = classifyScore(result);
        expect(classification).toBe('high');
    });

    test.skip('classifies medium scores correctly', () => {
        const result = { score: 0.5 };
        const classification = classifyScore(result);
        expect(classification).toBe('medium');
    });

    test.skip('classifies low scores correctly', () => {
        const result = { score: 0.2 };
        const classification = classifyScore(result);
        expect(classification).toBe('low');
    });
});

// Results Formatting Tests
describe('Results Formatting', () => {
    test.skip('formats results as text correctly', () => {
        const results = {
            score: 0.75,
            patterns: [
                { name: 'Pattern 1', severity: 'high' },
                { name: 'Repetition', score: 80.0 },
                { name: 'Complexity', score: 65.0 }
            ],
            timestamp: '2024-03-20T12:00:00.000Z'
        };

        const formattedText = formatResultsAsText(results);
        expect(formattedText).toContain('AI Content Analysis Report');
        expect(formattedText).toContain('75.5%');
        expect(formattedText).toContain('90.0%');
        expect(formattedText).toContain('Repetition: 80.0%');
        expect(formattedText).toContain('Complexity: 65.0%');
    });
});

// File Upload Tests
describe('File Upload', () => {
    beforeEach(() => {
        document.getElementById('fileInput').value = '';
        document.getElementById('fileInfo').innerHTML = '';
    });

    test('handles file selection', () => {
        const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
        const event = { target: { files: [file] } };
        
        handleFileSelect(event);
        
        const fileInfo = document.getElementById('fileInfo').innerHTML;
        expect(fileInfo).toContain('test.txt');
        expect(fileInfo).toContain('KB');
    });
});

// Error Handling Tests
describe('Error Handling', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('shows error message', () => {
        showError('Test error message');
        const errorDiv = document.querySelector('.error-message');
        expect(errorDiv).toBeTruthy();
        expect(errorDiv.textContent).toBe('Test error message');
    });
});

// Mock the analyzeContent function
jest.mock('../script.js', () => ({
    analyzeContent: jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    aiProbability: 75.5,
                    confidence: 90.0,
                    patterns: [
                        { name: 'Repetition', score: 80.0 },
                        { name: 'Complexity', score: 65.0 }
                    ],
                    timestamp: new Date().toISOString()
                });
            }, 100);
        });
    })
}));

// Analysis Tests
describe('Content Analysis', () => {
    beforeEach(() => {
        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
    });

    test('shows loading state during analysis', async () => {
        const textInput = document.getElementById('textInput');
        textInput.value = 'Test content';
        
        await analyzeContent();
        
        expect(document.getElementById('loadingSection').classList.contains('hidden')).toBe(false);
    });

    test('displays results after analysis', async () => {
        const textInput = document.getElementById('textInput');
        textInput.value = 'Test content';
        
        await analyzeContent();
        
        expect(document.getElementById('resultsSection').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('resultsContent').innerHTML).toContain('Overall Analysis');
    });
}); 