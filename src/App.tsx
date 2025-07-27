import React, { useState, useEffect, useCallback } from 'react';
import { Shuffle, RotateCcw, Lightbulb, Trophy, Settings, BookOpen } from 'lucide-react';

interface WordSet {
  letters: string[];
  center: string;
  words: string[];
}

const UlciorulCuLitere: React.FC = () => {
  // Seturi de litere predefinite
  const letterSets = [
    { letters: ['A', 'S', 'T', 'R', 'I', 'N', 'E'], center: 'A', id: 1 },
    { letters: ['O', 'R', 'D', 'I', 'N', 'E', 'A'], center: 'O', id: 2 },
    { letters: ['A', 'M', 'S', 'R', 'E', 'T', 'I'], center: 'A', id: 3 },
    { letters: ['L', 'A', 'U', 'R', 'E', 'I', 'M'], center: 'L', id: 4 },
    { letters: ['C', 'A', 'R', 'T', 'E', 'I', 'N'], center: 'C', id: 5 },
    { letters: ['P', 'A', 'R', 'T', 'E', 'I', 'N'], center: 'P', id: 6 },
    { letters: ['S', 'A', 'R', 'T', 'E', 'I', 'N'], center: 'S', id: 7 },
    { letters: ['M', 'A', 'R', 'T', 'E', 'I', 'N'], center: 'M', id: 8 },
    { letters: ['T', 'A', 'R', 'E', 'I', 'N', 'S'], center: 'T', id: 9 },
    { letters: ['I', 'O', 'P', 'A', 'T', 'R', 'M'], center: 'I', id: 10 }
  ];

  const [currentSet, setCurrentSet] = useState(letterSets[0]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [withDiacritics, setWithDiacritics] = useState<boolean>(true);
  const [wordsWithDiacritics, setWordsWithDiacritics] = useState<{[key: string]: string[]}>({});
  const [wordsWithoutDiacritics, setWordsWithoutDiacritics] = useState<{[key: string]: string[]}>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Încarcă fișierele JSON
  useEffect(() => {
    const loadWordSets = async () => {
      try {
        console.log('Încărcare fișiere JSON...');
        
        // Încarcă fișierul cu diacritice (reparat)
        const responseWithDiacritics = await fetch('/ulcior_words_by_set_with_diacritics.json');
        if (!responseWithDiacritics.ok) {
          throw new Error(`HTTP error! status: ${responseWithDiacritics.status}`);
        }
        const dataWithDiacritics = await responseWithDiacritics.json();
        console.log('Fișier cu diacritice încărcat:', Object.keys(dataWithDiacritics));
        setWordsWithDiacritics(dataWithDiacritics);
        
        // Încarcă și fișierul fără diacritice pentru backup
        const responseWithoutDiacritics = await fetch('/ulcior_words_by_set.json');
        if (!responseWithoutDiacritics.ok) {
          throw new Error(`HTTP error! status: ${responseWithoutDiacritics.status}`);
        }
        const dataWithoutDiacritics = await responseWithoutDiacritics.json();
        console.log('Fișier fără diacritice încărcat:', Object.keys(dataWithoutDiacritics));
        setWordsWithoutDiacritics(dataWithoutDiacritics);
        
        console.log('Ambele dicționare încărcate cu succes!');

        setIsLoading(false);
      } catch (error) {
        console.error('Eroare la încărcarea fișierelor JSON:', error);
        setMessage('Eroare la încărcarea dicționarului de cuvinte.');
        setIsLoading(false);
      }
    };

    loadWordSets();
  }, []);

  // Funcția pentru amestecarea literelor
  const shuffleLetters = useCallback(() => {
    const letters = currentSet.letters.filter(letter => letter !== currentSet.center);
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
  }, [currentSet.letters, currentSet.center]);

  useEffect(() => {
    shuffleLetters();
  }, [currentSet, shuffleLetters]);

  // Funcție pentru a adăuga diacritice automat la cuvintele românești
  const addDiacritics = (word: string): string => {
    if (!withDiacritics) return word; // Dacă nu vrem diacritice, returnează originalul
    
    let result = word;
    
    // Transformări pentru cuvinte comune românești
    result = result.replace(/\bARTA\b/g, 'ARTĂ');
    result = result.replace(/\bARTE\b/g, 'ARTE');
    result = result.replace(/\bARTEI\b/g, 'ARTEI');
    result = result.replace(/\bARTISTA\b/g, 'ARTISTĂ');
    result = result.replace(/\bARTISTE\b/g, 'ARTISTE');
    result = result.replace(/\bARTISTI\b/g, 'ARTIȘTI');
    
    result = result.replace(/\bRATA\b/g, 'RAȚĂ');
    result = result.replace(/\bRATE\b/g, 'RAȚE');
    result = result.replace(/\bRATEI\b/g, 'RĂȚEI');
    result = result.replace(/\bRATELOR\b/g, 'RĂȚELOR');
    
    result = result.replace(/\bTARI\b/g, 'ȚĂRI');
    result = result.replace(/\bTARA\b/g, 'ȚARA');
    result = result.replace(/\bTAREI\b/g, 'ȚĂREI');
    result = result.replace(/\bTARILOR\b/g, 'ȚĂRILOR');
    
    result = result.replace(/\bSTANA\b/g, 'STÂNĂ');
    result = result.replace(/\bSTANE\b/g, 'STÂNE');
    result = result.replace(/\bSTANEI\b/g, 'STÂNEI');
    result = result.replace(/\bSTANELOR\b/g, 'STÂNELOR');
    
    result = result.replace(/\bNATIUNE\b/g, 'NAȚIUNE');
    result = result.replace(/\bNATIUNI\b/g, 'NAȚIUNI');
    result = result.replace(/\bNATIUNEI\b/g, 'NAȚIUNEI');
    result = result.replace(/\bNATIUNILOR\b/g, 'NAȚIUNILOR');
    
    result = result.replace(/\bINVATAT\b/g, 'ÎNVĂȚAT');
    result = result.replace(/\bINVATATA\b/g, 'ÎNVĂȚATĂ');
    result = result.replace(/\bINVATATE\b/g, 'ÎNVĂȚATE');
    result = result.replace(/\bINVATATI\b/g, 'ÎNVĂȚAȚI');
    
    result = result.replace(/\bSTRAIN\b/g, 'STRĂIN');
    result = result.replace(/\bSTRAINA\b/g, 'STRĂINĂ');
    result = result.replace(/\bSTRAINI\b/g, 'STRĂINI');
    result = result.replace(/\bSTRAINE\b/g, 'STRĂINE');
    
    result = result.replace(/\bANTENA\b/g, 'ANTENĂ');
    result = result.replace(/\bANTENE\b/g, 'ANTENE');
    result = result.replace(/\bANTENEI\b/g, 'ANTENEI');
    result = result.replace(/\bANTENELOR\b/g, 'ANTENELOR');
    
    result = result.replace(/\bSARIT\b/g, 'SĂRIT');
    result = result.replace(/\bSARITA\b/g, 'SĂRITĂ');
    result = result.replace(/\bSARITE\b/g, 'SĂRITE');
    result = result.replace(/\bSARITI\b/g, 'SĂRIȚI');
    
    result = result.replace(/\bFRUMOS\b/g, 'FRUMOS');
    result = result.replace(/\bFRUMOASA\b/g, 'FRUMOASĂ');
    result = result.replace(/\bFRUMOASE\b/g, 'FRUMOASE');
    
    result = result.replace(/\bTATA\b/g, 'TATĂ');
    result = result.replace(/\bTATI\b/g, 'TAȚI');
    result = result.replace(/\bTATAL\b/g, 'TATĂL');
    result = result.replace(/\bTATILOR\b/g, 'TAȚILOR');
    
    // Transformări pentru sufixe comune
    result = result.replace(/TIUNE\b/g, 'ȚIUNE');
    result = result.replace(/TIUNI\b/g, 'ȚIUNI');
    result = result.replace(/SIUNE\b/g, 'ȘIUNE');
    result = result.replace(/SIUNI\b/g, 'ȘIUNI');
    
    // Transformări pentru participle și forme verbale
    result = result.replace(/([A-Z]+)AT\b/g, (match, p1) => {
      if (p1.endsWith('S') || p1.endsWith('T')) return p1 + 'AT';
      return p1 + 'AT';
    });
    
    return result;
  };

  // Normalizează cuvântul pentru comparație (fără diacritice)
  const normalizeWord = (word: string): string => {
    const normalized = word
      .replace(/[ăâ]/gi, 'a')
      .replace(/[îí]/gi, 'i')
      .replace(/[șş]/gi, 's')
      .replace(/[țţ]/gi, 't')
      .toUpperCase();
    
    return normalized;
  };

  // Găsește cuvântul original din JSON bazat pe forma normalizată
  const findOriginalWord = (normalizedWord: string): string | null => {
    const setId = currentSet.id.toString();
    const currentWords = withDiacritics ? 
      wordsWithDiacritics[setId] || [] : 
      wordsWithoutDiacritics[setId] || [];

    console.log(`Căutare în setul "${setId}": "${normalizedWord}" în ${currentWords.length} cuvinte, cu diacritice: ${withDiacritics}`);
    
    // Caută prin normalizare - compară fiecare cuvânt din JSON
    for (const word of currentWords) {
      const normalizedJsonWord = normalizeWord(word);
      if (normalizedJsonWord === normalizedWord) {
        console.log(`Găsit match: "${normalizedWord}" → "${word}"`);
        return word; // Returnează cuvântul din JSON (deja cu diacritice dacă e cazul)
      }
    }

    console.log(`Nu s-a găsit match pentru: "${normalizedWord}"`);
    return null;
  };

  const handleLetterClick = (letter: string) => {
    setCurrentWord(prev => prev + letter);
  };

  const clearWord = () => {
    setCurrentWord('');
    setMessage('');
  };

  const deleteLastLetter = () => {
    setCurrentWord(prev => prev.slice(0, -1));
  };

  const submitWord = () => {
    const word = currentWord.toUpperCase();
    const normalizedInput = normalizeWord(word);
    
    if (word.length < 4) {
      setMessage('Cuvântul trebuie să aibă minim 4 litere!');
      return;
    }

    if (!normalizedInput.includes(currentSet.center)) {
      setMessage(`Cuvântul trebuie să conțină litera ${currentSet.center}!`);
      return;
    }

    // Găsește cuvântul original din JSON
    const originalWord = findOriginalWord(normalizedInput);
    
    if (!originalWord) {
      setMessage(`"${word}" nu este în dicționarul nostru.`);
      return;
    }

    if (foundWords.includes(originalWord)) {
      setMessage('Ai găsit deja acest cuvânt!');
      return;
    }

    // Verifică dacă poate forma cuvântul cu literele disponibile
    const letterCount: { [key: string]: number } = {};
    const availableCount: { [key: string]: number } = {};
    
    currentSet.letters.forEach(letter => {
      availableCount[letter] = (availableCount[letter] || 0) + 1;
    });
    
    let canFormWord = true;
    for (let letter of normalizedInput) {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
      if (!availableCount[letter] || letterCount[letter] > availableCount[letter]) {
        canFormWord = false;
        break;
      }
    }
    
    if (!canFormWord) {
      setMessage('Folosești litere care nu sunt disponibile!');
      return;
    }

    // Adaugă cuvântul ORIGINAL din JSON în lista de cuvinte găsite
    console.log(`Cuvânt găsit - Input: "${word}", Din JSON: "${originalWord}"`);
    
    setFoundWords(prev => [...prev, originalWord]);
    setScore(prev => prev + originalWord.length);
    setMessage(`Bravo! Ai găsit "${originalWord}"! (+${originalWord.length} puncte)`);
    setCurrentWord('');
  };

  const newGame = () => {
    const randomSet = letterSets[Math.floor(Math.random() * letterSets.length)];
    setCurrentSet(randomSet);
    setFoundWords([]);
    setCurrentWord('');
    setMessage('');
    setScore(0);
  };

  const switchSet = (direction: 'prev' | 'next') => {
    const currentIndex = letterSets.findIndex(set => set.id === currentSet.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : letterSets.length - 1;
    } else {
      newIndex = currentIndex < letterSets.length - 1 ? currentIndex + 1 : 0;
    }
    
    setCurrentSet(letterSets[newIndex]);
    setFoundWords([]);
    setCurrentWord('');
    setMessage('');
    setScore(0);
  };

  const toggleDiacritics = () => {
    setWithDiacritics(prev => !prev);
    setFoundWords([]);  // Resetează cuvintele găsite când schimbi modul
    setCurrentWord('');
    setMessage('');
  };

  const getCurrentWords = () => {
    const words = withDiacritics ? 
      wordsWithDiacritics[currentSet.id] || [] : 
      wordsWithoutDiacritics[currentSet.id] || [];
    
    console.log(`Set ${currentSet.id}, cu diacritice: ${withDiacritics}, cuvinte găsite:`, words.length);
    return words;
  };

  const totalWords = getCurrentWords().length;
  const progress = totalWords > 0 ? (foundWords.length / totalWords) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏺</div>
          <div className="text-xl text-gray-600">Se încarcă dicționarul...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-yellow-200">
          
          <div className="flex justify-center mb-4">
            <div className="text-2xl">🌻 🏺 🌻</div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🏺 Ulciorul cu Litere</h1>
            <p className="text-sm text-gray-600 mb-4 italic">Jocul tradițional românesc de cuvinte</p>
            
            {/* Toggle pentru diacritice */}
            <div className="flex justify-center mb-4">
              <button
                onClick={toggleDiacritics}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  withDiacritics 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {withDiacritics ? 'Cu diacritice' : 'Fără diacritice'}
              </button>
            </div>

            <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mb-2">
              <button onClick={() => switchSet('prev')} className="p-1 hover:bg-gray-100 rounded">◀</button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  <span>Punctaj: {score}</span>
                </div>
                <div>Set {currentSet.id}/10</div>
                <div>Cuvinte: {foundWords.length}/{totalWords}</div>
              </div>
              <button onClick={() => switchSet('next')} className="p-1 hover:bg-gray-100 rounded">▶</button>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-center mb-12">
            <div className="relative w-40 h-40">
              <button
                onClick={() => handleLetterClick(currentSet.center)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-2xl font-bold text-gray-800 transition-colors shadow-lg z-10"
              >
                {currentSet.center}
              </button>
              
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
            
            {message && (
              <div className={`p-3 rounded-lg text-sm font-medium ${
                message.includes('Bravo') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </div>

          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={deleteLastLetter}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Șterge
            </button>
            <button
              onClick={clearWord}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Curăță
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

          {foundWords.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Cuvinte găsite:</h3>
              <div className="flex flex-wrap gap-2">
                {foundWords.map((word, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <button
              onClick={newGame}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              Joc Nou
            </button>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              🏺 Cum să joci Ulciorul cu Litere:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Formează cuvinte cu literele din ulcior</li>
              <li>• Litera aurită (centrală) trebuie să apară în toate cuvintele</li>
              <li>• Cuvintele trebuie să aibă minim 4 litere</li>
              <li>• Poți folosi aceleași litere de mai multe ori dacă sunt disponibile</li>
              <li>• Folosește butonul pentru a comuta între cu/fără diacritice</li>
              <li>• Găsește toate cuvintele pentru a umple ulciorul! 🌻</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UlciorulCuLitere;