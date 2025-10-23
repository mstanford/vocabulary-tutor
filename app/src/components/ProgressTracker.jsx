import React from 'react';

export default function ProgressTracker({ progress, onRetry, onChangeLanguage }) {
  const accuracy = progress.total > 0
    ? Math.round((progress.correct / progress.total) * 100)
    : 0;

  return (
    <div className="progress-tracker">
      <h2>Quiz Complete!</h2>

      <div className="score-card">
        <div className="score-stat">
          <p className="stat-label">Correct Answers</p>
          <p className="stat-value correct">{progress.correct}</p>
        </div>

        <div className="score-stat">
          <p className="stat-label">Incorrect Answers</p>
          <p className="stat-value incorrect">{progress.incorrect}</p>
        </div>

        <div className="score-stat">
          <p className="stat-label">Accuracy</p>
          <p className="stat-value accuracy">{accuracy}%</p>
        </div>
      </div>

      <div className="accuracy-bar">
        <div
          className="accuracy-fill"
          style={{ width: `${accuracy}%` }}
        ></div>
      </div>

      <div className="progress-actions">
        <button className="primary-button" onClick={onRetry}>
          Try Again
        </button>
        <button className="secondary-button" onClick={onChangeLanguage}>
          Change Language
        </button>
      </div>
    </div>
  );
}
