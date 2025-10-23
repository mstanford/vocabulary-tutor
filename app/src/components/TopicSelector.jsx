import React, { useState, useMemo } from 'react';
import { getTopicScore } from '../services/scoreStorage';

export default function TopicSelector({ topics, lang, level, onSelect, onBack }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter topics based on search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    return topics.filter(topic =>
      topic.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [topics, searchQuery]);

  const isLargeList = topics.length > 8;

  // Get score for a topic
  const getScore = (topic) => {
    return getTopicScore(lang, level, topic);
  };

  return (
    <div className="topic-selector">
      <h1>Vocabulary Tutor</h1>
      <div className="topic-info">
        <p className="topic-language">{lang === 'nederlands' ? '🇳🇱 Dutch' : '🇫🇷 French'} - Level {level}</p>
        <p className="topic-count">Select a topic ({filteredTopics.length} of {topics.length})</p>
      </div>

      {/* Search bar for large lists */}
      {isLargeList && (
        <div className="topic-search">
          <input
            type="text"
            placeholder="🔍 Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="topic-search-input"
          />
          {searchQuery && (
            <button
              className="topic-search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Topics list/grid - switches based on count */}
      {isLargeList ? (
        <div className="topics-list">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic, index) => {
              const score = getScore(topic);
              return (
                <button
                  key={index}
                  className="topic-list-item"
                  onClick={() => onSelect(topic)}
                >
                  <span className="topic-item-number">{topics.indexOf(topic) + 1}</span>
                  <span className="topic-item-name">{topic}</span>
                  {score && (
                    <span className={`topic-score ${score.accuracy >= 70 ? 'good' : score.accuracy >= 50 ? 'okay' : 'needswork'}`}>
                      {score.accuracy}%
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <p className="no-results">No topics match your search.</p>
          )}
        </div>
      ) : (
        <div className="topics-grid">
          {filteredTopics.map((topic, index) => {
            const score = getScore(topic);
            return (
              <button
                key={index}
                className="topic-button"
                onClick={() => onSelect(topic)}
              >
                <span className="topic-number">{topics.indexOf(topic) + 1}</span>
                <span className="topic-name">{topic}</span>
                {score && (
                  <span className={`topic-badge ${score.accuracy >= 70 ? 'good' : score.accuracy >= 50 ? 'okay' : 'needswork'}`}>
                    {score.accuracy}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <button className="secondary-button" onClick={onBack}>
        ← Back to Language Selection
      </button>
    </div>
  );
}
