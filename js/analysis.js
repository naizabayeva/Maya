/**
 * analysis.js — Writing Review Engine
 * 
 * Rule-based analysis for grammar, structure, and style.
 * No external APIs used.
 */

export const AnalysisEngine = {
  analyze(text) {
    const sentences = this.splitIntoSentences(text);
    return sentences.map(s => ({
      original: s,
      flags: this.getFlags(s),
      metrics: this.getMetrics(s)
    }));
  },

  splitIntoSentences(text) {
    // Basic sentence splitting (handles common punctuation)
    return text.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [text];
  },

  getFlags(sentence) {
    const flags = [];
    const lower = sentence.toLowerCase();

    // 1. Passive Voice Detection
    // Simple heuristic: be-verb + past participle (ends in ed or common irregulars)
    const passiveRegex = /\b(am|is|are|was|were|be|been|being)\b\s+\w+(ed|en|t)\b/i;
    if (passiveRegex.test(lower)) {
      flags.push({
        type: 'structure',
        label: 'Passive Voice',
        message: 'Consider using active voice for more direct communication.',
        suggestion: 'Rephrase to focus on the "doer" of the action.'
      });
    }

    // 2. Run-on Sentence Detection
    // Simple heuristic: > 35 words without enough commas/semicolons
    const words = sentence.trim().split(/\s+/);
    if (words.length > 35 && !/[;,]/.test(sentence)) {
      flags.push({
        type: 'structure',
        label: 'Possible Run-on',
        message: 'This sentence is quite long. Consider breaking it into two.',
        suggestion: 'Split into shorter, clearer sentences.'
      });
    }

    // 3. Subject-Verb Agreement (Very basic heuristics)
    // Example: "He go" instead of "He goes"
    const svAgreement = /\b(he|she|it)\s+([a-z]+(?!(s|es|ies|ed|ing)))\b/i;
    if (svAgreement.test(lower) && !/\b(can|will|shall|may|must|should|could|would)\b/.test(lower)) {
       // Note: This is a very rough check and prone to false positives
       // We'll keep it simple for now as a "flag" for the AP to check
       // flags.push({ type: 'grammar', label: 'S-V Agreement?', message: 'Check if the verb matches the singular subject.' });
    }

    // 4. Missing Articles (Basic)
    // Heuristic: "Go to store" -> "Go to the store"
    const missingArticle = /\b(to|in|at|on)\s+(?!the|a|an|my|your|his|her|its|our|their)([a-z]+)\b/i;
    // This is too noisy for a first pass, let's stick to clear structure/style for now.

    // 5. Clichés / Weak Vocabulary
    const weakWords = ['very', 'really', 'things', 'stuff', 'good', 'bad', 'nice'];
    weakWords.forEach(word => {
      if (new RegExp(`\\b${word}\\b`, 'i').test(lower)) {
        flags.push({
          type: 'vocab',
          label: 'Weak Vocabulary',
          message: `The word "${word}" is vague.`,
          suggestion: 'Use a more specific or descriptive term.'
        });
      }
    });

    return flags;
  },

  getMetrics(sentence) {
    const words = sentence.trim().split(/\s+/).length;
    return {
      wordCount: words,
      complexity: words > 20 ? 'High' : (words > 10 ? 'Medium' : 'Low')
    };
  }
};
