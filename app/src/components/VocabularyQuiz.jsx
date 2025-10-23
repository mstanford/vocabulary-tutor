import React, { useState, useEffect } from 'react';
import { shuffleArray } from '../utils';
import { speakWord } from '../services/tts';

export default function VocabularyQuiz({ vocab, lang, selectedTopic, onQuizEnd }) {
  const [wordOrder, setWordOrder] = useState([]);
  const [wordIdx, setWordIdx] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [progress, setProgress] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  });

  // Initialize words for the selected topic once vocab arrives
  useEffect(() => {
    if (!vocab || !selectedTopic) return;
    const wordsInTopic = vocab.filter(v => v.topic === selectedTopic);
    const shuffled = shuffleArray(wordsInTopic);
    setWordOrder(shuffled);
    setProgress({
      correct: 0,
      incorrect: 0,
      total: shuffled.length
    });
  }, [vocab, selectedTopic]);

  if (!wordOrder.length) return null; // still loading

  const currentWord = wordOrder[wordIdx];

  const nextWord = () => {
    if (wordIdx + 1 < wordOrder.length) {
      setWordIdx(wordIdx + 1);
      setShowDefinition(false);
    } else {
      // finished this topic
      onQuizEnd(progress);
    }
  };

  const answer = isCorrect => {
    setProgress(p => ({
      ...p,
      correct: p.correct + (isCorrect ? 1 : 0),
      incorrect: p.incorrect + (isCorrect ? 0 : 1)
    }));
    nextWord();
  };

  const langCode = lang === 'nederlands' ? 'nl' : 'fr';
  const currentProgress = progress.correct + progress.incorrect;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{selectedTopic}</h2>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentProgress / progress.total) * 100}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {currentProgress} / {progress.total}
        </p>
      </div>

      <div className="quiz-card">
        <p className="word">{currentWord.word}</p>
        {showDefinition && (
          <div className="definition">
            <p className="definition-text">{currentWord.definition}</p>
            {currentWord.example && (
              <p className="example-text">{currentWord.example}</p>
            )}
          </div>
        )}
      </div>

      <div className="quiz-controls">
        {!showDefinition && (
          <>
            <button
              className="speak-button"
              onClick={() => speakWord(currentWord.word, langCode)}
              title="Speak word"
            >
              🔊 Speak
            </button>

            <button
              className="secondary-button"
              onClick={() => setShowDefinition(true)}
            >
              Show Definition
            </button>
          </>
        )}

        {showDefinition && (
          <>
            <button
              className="correct-button"
              onClick={() => answer(true)}
            >
              ✓ I Know
            </button>

            <button
              className="incorrect-button"
              onClick={() => answer(false)}
            >
              ✗ I Don't Know
            </button>
          </>
        )}
      </div>
    </div>
  );
}
