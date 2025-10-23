import React from 'react';
import { getTopicScore } from '../services/scoreStorage';

export default function TopicSelector({ topics, lang, level, onSelect, onBack }) {
  // Get score for a topic
  const getScore = (topic) => {
    return getTopicScore(lang, level, topic);
  };

  // Determine status: 'not-started', 'proficient', or 'incomplete'
  const getTopicStatus = (topic) => {
    const score = getScore(topic);
    if (!score) return 'not-started';
    if (score.accuracy >= 80) return 'proficient';
    return 'incomplete';
  };

  return (
    <div className="topic-selector-full">
      <div className="topic-header">
        <h1>Vocabulary Tutor</h1>
        <div className="topic-info">
          <p className="topic-language">{lang === 'nederlands' ? '🇳🇱 Dutch' : '🇫🇷 French'} - Level {level}</p>
          <p className="topic-count">{topics.length} topics</p>
        </div>
      </div>

      {/* Topics grid - fill entire window */}
      <div className="topics-grid-full">
        {topics.map((topic, index) => {
          const status = getTopicStatus(topic);
          const score = getScore(topic);
          return (
            <button
              key={index}
              className={`topic-button-full ${status}`}
              onClick={() => onSelect(topic)}
            >
              <span className="topic-number">{index + 1}</span>
              <span className="topic-name">{topic}</span>
              {score && (
                <span className="topic-accuracy">{score.accuracy}%</span>
              )}
            </button>
          );
        })}
      </div>

      <button className="secondary-button back-button" onClick={onBack}>
        ← Back to Language Selection
      </button>
    </div>
  );
}
