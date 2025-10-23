# CLAUDE.md – Dutch & French Vocabulary Quiz (Docker‑Ready)

> **Purpose** – A tiny, single‑container React app that turns Dutch & French vocab files into an interactive flash‑card quiz.  
> The vocab lives in a dedicated `data/` directory *outside* the React source tree, so you can drop in new languages or levels without touching the code.

---

## 1. Project Layout

```
/project-root
├── claude.md                       ← this file
├── docker-compose.yml
├── Dockerfile
├── data/
│   └── nederlands/
│       └── B1.dat                 ← Dutch B1 vocab (example)
│   └── fr/
│       └── B2.dat                 ← French B2 vocab (example)
├── app/                            ← React source
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── LanguageSelector.jsx
│       │   ├── VocabularyQuiz.jsx
│       │   └── ProgressTracker.jsx
│       ├── hooks/
│       │   └── useVocabulary.js
│       ├── services/
│       │   ├── vocabParser.js
│       │   └── tts.js
│       ├── styles/
│       │   └── global.css
│       ├── App.jsx
│       └── index.jsx
└── scripts/                        ← optional build / helper scripts
```

> **Why keep `data/` outside `app/`?**  
> Keeps your learning material separate from the code, making it trivial to add a new language or level by dropping a file into the right folder and rebuilding the image.

---

## 2. Vocabulary File Format (`.dat`)

```
[1.1 Op huizenjacht - op zoek naar een woning]
de eigenaar|Bezitter.|Ik heb vandaag een afspraak met de eigenaar van het appartement.
het stadscentrum|Midden in de stad.|Ik ga in het stadscentrum wonen.
comfortabel|Gerieflijk, aangenaam.|Die nieuwe fauteuil zit heel comfortabel.
...
```

* **Header** – `[chapter]` becomes the *topic* for all following words until the next header.  
* **Word line** – `word|definition|example`  
  * The example is optional.

---

## 3. Dockerfile

```dockerfile
# ---------- Build Stage ----------
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build          # creates /usr/src/app/dist

# ---------- Runtime Stage ----------
FROM nginx:alpine
# 1️⃣ Copy the React build
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
# 2️⃣ Copy the data directory into the Nginx root so the files are publicly available
COPY --from=build /usr/src/app/data /usr/share/nginx/html/data
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

> *The `data/` folder is copied into the same static root as the React build (`/usr/share/nginx/html/data`).*  
> The app can therefore request `/data/<lang>/<level>.dat` exactly as the public path.

---

## 4. Docker Compose

```yaml
# docker-compose.yml
services:
  frontend:
    build: .
    container_name: vocab-quiz
    ports:
      - "3000:80"              # host port 3000 → container port 80
    restart: unless-stopped
    volumes:
      # ── For development: hot‑reload the React source
      - ./app:/usr/src/app
      - /usr/src/app/node_modules
```

> **Commands**  
> ```bash
> # first time
> docker compose up --build
> # later (add new vocab file)  
> docker compose down && docker compose up --build
> ```

---

## 5. React – Core Code

Below are the core files that make the quiz work.  
You can copy/paste them into the corresponding paths in `app/src/`.

### 5.1 Parser (`src/services/vocabParser.js`)

```js
// src/services/vocabParser.js
export async function parseVocabFile(lang, level) {
  const path = `/data/${lang}/${level}.dat`;
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  const text = await res.text();

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const vocab = [];
  let currentTopic = 'Uncategorized';

  for (const line of lines) {
    if (line.startsWith('[') && line.endsWith(']')) {
      currentTopic = line.slice(1, -1);
      continue;
    }
    const [word, definition, example] = line.split('|').map(s => s?.trim());
    if (!word || !definition) continue;
    vocab.push({
      word,
      definition,
      example: example || '',
      topic: currentTopic
    });
  }
  return vocab;
}
```

### 5.2 Hook – `src/hooks/useVocabulary.js`

```js
import { useEffect, useState } from 'react';
import { parseVocabFile } from '../services/vocabParser';

export function useVocabulary(lang, level) {
  const [vocab, setVocab] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lang || !level) return;
    parseVocabFile(lang, level)
      .then(setVocab)
      .catch(err => {
        console.error(err);
        setError('Could not load vocabulary file.');
      });
  }, [lang, level]);

  return { vocab, error };
}
```

### 5.3 TTS Service (`src/services/tts.js`)

```js
export function speakWord(word, lang = 'nl') {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = lang;           // 'nl' for Dutch, 'fr' for French
    window.speechSynthesis.speak(utter);
    return;
  }

  // Simple fallback – replace with a real endpoint if you want
  fetch(`https://api.voicerss.org/?key=YOUR_KEY&hl=${lang}&src=${encodeURIComponent(word)}`)
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    })
    .catch(console.error);
}
```

### 5.4 Language Selector (`src/components/LanguageSelector.jsx`)

```jsx
import React, { useState } from 'react';

