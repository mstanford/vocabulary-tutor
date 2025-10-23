/**
 * Score storage service using browser's localStorage
 * Persists quiz results across sessions
 */

const STORAGE_KEY = 'vocab_tutor_scores';

/**
 * Get a unique key for a topic quiz
 */
function getTopicKey(lang, level, topic) {
  return `${lang}__${level}__${topic}`;
}

/**
 * Save a quiz score
 */
export function saveScore(lang, level, topic, correct, incorrect, total) {
  try {
    const key = getTopicKey(lang, level, topic);
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    const score = {
      lang,
      level,
      topic,
      correct,
      incorrect,
      total,
      accuracy,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    const scores = getAllScores();
    scores[key] = score;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));

    return score;
  } catch (err) {
    console.error('Error saving score:', err);
  }
}

/**
 * Get score for a specific topic
 */
export function getTopicScore(lang, level, topic) {
  try {
    const key = getTopicKey(lang, level, topic);
    const scores = getAllScores();
    return scores[key] || null;
  } catch (err) {
    console.error('Error getting score:', err);
    return null;
  }
}

/**
 * Get all scores for a language/level
 */
export function getLevelScores(lang, level) {
  try {
    const scores = getAllScores();
    return Object.values(scores).filter(s => s.lang === lang && s.level === level);
  } catch (err) {
    console.error('Error getting level scores:', err);
    return [];
  }
}

/**
 * Get all saved scores
 */
export function getAllScores() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error('Error parsing scores:', err);
    return {};
  }
}

/**
 * Clear all scores (for reset)
 */
export function clearAllScores() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing scores:', err);
  }
}

/**
 * Export scores as JSON
 */
export function exportScores() {
  try {
    const scores = getAllScores();
    const json = JSON.stringify(scores, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vocabulary-scores-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error exporting scores:', err);
  }
}
