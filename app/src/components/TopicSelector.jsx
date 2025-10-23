import React from 'react';

export default function TopicSelector({ topics, lang, level, onSelect, onBack }) {
  return (
    <div className="topic-selector">
      <h1>Vocabulary Tutor</h1>
      <div className="topic-info">
        <p className="topic-language">{lang === 'nederlands' ? '🇳🇱 Dutch' : '🇫🇷 French'} - Level {level}</p>
        <p className="topic-count">Select a topic ({topics.length} available)</p>
      </div>

      <div className="topics-grid">
        {topics.map((topic, index) => (
          <button
            key={index}
            className="topic-button"
            onClick={() => onSelect(topic)}
          >
            <span className="topic-number">{index + 1}</span>
            <span className="topic-name">{topic}</span>
          </button>
        ))}
      </div>

      <button className="secondary-button" onClick={onBack}>
        ← Back to Language Selection
      </button>
    </div>
  );
}
