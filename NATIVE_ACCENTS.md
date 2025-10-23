# Native Dutch & French Accents Setup

The app now supports **professional native accents** using Google Cloud Text-to-Speech API, with automatic fallback to the browser's Web Speech API.

## Quick Start (No API Key)

By default, the app uses your **browser's built-in voices**, which provides decent quality:
- ✅ Works immediately, no setup needed
- ✅ Free
- ❌ Quality varies by operating system
- ❌ May not have native accent speakers

Just run the app as normal:
```bash
docker compose up --build
```

## Native Accents (With Google Cloud API)

For **guaranteed authentic Dutch and French accents**, use Google Cloud Text-to-Speech:

### Step 1: Set Up Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the **Cloud Text-to-Speech API**
4. Create an API key (Credentials → API Keys)
5. Copy your API key

### Step 2: Configure the App

Create a `.env.local` file in the project root:

```bash
REACT_APP_GOOGLE_CLOUD_API_KEY=your_api_key_here
```

Or set it as an environment variable before running:

```bash
export REACT_APP_GOOGLE_CLOUD_API_KEY=your_api_key_here
npm run build
npm run dev
```

### Step 3: Test

Click the 🔊 **Speak** button on any word. You should hear:
- **Dutch:** Native Netherlands accent (standard Dutch pronunciation)
- **French:** Native France French accent (Paris region)

## Voice Specifications

### Dutch (nl-NL)
- **Voice Name:** `nl-NL-Standard-A`
- **Quality:** Neural / High
- **Accent:** Netherlands Dutch
- **Gender:** Neutral
- **Speed:** 0.9x (slightly slower for clarity)

**Alternatives:**
- `nl-NL-Standard-B` (Female)
- `nl-NL-Standard-C` (Male)
- `nl-NL-Standard-D` (Female)
- `nl-NL-Standard-E` (Male)

### French (fr-FR)
- **Voice Name:** `fr-FR-Standard-C`
- **Quality:** Neural / High
- **Accent:** France French
- **Gender:** Neutral
- **Speed:** 0.9x

**Alternatives:**
- `fr-FR-Standard-A` (Female)
- `fr-FR-Standard-B` (Male)
- `fr-FR-Standard-D` (Female)
- `fr-FR-Standard-E` (Male)

## How It Works

```
User clicks 🔊 Speak
        ↓
Check for Google Cloud API key
        ↓
   ┌────┴────┐
   ↓         ↓
API Key?   No API Key?
   ↓         ↓
Google   Web Speech API
Cloud    (Browser voices)
TTS
```

If Google Cloud API fails for any reason, it automatically falls back to the browser's built-in voices.

## Pricing

Google Cloud Text-to-Speech is **very affordable**:
- **Free tier:** 1 million characters per month
- **Paid:** $16 per 1 million characters after free tier
- For vocabulary learning, you'll likely stay in the free tier

## Using Alternative Voices

To change voices, edit `app/src/services/tts.js`:

```javascript
const VOICE_CONFIG = {
  'nl': {
    googleVoice: 'nl-NL-Standard-B',  // Change this
    // ...
  },
  'fr': {
    googleVoice: 'fr-FR-Standard-A',  // Change this
    // ...
  }
};
```

## Alternative: Azure Text-to-Speech

If you prefer Microsoft Azure, you can use this instead:

```javascript
// In VOICE_CONFIG:
azureVoice: 'nl-NL-ColetteNeural',      // Dutch
azureVoice: 'fr-FR-CelesteNeural',      // French
```

**Setup:**
1. Create Azure account and Cognitive Services resource
2. Get API key and region
3. Update the `speakWord` function to use Azure endpoint

## Troubleshooting

### "No audio content in response"
- Check that your API key is correct
- Verify Google Cloud Text-to-Speech API is enabled
- Check your billing is set up (you need a payment method even for free tier)

### Audio quality is poor / unusual accent
- The Web Speech API fallback may be used
- Check browser console: `F12 → Console`
- Look for errors about Google Cloud API

### It's using Web Speech API instead of Google Cloud
1. Verify `.env.local` has your API key
2. Restart the dev server: `npm run dev`
3. Check that `REACT_APP_` prefix is correct
4. Run: `npm run build` (Vite must build to include env vars)

### "Google Cloud API key not configured"
- Create `.env.local` file in project root
- Set `REACT_APP_GOOGLE_CLOUD_API_KEY=your_key`
- Rebuild: `npm run build`

## Security Note

The API key is exposed in the frontend (visible in browser). For production:

1. **Create a backend proxy:**
   ```
   Frontend → Your Server → Google Cloud
   ```

2. **Or use service account authentication:**
   - Use signed JWTs instead of API keys
   - More complex but more secure

3. **Or restrict API key:**
   - In Google Cloud Console, restrict to only Text-to-Speech API
   - Restrict to your domain only
   - Monitor usage and set alerts

## Comparing Voice Quality

| Method | Quality | Accent | Setup | Cost |
|--------|---------|--------|-------|------|
| Browser (Web Speech) | Medium | Varies by OS | 0 minutes | Free |
| Google Cloud TTS | Excellent | Authentic | 10 minutes | Free (1M chars) |
| Azure Neural TTS | Excellent | Authentic | 10 minutes | Paid |
| Pre-recorded audio | Perfect | Real person | Complex | Time investment |

## Future Enhancement: Pre-recorded Audio

For best quality and offline support, you could:
1. Record native speakers reading each vocabulary word
2. Store as audio files in `/public/audio/<lang>/<word>.mp3`
3. Update TTS service to prefer pre-recorded audio

```javascript
const audioPath = `/audio/${lang}/${sanitizeWord(word)}.mp3`;
const audio = new Audio(audioPath);
audio.play();
```

## Google Cloud API Reference

See: https://cloud.google.com/text-to-speech/docs/voices

## More Resources

- [Google Cloud Text-to-Speech Docs](https://cloud.google.com/text-to-speech)
- [Available Voices & Languages](https://cloud.google.com/text-to-speech/docs/voices)
- [Pricing Calculator](https://cloud.google.com/products/calculator)
- [Azure Text-to-Speech](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech)
