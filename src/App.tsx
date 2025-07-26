import React, { useState, useEffect, useCallback } from 'react';
import { Shuffle, Trophy, RotateCcw, Settings } from 'lucide-react';

interface LetterSet {
  letters: string[];
  center: string;
  id: number;
}

interface DailyStats {
  [date: string]: number;
}

// Funcție pentru normalizarea textului (elimină diacriticele)
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[ĂÂÎȘȚ]/g, l => ({ Ă: 'A', Â: 'A', Î: 'I', Ș: 'S', Ț: 'T' }[l] || l))
    .replace(/[ăâîșț]/g, l => ({ ă: 'a', â: 'a', î: 'i', ș: 's', ț: 't' }[l] || l));

const UlciorulCuLitere = () => {
  // State declarations
  const [letterSets, setLetterSets] = useState<LetterSet[]>([]);
  const [currentSet, setCurrentSet] = useState<LetterSet | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats>({});
  const [pangrams, setPangrams] = useState<string[]>([]);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [diacriticsOn, setDiacriticsOn] = useState<boolean>(true);
  const [wordDictionary, setWordDictionary] = useState<{ [key: number]: string[] }>({});
  const [totalPangrams, setTotalPangrams] = useState<number>(0);

  const getCurrentDate = (): string => new Date().toISOString().split('T')[0];

  // ✅ PWA Service Worker Registration
  useEffect(() => {
    // Register Service Worker pentru PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('✅ SW registered: ', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('🔄 New content available, reload to update');
                    // Optionally show update notification
                    setMessage('📱 Versiune nouă disponibilă! Reîncărcați pagina.');
                    setTimeout(() => setMessage(''), 5000);
                  }
                });
              }
            });
          })
          .catch((registrationError) => {
            console.log('❌ SW registration failed: ', registrationError);
          });
      });
    }

    // Optimize pentru mobile
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }

    // Prevent default touch behaviors pe mobile
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent pinch zoom
      }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault(); // Prevent double-tap zoom
      }
      lastTouchEnd = now;
    }, false);

  }, []);

  // Calculează pangrame când se schimbă setul sau dicționarul
  useEffect(() => {
    if (currentSet && wordDictionary[currentSet.id]) {
      const pangramCount = wordDictionary[currentSet.id].filter(word => isPangram(word)).length;
      setTotalPangrams(pangramCount);
      console.log(`📊 Set ${currentSet.id}: ${pangramCount} pangrame din ${wordDictionary[currentSet.id].length} cuvinte`);
    } else {
      setTotalPangrams(0);
    }
  }, [currentSet, wordDictionary]);

  // Inițializare seturi de litere - 10 seturi complete
  useEffect(() => {
    const sets: LetterSet[] = [
      { letters: ['A', 'R', 'E', 'S', 'T', 'I', 'N'], center: 'A', id: 1 },
      { letters: ['O', 'R', 'D', 'I', 'N', 'E', 'A'], center: 'O', id: 2 },
      { letters: ['A', 'M', 'S', 'R', 'E', 'T', 'I'], center: 'A', id: 3 },
      { letters: ['E', 'L', 'U', 'M', 'A', 'R', 'I'], center: 'E', id: 4 },
      { letters: ['I', 'N', 'F', 'O', 'R', 'M', 'A'], center: 'I', id: 5 },
      { letters: ['U', 'N', 'D', 'E', 'V', 'A', 'R'], center: 'U', id: 6 },
      { letters: ['O', 'P', 'T', 'I', 'U', 'N', 'E'], center: 'O', id: 7 },
      { letters: ['A', 'B', 'S', 'O', 'L', 'U', 'T'], center: 'A', id: 8 },
      { letters: ['E', 'X', 'P', 'L', 'I', 'C', 'A'], center: 'E', id: 9 },
      { letters: ['I', 'M', 'P', 'O', 'R', 'T', 'A'], center: 'I', id: 10 }
    ];
    setLetterSets(sets);
    if (!currentSet) {
      setCurrentSet(sets[0]);
    }
  }, [currentSet]);

  // Încărcare statistici din localStorage
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem('ulciorul-daily-stats');
      if (savedStats) {
        setDailyStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.log('Eroare încărcare:', error);
    }
  }, []);

  // Încărcare dicționar din fișiere JSON
  useEffect(() => {
    const loadWords = async () => {
      try {
        const file = diacriticsOn
          ? '/ulcior_words_by_set_with_diacritics.json'
          : '/ulcior_words_by_set.json';
        console.log('🔄 Încarcă fișierul:', file);
        const response = await fetch(file);
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Dicționar încărcat cu succes!');
          console.log('📊 Seturi disponibile:', Object.keys(data));
          console.log('📝 Total cuvinte set 1:', data['1']?.length || 0);
          setWordDictionary(data);
          setMessage(`✅ Dicționar cu${diacriticsOn ? '' : ' fără'} diacritice încărcat!`);
        } else {
          console.log('⚠️ Fișierul nu există, folosind dicționar de rezervă');
          // Fallback cu dicționar basic dacă JSON-ul nu există
          const fallbackDictionary = {
            1: ['ARTA', 'ARTEI', 'ARTE', 'AREA', 'RATA', 'SARE', 'STARE', 'TARE', 'REAL', 'STRAIN'],
            2: ['ORDIN', 'RODA', 'NORD', 'RADIO', 'NORI', 'NORA', 'RODIE', 'ARDEI'],
            3: ['MARS', 'MASA', 'MARE', 'RAMA', 'ARMA', 'TRAM', 'MASTER', 'MARTE'],
            4: ['LUME', 'LUMEA', 'LUMEI', 'MARE', 'REAL', 'EMAIL', 'ARME'],
            5: ['INFO', 'FIRMA', 'FORMA', 'NORMA', 'MINOR'],
            6: ['UNDE', 'DUNE', 'RUDE', 'VARU', 'NUDE'],
            7: ['OPTIU', 'UNITE', 'NOTER', 'POINT', 'TUNET'],
            8: ['ABSOLUT', 'ATLAS', 'TABLA', 'BATAL', 'LOSTU'],
            9: ['EXPLICA', 'PACE', 'PLACE', 'ALEX'],
            10: ['IMPORT', 'PRIMA', 'TROMP', 'OPRIT']
          };
          setWordDictionary(fallbackDictionary);
          setMessage('⚠️ Dicționar de rezervă încărcat.');
        }
        setTimeout(() => setMessage(''), 4000);
      } catch (e) {
        console.error('❌ Eroare la încărcarea cuvintelor:', e);
        // Fallback cu dicționar basic în caz de eroare
        const fallbackDictionary = {
          1: ['ARTA', 'ARTEI', 'ARTE', 'AREA', 'RATA', 'SARE', 'STARE', 'TARE', 'REAL', 'STRAIN'],
          2: ['ORDIN', 'RODA', 'NORD', 'RADIO', 'NORI', 'NORA', 'RODIE', 'ARDEI'],
          3: ['MARS', 'MASA', 'MARE', 'RAMA', 'ARMA', 'TRAM', 'MASTER', 'MARTE'],
          4: ['LUME', 'LUMEA', 'LUMEI', 'MARE', 'REAL', 'EMAIL', 'ARME'],
          5: ['INFO', 'FIRMA', 'FORMA', 'NORMA', 'MINOR'],
          6: ['UNDE', 'DUNE', 'RUDE', 'VARU', 'NUDE'],
          7: ['OPTIU', 'UNITE', 'NOTER', 'POINT', 'TUNET'],
          8: ['ABSOLUT', 'ATLAS', 'TABLA', 'BATAL', 'LOSTU'],
          9: ['EXPLICA', 'PACE', 'PLACE', 'ALEX'],
          10: ['IMPORT', 'PRIMA', 'TROMP', 'OPRIT']
        };
        setWordDictionary(fallbackDictionary);
        setMessage('❌ Dicționar de rezervă încărcat (eroare la JSON).');
        setTimeout(() => setMessage(''), 4000);
      }
    };
    loadWords();
  }, [diacriticsOn]);

  // Amestecă literele din jurul centrului
  const shuffleLetters = useCallback(() => {
    if (!currentSet) return;
    const letters = currentSet.letters.filter(letter => letter !== currentSet.center);
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
  }, [currentSet]);

  useEffect(() => {
    shuffleLetters();
  }, [currentSet, shuffleLetters]);

  // Verifică dacă este pangram (folosește toate literele)
  const isPangram = (word: string): boolean => {
    if (!currentSet) return false;
    const wordLetters = new Set(normalize(word.toUpperCase()));
    const setLetters = new Set(currentSet.letters.map(l => normalize(l.toUpperCase())));
    return Array.from(setLetters).every(letter => wordLetters.has(letter));
  };

  // Calculează punctajul pentru un cuvânt
  const calculateWordScore = (word: string): number => {
    let baseScore = word.length;
    if (word.length >= 7) baseScore += 3; // Bonus pentru cuvinte lungi
    if (word.length >= 9) baseScore += 5; // Bonus extra pentru cuvinte foarte lungi
    
    if (isPangram(word)) {
      baseScore += 10; // Bonus pangram
    }
    
    return baseScore;
  };

  // Salvează statisticile zilnice
  const saveDailyStats = (newScore: number): void => {
    try {
      const today = getCurrentDate();
      const savedStats = localStorage.getItem('ulciorul-daily-stats');
      const stats: DailyStats = savedStats ? JSON.parse(savedStats) : {};
      stats[today] = (stats[today] || 0) + newScore;
      localStorage.setItem('ulciorul-daily-stats', JSON.stringify(stats));
      setDailyStats(stats);
    } catch (error) {
      console.log('Eroare salvare:', error);
    }
  };

  const handleLetterClick = (letter: string): void => {
    setCurrentWord(prev => prev + letter);
    setMessage('');
  };

  const deleteLastLetter = (): void => {
    setCurrentWord(prev => prev.slice(0, -1));
  };

  const submitWord = (): void => {
    if (!currentSet) return;
    const word = currentWord.trim();
    const validWords = wordDictionary[currentSet.id] || [];
    const comparator = diacriticsOn ? (w: string) => w : (w: string) => normalize(w);

    if (word.length < 4) {
      setMessage('Cuvântul trebuie să aibă minim 4 litere!');
    } else if (!comparator(word).includes(comparator(currentSet.center))) {
      setMessage(`Cuvântul trebuie să conțină litera ${currentSet.center}!`);
    } else if (foundWords.some(w => comparator(w) === comparator(word))) {
      setMessage('Ai găsit deja acest cuvânt!');
    } else {
      // Verifică dacă poate forma cuvântul cu literele disponibile (folosire infinită)
      const wordLetters = comparator(word.toUpperCase()).split('');
      const availableLetters = currentSet.letters.map(l => comparator(l.toUpperCase()));
      
      const canForm = wordLetters.every(letter => availableLetters.includes(letter));

      if (!canForm) {
        setMessage('Folosești litere care nu sunt disponibile!');
      } else if (validWords.some(w => comparator(w) === comparator(word))) {
        const wordScore = calculateWordScore(word);
        const pangram = isPangram(word);

        setFoundWords(prev => [...prev, word]);
        setScore(prev => prev + wordScore);
        saveDailyStats(wordScore);

        if (pangram) setPangrams(prev => [...prev, word]);

        setMessage(pangram ? `🎉 PANGRAM! ${word} (+${wordScore})` : `Bravo! Ai găsit: ${word} (+${wordScore})`);
      } else {
        setMessage(`„${word}" nu este în dicționarul nostru.`);
      }
    }

    setCurrentWord('');
    setTimeout(() => setMessage(''), 3000);
  };

  const newGame = (): void => {
    if (letterSets.length > 0) {
      const randomSet = letterSets[Math.floor(Math.random() * letterSets.length)];
      setCurrentSet(randomSet);
      setFoundWords([]);
      setCurrentWord('');
      setMessage('');
      setScore(0);
      setPangrams([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitWord();
    } else if (e.key === 'Backspace') {
      deleteLastLetter();
    }
  };

  const todayScore = dailyStats[getCurrentDate()] || 0;
  const totalDays = Object.keys(dailyStats).length;
  const totalWords = currentSet ? (wordDictionary[currentSet.id]?.length || 0) : 0;

  // Loading state - se afișează doar când letterSets nu s-au încărcat încă
  if (letterSets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-yellow-200">
            <div className="text-center">
              <div className="text-2xl mb-4">🌻 🏺 🌻</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">🏺 Ulciorul cu Litere</h1>
              <p className="text-gray-600">Se încarcă jocul...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50 p-6" onKeyDown={handleKeyPress} tabIndex={0}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-yellow-200">
          {/* Header decorativ */}
          <div className="flex justify-center mb-4">
            <div className="text-2xl">🌻 🏺 🌻</div>
          </div>

          {/* Titlu și informații de bază */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🏺 Ulciorul cu Litere</h1>
            <p className="text-sm text-gray-600 mb-4 italic">Jocul tradițional românesc de cuvinte</p>

            {/* Dashboard principal */}
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-bold">Punctaj: {score}</span>
              </div>
              <div>Set: {currentSet?.id || 1}/10</div>
              <div>Cuvinte: {foundWords.length}/{totalWords}</div>
            </div>

            {/* Bara de progres pentru cuvinte */}
            <div className="mb-4">
              <div className="bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                <div 
                  className="bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 h-2 rounded-full transition-all duration-500 ease-in-out"
                  style={{ 
                    width: totalWords > 0 ? `${Math.min((foundWords.length / totalWords) * 100, 100)}%` : '0%' 
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                {foundWords.length > 0 && totalWords > 0 && 
                  `${Math.round((foundWords.length / totalWords) * 100)}% din cuvinte găsite`
                }
              </div>
            </div>

            {/* Pangrame și progres */}
            <div className="text-sm text-amber-600 mb-2">
              <span className="font-bold">🎯 Pangrame: {pangrams.length}/{totalPangrams}</span>
            </div>

            {/* Statistici și setări */}
            <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
              <span>Astăzi: {todayScore} puncte</span>
              <span>Zile: {totalDays}</span>
              <button onClick={() => setShowStats(!showStats)} className="text-blue-500 hover:text-blue-700 underline">
                {showStats ? 'Ascunde' : 'Statistici'}
              </button>
              <label className="flex items-center gap-1">
                <input 
                  type="checkbox" 
                  checked={diacriticsOn} 
                  onChange={() => setDiacriticsOn(prev => !prev)} 
                  className="w-3 h-3" 
                />
                <span>Diacritice</span>
              </label>
            </div>

            {/* Statistici detaliate */}
            {showStats && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Statistici</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>Total puncte toate zilele: {Object.values(dailyStats).reduce((a, b) => a + b, 0)}</div>
                  <div>Media pe zi: {totalDays > 0 ? Math.round(Object.values(dailyStats).reduce((a, b) => a + b, 0) / totalDays) : 0}</div>
                  <div>Cea mai bună zi: {Math.max(...Object.values(dailyStats), 0)} puncte</div>
                </div>
              </div>
            )}
          </div>

          {/* Hexagonul cu litere - DESIGN ORIGINAL PĂSTRAT */}
          <div className="flex justify-center mb-12">
            <div className="relative w-40 h-40">
              {/* Litera centrală */}
              {currentSet && (
                <button
                  onClick={() => handleLetterClick(currentSet.center)}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-2xl font-bold text-gray-800 transition-colors shadow-lg z-10"
                >
                  {currentSet.center}
                </button>
              )}
              
              {/* Literele din jur */}
              {shuffledLetters.map((letter, index) => {
                const angle = (index * 60) * (Math.PI / 180);
                const radius = 70;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <button
                    key={index}
                    onClick={() => handleLetterClick(letter)}
                    className="absolute w-14 h-14 bg-gray-200 hover:bg-gray-300 rounded-lg text-xl font-bold text-gray-800 transition-colors shadow-md"
                    style={{ 
                      left: `calc(50% + ${x}px - 28px)`, 
                      top: `calc(50% + ${y}px - 28px)` 
                    }}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input pentru cuvânt */}
          <div className="text-center mb-6">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <input
                type="text"
                value={currentWord}
                readOnly
                className="text-2xl font-mono text-center bg-transparent border-none outline-none w-full"
                placeholder="Scrie cuvântul aici..."
              />
            </div>
            
            {/* Mesaje */}
            {message && (
              <div className={`p-3 rounded-lg text-sm font-medium ${
                message.includes('Bravo') || message.includes('🎉') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* Butoane de control */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <button 
              onClick={deleteLastLetter} 
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Șterge
            </button>
            <button 
              onClick={submitWord} 
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Trimite
            </button>
            <button 
              onClick={shuffleLetters} 
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>

          {/* Cuvinte găsite */}
          {foundWords.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Cuvinte găsite:</h3>
              <div className="flex flex-wrap gap-2">
                {foundWords.map((word, index) => {
                  const isWordPangram = isPangram(word);
                  return (
                    <span 
                      key={index} 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isWordPangram 
                          ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400 font-bold' 
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {word}{isWordPangram && ' 🎯'}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Joc nou */}
          <div className="text-center mb-6">
            <button 
              onClick={newGame} 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              Joc Nou
            </button>
          </div>

          {/* Instrucțiuni */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">🏺 Cum să joci:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Formează cuvinte cu literele din ulcior</li>
              <li>• Litera aurită trebuie să apară în toate cuvintele</li>
              <li>• Cuvintele trebuie să aibă minim 4 litere</li>
              <li>• <strong>📊 Punctaj:</strong> 1 punct per literă + bonus pentru cuvinte lungi</li>
              <li>• <strong>🎯 PANGRAM:</strong> Folosește toate literele (+10 bonus total!)</li>
              <li>• Găsește toate cuvintele pentru a umple ulciorul! 🌻</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UlciorulCuLitere;