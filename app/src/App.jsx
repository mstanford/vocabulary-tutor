import React, { useState } from 'react';
import { useVocabulary } from './hooks/useVocabulary';
import LanguageSelector from './components/LanguageSelector';
import TopicSelector from './components/TopicSelector';
import VocabularyQuiz from './components/VocabularyQuiz';
import ProgressTracker from './components/ProgressTracker';
import './styles/global.css';

export default function App() {
  const [lang, setLang] = useState(null);
  const [level, setLevel] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quizProgress, setQuizProgress] = useState(null);

  const { vocab, error } = useVocabulary(lang, level);

  const handleLanguageSelect = (selectedLang, selectedLevel) => {
    setLang(selectedLang);
    setLevel(selectedLevel);
    setSelectedTopic(null);
    setQuizProgress(null);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setQuizProgress(null);
  };

  const handleBackToTopicSelection = () => {
    setSelectedTopic(null);
    setQuizProgress(null);
  };

  const handleQuizEnd = (progress) => {
    setQuizProgress(progress);
  };

  const handleRetry = () => {
    setQuizProgress(null);
  };

  const handleChangeLanguage = () => {
    setLang(null);
    setLevel(null);
    setSelectedTopic(null);
    setQuizProgress(null);
  };

  // Show language selector if not selected
  if (!lang || !level) {
    return <LanguageSelector onSelect={handleLanguageSelect} />;
  }

  // Show error if vocab failed to load
  if (error) {
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <button className="secondary-button" onClick={handleChangeLanguage}>
          Try Another Language
        </button>
      </div>
    );
  }

  // Show loading state
  if (!vocab) {
    return (
      <div className="loading-container">
        <p>Loading vocabulary…</p>
      </div>
    );
  }

  // Extract unique topics from vocab
  const topics = [...new Set(vocab.map(v => v.topic))];

  // Show topic selector if language/level selected but not topic
  if (!selectedTopic) {
    return (
      <TopicSelector
        topics={topics}
        lang={lang}
        level={level}
        onSelect={handleTopicSelect}
        onBack={handleChangeLanguage}
      />
    );
  }

  // Show quiz results if quiz is complete
  if (quizProgress) {
    return (
      <ProgressTracker
        progress={quizProgress}
        onRetry={handleRetry}
        onBackToTopics={handleBackToTopicSelection}
        onChangeLanguage={handleChangeLanguage}
      />
    );
  }

  // Show the vocabulary quiz
  return (
    <VocabularyQuiz
      vocab={vocab}
      lang={lang}
      selectedTopic={selectedTopic}
      onQuizEnd={handleQuizEnd}
    />
  );
}