export default function LanguageSelector({ onSelect }) {
  const [lang, setLang] = useState('nederlands');
  const [level, setLevel] = useState('B1');

  const submit = e => {
    e.preventDefault();
    onSelect(lang, level);
  };

  return (
    <form onSubmit={submit}>
      <label>
        Language:
        <select value={lang} onChange={e => setLang(e.target.value)}>
          <option value="nederlands">Dutch</option>
          <option value="français">French</option>
          {/* add more languages here */}
        </select>
      </label>

      <label>
        Level:
        <select value={level} onChange={e => setLevel(e.target.value)}>
          <option value="B1">B1</option>
          <option value="A2">A2</option>
          <option value="C1">C1</option>
          {/* add more levels here */}
        </select>
      </label>

      <button type="submit">Start Quiz</button>
    </form>
  );
}
```

### 5.5 Main App (`src/App.jsx`)

```jsx
import React, { useState } from 'react';
import { useVocabulary } from './hooks/useVocabulary';
import LanguageSelector from './components/LanguageSelector';
import VocabularyQuiz from './components/VocabularyQuiz';
import ProgressTracker from './components/ProgressTracker';

export default function App() {
  const [lang, setLang] = useState(null);
  const [level, setLevel] = useState(null);

  const { vocab, error } = useVocabulary(lang, level);

  if (!lang || !level) {
    return (
      <LanguageSelector onSelect={(l, lv) => { setLang(l); setLevel(lv); }} />
    );
  }

  if (error) return <p className="error">{error}</p>;
  if (!vocab) return <p>Loading…</p>;

  return (
    <div className="app">
      <VocabularyQuiz vocab={vocab} />
      {/* After the quiz ends, show: <ProgressTracker vocab={vocab} /> */}
    </div>
  );
}
```

### 5.6 Vocabulary Quiz (`src/components/VocabularyQuiz.jsx`)

```jsx
import React, { useState, useEffect } from 'react';
import { shuffleArray } from '../utils';
import { speakWord } from '../services/tts';

export default function VocabularyQuiz({ vocab }) {
  const [topicOrder, setTopicOrder] = useState([]);
  const [topicIdx, setTopicIdx] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [progress, setProgress] = useState({
    correct: 0,
    incorrect: 0,
    total: vocab.length
  });

  // Initialise topics once vocab arrives
  useEffect(() => {
    if (!vocab) return;
    const topics = [...new Set(vocab.map(v => v.topic))];
    setTopicOrder(shuffleArray(topics));
  }, [vocab]);

  if (!topicOrder.length) return null; // still shuffling

  const currentTopic = topicOrder[topicIdx];
  const wordsInTopic = vocab.filter(v => v.topic === currentTopic);
  const currentWord = wordsInTopic[wordIdx];

  const nextWord = () => {
    if (wordIdx + 1 < wordsInTopic.length) {
      setWordIdx(wordIdx + 1);
      setShowDefinition(false);
    } else {
      // move to next topic
      if (topicIdx + 1 < topicOrder.length) {
        setTopicIdx(topicIdx + 1);
        setWordIdx(0);
        setShowDefinition(false);
      } else {
        // finished all topics – you can render <ProgressTracker />
        // For simplicity, we just log progress here
        console.log('Quiz finished', progress);
      }
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

  return (
    <div className="quiz">
      <h2>{currentTopic}</h2>
      <div className="card">
        <p className="word">{currentWord.word}</p>
        {showDefinition && (
          <div className="definition">
            <p>{currentWord.definition}</p>
            {currentWord.example && <p className="example">{currentWord.example}</p>}
          </div>
        )}
      </div>

      <div className="controls">
        <button onClick={() => speakWord(currentWord.word, lang === 'nederlands' ? 'nl' : 'fr')}>
          🔊
        </button>

        <button onClick={() => setShowDefinition(true)}>Show Definition</button>

        <button onClick={() => answer(true)}>I Know</button>
        <button onClick={() => answer(false)}>I Don’t Know</button>
      </div>

      <p>
        Progress: {progress.correct}/{progress.total} correct
      </p>
    </div>
  );
}
```

> **Notes**  
> * `topicOrder` is a shuffled list of topics.  
> * `wordsInTopic` is the slice of words that belong to the current topic.  
> * Progress is updated after each answer and printed at the bottom.

---

## 6. Running the App

```bash
# Build the image & start the container
docker compose up --build

# Open your browser
http://localhost:3000
```

1. The **Language Selector** appears first – pick a language (`nederlands` / `français`) and a level (`A2`, `B1`, `C1`, …).  
2. The app requests `/data/<lang>/<level>.dat`.  
3. The vocabulary is parsed, shuffled, and presented as flash‑cards.  
4. Speak the word (SpeechSynthesis or fallback TTS).  
5. Mark whether you know it or not; the quiz auto‑advances through random topics.  
6. When the quiz ends you can show a **Progress Tracker** (not fully coded above, but trivial to add).

---

## 7. Extending the Project

| What you want to do | How |
|---------------------|-----|
| **Add a new language** | Drop a file into `data/<lang>/` (e.g. `data/fr/B2.dat`). Restart the container. |
| **Add a new level**   | Create a new file `data/<lang>/<level>.dat`. |
| **Add a new column**  | Update `parseVocabFile` to push the extra field into each object. |
| **Use a real TTS API** | Replace the `fetch` call in `tts.js` with your own endpoint. |

---

## 8. Summary

1. Vocabulary files live in `data/<lang>/<level>.dat`.  
2. Dockerfile builds the React app **and** copies the `data/` folder into the Nginx static root.  
3. The React code fetches `/data/<lang>/<level>.dat`, parses it into `{ word, definition, example, topic }` objects, and feeds them to the quiz.  
4. The entire stack runs in a single `docker compose` container exposed on port 3000.

Happy learning!
