# Text-to-Speech Voice Guide

## How Voice Selection Works

The Vocabulary Tutor uses an intelligent voice selection system that prioritizes Dutch and French native speaker voices.

### Voice Selection Priority

When you click the 🔊 **Speak** button, the app searches for voices in this order:

1. **Native Speaker Match** – Looks for voices explicitly marked as "native" in the language
2. **Language Match** – Finds any voice matching the target language (nl-NL, fr-FR, etc.)
3. **Language Code Match** – Falls back to the language code (nl, fr)
4. **System Default** – Uses whatever the browser provides

### Available Languages

- **Dutch (nl)** – Searches for: nl-NL, nl, nl_NL, du, Dutch
- **French (fr)** – Searches for: fr-FR, fr, fr_FR, French

## Platform Voices

### Windows (Best Support)
Windows 10/11 include high-quality voices:
- **Dutch:** Microsoft David (Male, Natural accent)
- **French:** Microsoft Marie or Hortense (Female, Native French)

**How to add more voices on Windows:**
1. Settings → Time & Language → Speech
2. Add language voices (Downloads required)
3. Refresh your browser after adding

### macOS
macOS has excellent built-in voices:
- **Dutch:** "Ellen" or "Moira" (with Dutch language settings)
- **French:** "Amélie" or "Thomas"

**How to enable on macOS:**
1. System Preferences → Accessibility → Speech
2. Select "Customized..." in Voice option
3. Choose Dutch or French voices

### Linux
Voice availability varies by distribution:
- Install `espeak` or `festival` for basic support
- Consider `mbrola` for better quality

```bash
# Ubuntu/Debian
sudo apt-get install espeak espeak-ng
```

### iOS/Android
- **iPhone/iPad:** Use native voices under Settings → Accessibility → Speech
- **Android:** Install Google Text-to-Speech or another TTS engine

## Improving Voice Quality

### Web Speech API (Current Implementation)

The app automatically:
- Sets **rate** to 0.9 (10% slower for clarity)
- Sets **pitch** to 1.0 (normal)
- Sets **volume** to 1.0 (maximum)
- Selects the best available native voice

### Using an Online TTS Service (Alternative)

For guaranteed high-quality voices, you can use a commercial TTS API:

#### Option 1: Google Cloud Text-to-Speech
```javascript
// More realistic and natural voices
// Supports 200+ voices and 40+ languages
```

#### Option 2: VoiceRSS API
The code includes a fallback to VoiceRSS. To use it:

1. Get a free API key from https://www.voicerss.org/
2. Set it in `app/src/services/tts.js`:
   ```javascript
   const apiKey = 'YOUR_ACTUAL_KEY_HERE';
   ```
3. This provides decent quality Dutch and French voices

#### Option 3: Azure Cognitive Services
Professional-grade voices with neural TTS options.

## Troubleshooting Voice Issues

### No Sound / Voice Not Working

**Check if Web Speech API is available:**
```javascript
// Open browser console (F12) and run:
if ('speechSynthesis' in window) {
  console.log('Web Speech API available');
  console.log('Voices:', window.speechSynthesis.getVoices());
} else {
  console.log('Web Speech API not supported');
}
```

**Solutions:**
1. Refresh the page (voices load asynchronously)
2. Check browser compatibility:
   - Chrome/Edge: ✅ Full support
   - Firefox: ✅ Full support
   - Safari: ✅ Full support
   - Opera: ✅ Full support

### Voice Sounds Robotic or Unnatural

1. **Check available voices:**
   - Open DevTools → Console
   - Run: `window.speechSynthesis.getVoices()`
   - Look for voices with "native" in the name

2. **Install better voices on your OS:**
   - Windows: Download Microsoft voices
   - macOS: Enable high-quality voices in System Settings
   - Linux: Install mbrola voices

3. **Use a professional TTS service:**
   - Replace Web Speech API with Google Cloud or Azure
   - Provides neural voices with natural prosody

### Dutch Accent Not Clear

The accent depends on available voices:

- **Male Dutch voices:** Often clearer, more formal
- **Female Dutch voices:** More natural, conversational

Try changing system voice settings to prefer native Dutch speakers.

## Advanced Configuration

### Customizing Speech Parameters

Edit `app/src/services/tts.js` to adjust:

```javascript
utter.rate = 0.9;      // 0.1 to 10 (slower = more clarity)
utter.pitch = 1.0;     // 0.1 to 2.0 (lower = deeper voice)
utter.volume = 1.0;    // 0 to 1.0 (full volume)
```

### Adding Voice Selection UI

To let users choose their preferred voice, create a voice selector:

```jsx
function VoiceSelector() {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const dutchVoices = availableVoices.filter(v =>
        v.lang.startsWith('nl')
      );
      setVoices(dutchVoices);
    };

    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
      updateVoices();
    }
  }, []);

  return (
    <select onChange={e => setSelectedVoice(voices[e.target.value])}>
      <option>Select voice</option>
      {voices.map((voice, i) => (
        <option key={i} value={i}>
          {voice.name} ({voice.lang})
        </option>
      ))}
    </select>
  );
}
```

## Recommended Setup

### For Best Dutch Pronunciation
1. **Operating System:** Windows 10+ or macOS
2. **Install:** Microsoft Dutch voice (Windows) or system Dutch voice (macOS)
3. **Browser:** Chrome or Edge (best voice support)
4. **Refresh:** Page after installing new voices

### For Learning Dutch
1. Ensure you have at least one native Dutch voice installed
2. Play each word 2-3 times to get familiar with the accent
3. Use slower speech rate (already set to 0.9)
4. Note regional variations (Netherlands vs Belgium)

### For Professional Use
1. Set up a commercial TTS service (Google Cloud, Azure)
2. Use neural voices for natural prosody
3. Store pronunciation preferences per user
4. Consider audio files instead of real-time synthesis

## Browser Compatibility

| Browser | Web Speech | Quality | Notes |
|---------|-----------|---------|-------|
| Chrome | ✅ | Excellent | Best voice selection |
| Edge | ✅ | Excellent | Uses Windows voices |
| Firefox | ✅ | Good | Limited voice selection |
| Safari | ✅ | Excellent | Uses system voices |
| Opera | ✅ | Good | Chromium-based |

## Future Enhancements

- Add UI for voice selection
- Cache and serve pre-recorded audio
- Integrate professional TTS service
- Support for regional accents (Flanders vs Netherlands)
- Pronunciation feedback system

## More Resources

- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [VoiceRSS API](https://www.voicerss.org/)
- [Google Cloud TTS](https://cloud.google.com/text-to-speech)
- [Microsoft Azure Speech Services](https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/)
