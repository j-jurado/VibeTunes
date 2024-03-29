const moods = new Map([
  ['happy', { energy: 0.8, valence: 0.9, liveliness: 0.7, loudness: 0.7, tempo: 120, danceability: 0.8 }],
  ['sad', { energy: 0.3, valence: 0.2, liveliness: 0.3, loudness: 0.4, tempo: 70, danceability: 0.3 }],
  ['excited', { energy: 0.9, valence: 0.8, liveliness: 0.8, loudness: 0.8, tempo: 140, danceability: 0.9 }],
  ['calm', { energy: 0.4, valence: 0.6, liveliness: 0.4, loudness: 0.5, tempo: 80, danceability: 0.4 }],
  ['mellow', { energy: 0.5, valence: 0.4, liveliness: 0.4, loudness: 0.4, tempo: 90, danceability: 0.4 }],
  ['angry', { energy: 0.7, valence: 0.3, liveliness: 0.6, loudness: 0.8, tempo: 150, danceability: 0.7 }],
  ['tense', { energy: 0.6, valence: 0.4, liveliness: 0.6, loudness: 0.7, tempo: 130, danceability: 0.6 }],
  ['content', { energy: 0.7, valence: 0.7, liveliness: 0.6, loudness: 0.6, tempo: 110, danceability: 0.7 }],
  ['optimistic', { energy: 0.8, valence: 0.8, liveliness: 0.7, loudness: 0.7, tempo: 120, danceability: 0.8 }],
  ['anxious', { energy: 0.6, valence: 0.4, liveliness: 0.6, loudness: 0.7, tempo: 140, danceability: 0.6 }],
  ['lively', { energy: 0.9, valence: 0.7, liveliness: 0.9, loudness: 0.8, tempo: 160, danceability: 0.8 }],
  ['frustrated', { energy: 0.7, valence: 0.2, liveliness: 0.6, loudness: 0.7, tempo: 150, danceability: 0.7 }],
  ['bored', { energy: 0.4, valence: 0.3, liveliness: 0.4, loudness: 0.4, tempo: 80, danceability: 0.4 }],
  ['surprised', { energy: 0.8, valence: 0.7, liveliness: 0.7, loudness: 0.7, tempo: 130, danceability: 0.8 }],
  ['joyful', { energy: 0.9, valence: 0.9, liveliness: 0.8, loudness: 0.8, tempo: 140, danceability: 0.9 }],
  ['depressed', { energy: 0.2, valence: 0.1, liveliness: 0.2, loudness: 0.3, tempo: 60, danceability: 0.2 }],
  ['disgust', { energy: 0.3, valence: 0.2, liveliness: 0.3, loudness: 0.5, tempo: 90, danceability: 0.3 }],
  ['gloomy', { energy: 0.4, valence: 0.2, liveliness: 0.3, loudness: 0.4, tempo: 80, danceability: 0.3 }],
]);

export default moods;