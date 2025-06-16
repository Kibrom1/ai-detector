/**
 * Core analyzer module for text and code analysis
 */

class Analyzer {
    constructor() {
        this.patterns = {
            repetition: this.checkRepetition.bind(this),
            complexity: this.checkComplexity.bind(this),
            consistency: this.checkConsistency.bind(this)
        };
    }

    /**
     * Analyze text content
     * @param {string} text - The text to analyze
     * @returns {Object} Analysis results
     */
    analyzeText(text) {
        if (!text) return this.getEmptyResult();

        const words = text.split(/\s+/).filter(word => word.length > 0);
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.length > 0);
        
        return {
            wordCount: words.length,
            characterCount: text.length,
            lineCount: text.split('\n').length,
            patterns: this.analyzePatterns(text),
            stats: {
                avgWordLength: this.calculateAverageWordLength(words),
                avgSentenceLength: this.calculateAverageSentenceLength(sentences)
            }
        };
    }

    /**
     * Analyze code content
     * @param {string} code - The code to analyze
     * @returns {Object} Analysis results
     */
    analyzeCode(code) {
        if (!code) return this.getEmptyResult();

        const lines = code.split('\n');
        const nonEmptyLines = lines.filter(line => line.trim().length > 0);
        
        return {
            totalLines: lines.length,
            nonEmptyLines: nonEmptyLines.length,
            characterCount: code.length,
            patterns: this.analyzePatterns(code),
            stats: {
                avgLineLength: this.calculateAverageLineLength(lines),
                complexity: this.calculateCodeComplexity(code)
            }
        };
    }

    /**
     * Analyze patterns in content
     * @param {string} content - The content to analyze
     * @returns {Object} Pattern analysis results
     */
    analyzePatterns(content) {
        const results = {};
        for (const [name, pattern] of Object.entries(this.patterns)) {
            results[name] = pattern(content);
        }
        return results;
    }

    /**
     * Check for repetition patterns
     * @param {string} content - The content to check
     * @returns {number} Repetition score
     */
    checkRepetition(content) {
        const words = content.toLowerCase().split(/\s+/);
        const wordFrequency = {};
        let repetitionScore = 0;

        words.forEach(word => {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });

        Object.values(wordFrequency).forEach(freq => {
            if (freq > 1) repetitionScore += (freq - 1);
        });

        return Math.min(100, (repetitionScore / words.length) * 100);
    }

    /**
     * Check for complexity patterns
     * @param {string} content - The content to check
     * @returns {number} Complexity score
     */
    checkComplexity(content) {
        const sentences = content.split(/[.!?]+/);
        const words = content.split(/\s+/);
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        const avgSentenceLength = words.length / sentences.length;

        return Math.min(100, (avgWordLength * avgSentenceLength) / 10);
    }

    /**
     * Check for consistency patterns
     * @param {string} content - The content to check
     * @returns {number} Consistency score
     */
    checkConsistency(content) {
        const sentences = content.split(/[.!?]+/);
        const variations = new Set(sentences.map(s => s.trim().toLowerCase())).size;
        return Math.min(100, (variations / sentences.length) * 100);
    }

    /**
     * Calculate average word length
     * @param {string[]} words - Array of words
     * @returns {number} Average word length
     */
    calculateAverageWordLength(words) {
        return words.reduce((sum, word) => sum + word.length, 0) / words.length;
    }

    /**
     * Calculate average sentence length
     * @param {string[]} sentences - Array of sentences
     * @returns {number} Average sentence length
     */
    calculateAverageSentenceLength(sentences) {
        return sentences.reduce((sum, sentence) => sum + sentence.split(/\s+/).length, 0) / sentences.length;
    }

    /**
     * Calculate average line length
     * @param {string[]} lines - Array of lines
     * @returns {number} Average line length
     */
    calculateAverageLineLength(lines) {
        return lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
    }

    /**
     * Calculate code complexity
     * @param {string} code - The code to analyze
     * @returns {number} Complexity score
     */
    calculateCodeComplexity(code) {
        const complexityFactors = {
            loops: (code.match(/for|while|do/g) || []).length,
            conditionals: (code.match(/if|else|switch|case/g) || []).length,
            functions: (code.match(/function|=>/g) || []).length
        };

        return Math.min(100, Object.values(complexityFactors).reduce((sum, count) => sum + count, 0) * 10);
    }

    /**
     * Get empty result object
     * @returns {Object} Empty result structure
     */
    getEmptyResult() {
        return {
            wordCount: 0,
            characterCount: 0,
            lineCount: 0,
            patterns: {},
            stats: {
                avgWordLength: 0,
                avgSentenceLength: 0,
                avgLineLength: 0,
                complexity: 0
            }
        };
    }
}

export default new Analyzer(); 