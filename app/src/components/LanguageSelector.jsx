import React, { useState } from 'react';

export default function LanguageSelector({ onSelect }) {
  const [lang, setLang] = useState('nederlands');
  const [level, setLevel] = useState('B1');

  const submit = e => {
    e.preventDefault();
    onSelect(lang, level);
  };

  return (
    <div className="language-selector">
      <h1>Vocabulary Tutor</h1>
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="language">Language:</label>
          <select
            id="language"
            value={lang}
            onChange={e => setLang(e.target.value)}
          >
            <option value="nederlands">Dutch</option>
            <option value="francais">French</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="level">Level:</label>
          <select
            id="level"
            value={level}
            onChange={e => setLevel(e.target.value)}
          >
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
        </div>

        <button type="submit" className="primary-button">Start Quiz</button>
      </form>
    </div>
  );
}
