# Vocabulary Tutor

An interactive flash-card quiz application for learning Dutch and French vocabulary. Built with React, Vite, and Docker.

## Quick Start

### Prerequisites
- Docker & Docker Compose installed

### Running with Docker

```bash
# First time setup
docker compose up --build

# Later (if you add new vocab files)
docker compose down && docker compose up --build
```

The app will be available at `http://localhost:3000`

### Development Setup (without Docker)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
vocabulary-tutor/
├── app/
│   ├── public/               # Static assets
│   └── src/
│       ├── components/       # React components
│       │   ├── LanguageSelector.jsx
│       │   ├── VocabularyQuiz.jsx
│       │   └── ProgressTracker.jsx
│       ├── hooks/           # Custom React hooks
│       │   └── useVocabulary.js
│       ├── services/        # Business logic
│       │   ├── vocabParser.js
│       │   └── tts.js       # Text-to-speech
│       ├── styles/          # CSS
│       ├── App.jsx          # Main app component
│       └── index.jsx        # Entry point
├── data/                    # Vocabulary files (outside src)
│   ├── nederlands/
│   │   └── B1.dat
│   └── francais/
│       └── B1.dat
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Docker Compose configuration
├── package.json            # Dependencies
├── vite.config.js         # Vite configuration
└── index.html             # HTML entry point
```

## Vocabulary File Format

Vocabulary files are plain text files in the `data/` directory with the `.dat` extension.

Format: `[chapter]` headers followed by `word|definition|example` lines.

Example (`data/nederlands/B1.dat`):

```
[1.1 Op huizenjacht - op zoek naar een woning]
de eigenaar|Bezitter.|Ik heb vandaag een afspraak met de eigenaar van het appartement.
het stadscentrum|Midden in de stad.|Ik ga in het stadscentrum wonen.
comfortabel|Gerieflijk, aangenaam.|Die nieuwe fauteuil zit heel comfortabel.
...
```

## Features

- **Language Selection**: Choose between Dutch and French (easily extensible)
- **Level Selection**: Pick from A2, B1, B2, C1 levels
- **Interactive Quiz**: Flash-card style vocabulary testing
- **Text-to-Speech**: Hear pronunciation of words (uses browser Web Speech API with fallback)
- **Progress Tracking**: See your accuracy and performance metrics
- **Responsive Design**: Works on desktop and mobile devices
- **Vocabulary Management**: Add new languages/levels by dropping files in the data directory

## How to Use

1. **Select Language & Level**: Pick your language and proficiency level
2. **Review Vocabulary**: See each word one at a time
3. **Show Definition**: Click "Show Definition" to reveal the meaning and example
4. **Listen**: Click 🔊 to hear the word pronounced
5. **Answer**: Mark if you know the word or not
6. **View Results**: See your quiz performance and accuracy rate
7. **Retry or Change**: Take the quiz again or switch languages

## Adding New Languages

1. Create a new directory: `data/<language>/`
2. Create vocabulary files: `data/<language>/<level>.dat`
3. Update the `LanguageSelector.jsx` component to include the new language
4. Rebuild: `docker compose down && docker compose up --build`

## Adding New Vocabulary Levels

1. Create a file: `data/<language>/<level>.dat`
2. No code changes needed! Just rebuild the Docker image

## Technology Stack

- **React 18**: UI framework
- **Vite**: Build tool
- **Nginx**: Production server
- **Docker**: Containerization
- **Web Speech API**: Text-to-speech functionality

## Docker Architecture

The `Dockerfile` uses a multi-stage build:

1. **Build Stage**: Compiles React with Vite
2. **Runtime Stage**: Serves compiled files with Nginx
   - React build → `/usr/share/nginx/html`
   - Vocabulary data → `/usr/share/nginx/html/data`

This keeps the final image small and secure.

## Environment Notes

- The app runs on port 3000 in Docker
- Development server runs on port 5173
- All vocabulary files are served as static assets
- The app uses client-side rendering with the Web Speech API

## Troubleshooting

### Build fails with "Failed to load /data/..."
- Ensure the `.dat` file exists in the correct directory
- Check that language/level names match exactly (case-sensitive)

### No audio from speaker button
- Your browser must support the Web Speech API
- The fallback uses VoiceRSS API (requires API key)
- Some browsers may require permissions

### Port already in use
- Change the port in `docker-compose.yml`
- Or: `docker compose down` to stop all containers

## Future Enhancements

- Backend API for tracking user progress
- Spaced repetition algorithm
- Multiple choice questions
- Audio recording and pronunciation feedback
- Multiplayer quiz mode
- Progress persistence with user accounts
