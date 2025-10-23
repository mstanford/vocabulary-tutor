/**
 * Voice configuration for native accents
 * Supports both Web Speech API and professional TTS services
 */

const VOICE_CONFIG = {
  'nl': {
    // Web Speech API language code
    lang: 'nl-NL',
    // Google Cloud Text-to-Speech voice (neural, native Dutch accent)
    googleVoice: 'nl-NL-Standard-A',
    // Azure voice name
    azureVoice: 'nl-NL-ColetteNeural',
    // Fallback voice names for Web Speech API
    fallbackNames: ['nl-NL', 'Dutch', 'Ellen'],
    region: 'Netherlands'
  },
  'fr': {
    lang: 'fr-FR',
    googleVoice: 'fr-FR-Standard-C',
    azureVoice: 'fr-FR-CelesteNeural',
    fallbackNames: ['fr-FR', 'French', 'Amélie'],
    region: 'France'
  }
};

// Get the best available voice for the language using Web Speech API
function getVoiceForLanguage(lang) {
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  const config = VOICE_CONFIG[lang];

  if (!config) return null;

  // Try exact language match first
  let match = voices.find(voice =>
    voice.lang.toLowerCase().startsWith(config.lang.toLowerCase())
  );
  if (match) return match;

  // Try fallback names
  for (const name of config.fallbackNames) {
    match = voices.find(voice =>
      voice.lang.toLowerCase().includes(name.toLowerCase()) ||
      voice.name.toLowerCase().includes(name.toLowerCase())
    );
    if (match) return match;
  }

  // Return any voice in the target language
  return voices.find(voice =>
    voice.lang.toLowerCase().startsWith(lang)
  ) || null;
}

// Use Google Cloud Text-to-Speech for professional native accents
// Requires: GOOGLE_CLOUD_API_KEY environment variable
async function speakWithGoogleCloud(word, lang) {
  const apiKey = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;
  if (!apiKey) {
    console.warn('Google Cloud API key not configured');
    return false;
  }

  const config = VOICE_CONFIG[lang];
  if (!config) return false;

  try {
    const response = await fetch(
      'https://texttospeech.googleapis.com/v1/text:synthesize?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: word },
          voice: {
            languageCode: config.lang,
            name: config.googleVoice,
            ssmlGender: 'NEUTRAL'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            pitch: 0,
            speakingRate: 0.9
          }
        })
      }
    );

    if (!response.ok) {
      console.error('Google Cloud TTS error:', response.status);
      return false;
    }

    const data = await response.json();
    if (!data.audioContent) {
      console.error('No audio content in response');
      return false;
    }

    // Play the audio
    const audio = new Audio('data:audio/mp3;base64,' + data.audioContent);
    audio.play();
    return true;
  } catch (err) {
    console.error('Google Cloud TTS failed:', err);
    return false;
  }
}

export function speakWord(word, lang = 'nl') {
  // Try Google Cloud TTS first if configured
  // This provides native accents with neural voices
  if (process.env.REACT_APP_GOOGLE_CLOUD_API_KEY) {
    speakWithGoogleCloud(word, lang).then(success => {
      if (success) return;
      // Fall back to Web Speech API if Google Cloud fails
      speakWithWebSpeechAPI(word, lang);
    });
  } else {
    // Use Web Speech API by default
    speakWithWebSpeechAPI(word, lang);
  }
}

function speakWithWebSpeechAPI(word, lang) {
  if (!('speechSynthesis' in window)) {
    console.warn('Web Speech API not available');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(word);
  const config = VOICE_CONFIG[lang];

  if (config) {
    utter.lang = config.lang;
  } else {
    utter.lang = lang;
  }

  utter.rate = 0.9;      // Slightly slower for clarity
  utter.pitch = 1.0;     // Natural pitch
  utter.volume = 1.0;    // Full volume

  // Try to use a native voice if available
  const voice = getVoiceForLanguage(lang);
  if (voice) {
    utter.voice = voice;
  }

  window.speechSynthesis.speak(utter);
}

// Initialize voices when they load (helps some browsers)
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Voices are now loaded
  };
}
