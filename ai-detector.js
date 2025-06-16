// AI Detection Core Library
class AIDetector {
    // N-gram analysis for better pattern recognition
    static generateNGrams(text, n) {
        const words = text.toLowerCase().split(/\s+/);
        const ngrams = [];
        for (let i = 0; i <= words.length - n; i++) {
            ngrams.push(words.slice(i, i + n).join(' '));
        }
        return ngrams;
    }

    // Enhanced Perplexity Analysis
    static analyzePerplexity(text) {
        const words = text.toLowerCase().split(/\s+/);
        let patterns = 0;

        // Enhanced AI patterns with more sophisticated detection
        const aiPatterns = [
            /\b(furthermore|moreover|additionally|however|nevertheless)\b/gi,
            /\b(it's important to note|it's worth noting|keep in mind)\b/gi,
            /\b(in conclusion|to summarize|overall|in summary)\b/gi,
            /\b(various|numerous|several|multiple)\b/gi,
            /\b(utilize|implement|facilitate|optimize)\b/gi, // Common AI overuse words
            /\b(in order to|with respect to|in terms of)\b/gi, // Common AI phrases
            /\b(clearly|obviously|evidently|undoubtedly)\b/gi  // Common AI qualifiers
        ];

        // N-gram analysis
        const bigrams = this.generateNGrams(text, 2);
        const trigrams = this.generateNGrams(text, 3);
        
        // Calculate n-gram frequency
        const ngramFrequency = {};
        [...bigrams, ...trigrams].forEach(ngram => {
            ngramFrequency[ngram] = (ngramFrequency[ngram] || 0) + 1;
        });

        // Detect repetitive patterns
        const repetitivePatterns = Object.values(ngramFrequency).filter(count => count > 3).length;
        
        aiPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) patterns += matches.length;
        });

        // Enhanced sentence structure analysis
        const sentences = text.split(/[.!?]+/);
        let avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
        
        // AI tends to have more uniform sentence lengths
        let lengthVariation = this.calculateVariation(sentences.map(s => s.length));
        
        // Calculate semantic consistency
        const semanticScore = this.analyzeSemanticConsistency(text);
        
        const perplexityScore = Math.min(100, 
            (patterns * 10) + 
            (avgLength > 80 ? 15 : 0) + 
            (lengthVariation < 0.3 ? 20 : 0) +
            (repetitivePatterns * 5) +
            (semanticScore * 15)
        );
        
        return {
            score: perplexityScore,
            details: {
                patterns: patterns,
                avgSentenceLength: Math.round(avgLength),
                lengthVariation: lengthVariation.toFixed(2),
                totalSentences: sentences.length,
                repetitivePatterns: repetitivePatterns,
                semanticConsistency: semanticScore.toFixed(2)
            }
        };
    }

    // Semantic consistency analysis
    static analyzeSemanticConsistency(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length < 2) return 0;

        let consistencyScore = 0;
        for (let i = 1; i < sentences.length; i++) {
            const prevWords = new Set(sentences[i-1].toLowerCase().split(/\s+/));
            const currWords = new Set(sentences[i].toLowerCase().split(/\s+/));
            
            // Calculate word overlap
            const overlap = [...prevWords].filter(word => currWords.has(word)).length;
            const totalWords = prevWords.size + currWords.size;
            
            if (totalWords > 0) {
                consistencyScore += (overlap / totalWords);
            }
        }

        return consistencyScore / (sentences.length - 1);
    }

    // Enhanced Burstiness Analysis
    static analyzeBurstiness(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length < 3) return { score: 0, details: {} };

        const complexities = sentences.map(sentence => {
            const words = sentence.trim().split(/\s+/).length;
            const commas = (sentence.match(/,/g) || []).length;
            const subclauses = (sentence.match(/\b(that|which|who|where|when)\b/gi) || []).length;
            const conjunctions = (sentence.match(/\b(and|or|but|because|although)\b/gi) || []).length;
            const punctuation = (sentence.match(/[;:]/g) || []).length;
            
            return words + (commas * 2) + (subclauses * 3) + (conjunctions * 2) + (punctuation * 2);
        });

        const variation = this.calculateVariation(complexities);
        const burstinessScore = Math.max(0, 100 - (variation * 100));

        // Analyze sentence structure diversity
        const structurePatterns = sentences.map(s => {
            return {
                length: s.length,
                complexity: complexities[sentences.indexOf(s)],
                hasSubclause: /\b(that|which|who|where|when)\b/i.test(s),
                hasConjunction: /\b(and|or|but|because|although)\b/i.test(s)
            };
        });

        return {
            score: burstinessScore,
            details: {
                sentenceComplexities: complexities.slice(0, 5),
                variation: variation.toFixed(3),
                avgComplexity: (complexities.reduce((a, b) => a + b, 0) / complexities.length).toFixed(1),
                structureDiversity: this.calculateStructureDiversity(structurePatterns)
            }
        };
    }

    // Calculate structure diversity
    static calculateStructureDiversity(patterns) {
        const uniquePatterns = new Set(patterns.map(p => 
            `${p.hasSubclause ? '1' : '0'}${p.hasConjunction ? '1' : '0'}`
        ));
        return (uniquePatterns.size / patterns.length).toFixed(2);
    }

    // Enhanced Code Analysis
    static analyzeCode(code) {
        let aiScore = 0;
        const details = {};

        // Enhanced comment patterns
        const aiCommentPatterns = [
            /\/\/\s*(TODO:|FIXME:|NOTE:)/gi,
            /\/\*\*?\s*(This function|This method|This class)/gi,
            /#\s*(This function|This method|This class)/gi,
            /\/\/\s*[A-Z][a-z]+\s+[a-z]+/g,
            /\/\/\s*[A-Z][a-z]+\s+[a-z]+\s+[a-z]+/g, // More complex comment patterns
            /\/\/\s*[A-Z][a-z]+\s+[a-z]+\s+[a-z]+\s+[a-z]+/g
        ];

        let commentScore = 0;
        aiCommentPatterns.forEach(pattern => {
            const matches = code.match(pattern);
            if (matches) commentScore += matches.length * 10;
        });

        // Enhanced variable naming analysis
        const variables = code.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
        const descriptiveVars = variables.filter(v => v.length > 8 && !v.includes('_'));
        const descriptiveRatio = descriptiveVars.length / Math.max(variables.length, 1);

        // Function structure analysis
        const functions = code.match(/(function\s+\w+|def\s+\w+|public\s+\w+|private\s+\w+)/gi) || [];
        const avgFunctionSpacing = this.analyzeFunctionSpacing(code);

        // Code complexity analysis
        const complexityScore = this.analyzeCodeComplexity(code);

        // Code style consistency
        const styleConsistency = this.analyzeCodeStyleConsistency(code);

        aiScore = commentScore + 
                 (descriptiveRatio * 30) + 
                 (avgFunctionSpacing > 0.8 ? 20 : 0) +
                 (complexityScore * 20) +
                 (styleConsistency * 15);

        details.commentPatterns = commentScore / 10;
        details.descriptiveVarRatio = descriptiveRatio.toFixed(2);
        details.functionCount = functions.length;
        details.codeStructureScore = avgFunctionSpacing.toFixed(2);
        details.complexityScore = complexityScore.toFixed(2);
        details.styleConsistency = styleConsistency.toFixed(2);

        return {
            score: Math.min(100, aiScore),
            details: details
        };
    }

    // Analyze code complexity
    static analyzeCodeComplexity(code) {
        const lines = code.split('\n');
        let complexity = 0;

        // Count control structures
        const controlStructures = [
            /if\s*\(/g,
            /for\s*\(/g,
            /while\s*\(/g,
            /switch\s*\(/g,
            /catch\s*\(/g
        ];

        controlStructures.forEach(pattern => {
            const matches = code.match(pattern);
            if (matches) complexity += matches.length;
        });

        // Normalize complexity score
        return Math.min(1, complexity / (lines.length * 0.1));
    }

    // Analyze code style consistency
    static analyzeCodeStyleConsistency(code) {
        const lines = code.split('\n');
        let consistency = 0;
        let totalChecks = 0;

        // Check indentation consistency
        const indentations = lines.map(line => line.match(/^\s*/)[0].length);
        const indentVariation = this.calculateVariation(indentations);
        consistency += (1 - indentVariation);
        totalChecks++;

        // Check spacing consistency
        const spacingPatterns = [
            /[^ ]=[^ ]/g,  // No spaces around =
            /[^ ]==[^ ]/g, // No spaces around ==
            /[^ ]!=[^ ]/g  // No spaces around !=
        ];

        spacingPatterns.forEach(pattern => {
            const matches = code.match(pattern);
            if (matches) {
                consistency += (1 - (matches.length / lines.length));
                totalChecks++;
            }
        });

        return totalChecks > 0 ? consistency / totalChecks : 0;
    }

    // Linguistic Analysis
    static analyzeLinguistic(text) {
        const words = text.toLowerCase().split(/\s+/);
        let score = 0;

        // Vocabulary diversity (AI tends to be more diverse)
        const uniqueWords = new Set(words);
        const diversity = uniqueWords.size / words.length;

        // Complex word usage
        const complexWords = words.filter(word => word.length > 8);
        const complexRatio = complexWords.length / words.length;

        // Transition word frequency
        const transitions = ['however', 'furthermore', 'moreover', 'additionally', 'consequently', 'nevertheless'];
        const transitionCount = words.filter(word => transitions.includes(word)).length;

        score = (diversity > 0.7 ? 25 : 0) + (complexRatio > 0.15 ? 30 : 0) + (transitionCount * 5);

        return {
            score: Math.min(100, score),
            details: {
                vocabularyDiversity: diversity.toFixed(3),
                complexWordRatio: complexRatio.toFixed(3),
                transitionWords: transitionCount,
                totalWords: words.length
            }
        };
    }

    // Statistical helpers
    static calculateVariation(numbers) {
        if (numbers.length < 2) return 0;
        const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
        const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
        return Math.sqrt(variance) / mean;
    }

    static analyzeFunctionSpacing(code) {
        const lines = code.split('\n');
        const nonEmptyLines = lines.filter(line => line.trim().length > 0);
        const emptyLines = lines.length - nonEmptyLines.length;
        return emptyLines / Math.max(lines.length, 1);
    }

    // Main analysis function
    static analyzeContent(content, contentType = 'text') {
        let results = {};

        if (contentType === 'code' || this.isCodeContent(content)) {
            results = {
                codeAnalysis: this.analyzeCode(content),
                linguisticAnalysis: this.analyzeLinguistic(content),
                perplexityAnalysis: this.analyzePerplexity(content)
            };
        } else {
            results = {
                perplexityAnalysis: this.analyzePerplexity(content),
                burstinessAnalysis: this.analyzeBurstiness(content),
                linguisticAnalysis: this.analyzeLinguistic(content)
            };
        }

        return results;
    }

    static isCodeContent(content) {
        const codeIndicators = [
            /function\s+\w+\s*\(/,
            /def\s+\w+\s*\(/,
            /class\s+\w+/,
            /import\s+\w+/,
            /\#include\s*</,
            /public\s+class/,
            /\<\?php/,
            /\<html\>/i
        ];
        return codeIndicators.some(pattern => pattern.test(content));
    }
}

// Export for Node.js if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIDetector;
}