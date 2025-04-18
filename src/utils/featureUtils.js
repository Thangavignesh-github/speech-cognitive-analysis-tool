/**
 * Utility functions for feature extraction and processing
 */

// Calculate speech rate (words per minute)
export const calculateSpeechRate = (transcription, durationInSeconds) => {
  if (!transcription || durationInSeconds <= 0) return 0;
  
  const words = transcription.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const durationInMinutes = durationInSeconds / 60;
  
  return wordCount / durationInMinutes;
};

// Count hesitations in transcription
export const countHesitations = (transcription) => {
  if (!transcription) return 0;
  
  const hesitationWords = ['uh', 'um', 'er', 'ah', 'hmm', 'ehm'];
  const words = transcription.toLowerCase().split(/\s+/);
  
  return words.filter(word => hesitationWords.includes(word)).length;
};

// Count pauses in transcription
export const countPauses = (transcription) => {
  if (!transcription) return 0;
  
  // Counting ellipses or sequences of periods/commas as pauses
  const pauseRegex = /\.{2,}|,{2,}|\.\.\.|--+/g;
  const matches = transcription.match(pauseRegex);
  
  return matches ? matches.length : 0;
};

// Count vague words
export const countVagueWords = (transcription) => {
  if (!transcription) return 0;
  
  const vagueWords = ['thing', 'stuff', 'something', 'somewhere', 'somehow', 'whatever', 'whatsoever'];
  const words = transcription.toLowerCase().split(/\s+/);
  
  return words.filter(word => vagueWords.includes(word)).length;
};

// Detect incomplete sentences
export const detectIncompleteSentences = (transcription) => {
  if (!transcription) return 0;
  
  const sentences = transcription.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let incompleteCount = 0;
  
  for (const sentence of sentences) {
    // Consider a sentence incomplete if it's too short or ends with certain words
    if (
      sentence.split(/\s+/).length < 3 ||
      /\b(and|but|or|so|because|if|when)\s*$/i.test(sentence.trim())
    ) {
      incompleteCount++;
    }
  }
  
  return incompleteCount;
};

// Count "lost words" indicators
export const countLostWords = (transcription) => {
  if (!transcription) return 0;
  
  const lostWordsPatterns = [
    /\b(that thing|you know|like|what's it called|what do you call it)\b/gi,
    /\bI (can't remember|forgot|don't recall)\b/gi
  ];
  
  let count = 0;
  for (const pattern of lostWordsPatterns) {
    const matches = transcription.match(pattern);
    if (matches) {
      count += matches.length;
    }
  }
  
  return count;
};

// Calculate semantic coherence
export const calculateSemanticAnomaly = (transcription) => {
  // In a real implementation, this would use a language model or word embeddings
  // to measure semantic coherence or detect anomalies
  
  // For demonstration, we return a random value
  return 0.1 + Math.random() * 0.2;
};

// Normalize features for model input
export const normalizeFeatures = (features) => {
  // In a real implementation, this would scale features appropriately
  // based on typical ranges or using statistical normalization
  
  // For demonstration, we return the features unchanged
  return features;
};

// Calculate weighted risk score based on feature weights
export const calculateRiskScore = (features, weights) => {
  if (!features || !weights) return 0;
  
  let weightedSum = 0;
  let weightTotal = 0;
  
  for (const feature in features) {
    if (weights[feature]) {
      weightedSum += features[feature] * weights[feature];
      weightTotal += weights[feature];
    }
  }
  
  return weightTotal > 0 ? weightedSum / weightTotal : 0;
};