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
