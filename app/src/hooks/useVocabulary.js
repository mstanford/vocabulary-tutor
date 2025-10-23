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
