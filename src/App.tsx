import React, { useState, useEffect } from 'react';
import { Shuffle, Trophy, RotateCcw } from 'lucide-react';

interface LetterSet {
  letters: string[];
  center: string;
  id: number;
}

const UlciorulCuLitere: React.FC = () => {
  const letterSets: LetterSet[] = [
    { letters: ['A', 'R', 'E', 'S', 'T', 'I', 'N'], center: 'A', id: 1 },
    { letters: ['O', 'R', 'D', 'I', 'N', 'E', 'A'], center: 'O', id: 2 },
    { letters: ['A', 'M', 'S', 'R', 'E', 'T', 'I'], center: 'A', id: 3 }
  ];

  const wordDictionary: { [key: number]: string[] } = {
    1: [
      'ARTA', 'ARTEI', 'ARTE', 'ARTELOR',
      'AREA', 'AREEI', 'AREE', 'AREELOR', 
      'RATA', 'RATEI', 'RATE', 'RATELOR',
      'SARE', 'SARII', 'SARI', 'SARILOR',
      'STARE', 'STARII', 'STARI', 'STARILOR',
      'REAL', 'REALA', 'REALE', 'REALI',
      'TARE', 'TARI', 'TAREI', 'TARILOR',
      'ANTE', 'ANTEI', 'ANTELOR',
      'RASE', 'RASA', 'RASI', 'RASELOR',
      'ARIDE', 'ARIDA', 'ARIDEI', 'ARIDELOR',
      'ARSI', 'ARS', 'ARSA', 'ARSE', 'ARSULUI',
      'SARIT', 'SARITA', 'SARITE', 'SARITI',
      'STRAIN', 'STRAINA', 'STRAINE', 'STRAINI',
      'SATIRE', 'SATIREI', 'SATIRI', 'SATIRILOR'
    ],
    2: [
      'ORDIN', 'ORDINE', 'ORDINI', 'ORDINII',
      'RODA', 'RODE', 'RODEI', 'RODELOR',
      'NORD', 'NORDURI', 'NORDULUI',
      'RADIO', 'RADIOURI', 'RADIOULUI',
      'NORI', 'NOR', 'NORILOR', 'NORULUI',
      'NORA', 'NORE', 'NOREI', 'NORELOR',
      'RODIE', 'RODII', 'RODIEI', 'RODIILOR',
      'DRONA', 'DRONE', 'DRONEI', 'DRONELOR',
      'DONA', 'DONEAZA', 'DONAM', 'DONATI',
      'ADORN', 'ADORNI', 'ADORNA', 'ADORNAM',
      'ARDEI', 'ARDEII', 'ARDEIULUI'
    ],
    3: [
      'MARS', 'MARSE', 'MARSULUI',
      'MASE', 'MASA', 'MASELOR', 'MASEI',
      'MARE', 'MARI', 'MARII', 'MARILOR',
      'MARIT', 'MARITA', 'MARITE', 'MARITI',
      'RAME', 'RAMA', 'RAMEI', 'RAMELOR',
      'ARME', 'ARMA', 'ARMEI', 'ARMELOR',
      'TRAM', 'TRAME', 'TRAMEI', 'TRAMELOR',
      'MASTER', 'MASTERI', 'MASTERULUI',
      'MARTE', 'MARTEI', 'MARTI', 'MARTILOR',
      'RESTE', 'RESTEI', 'RESTI', 'RESTELOR'
    ]
  };

  const [currentSet, setCurrentSet] = useState<LetterSet>(letterSets[0]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);

  useEffect(() => {
    shuffleLetters();
  }, [currentSet]);

  const shuffleLetters = () => {
    const letters = currentSet.letters.filter(letter => letter !== currentSet.center);
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
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
    const validWords = wordDictionary[currentSet.id] || [];
    
    if (word.length < 4) {
      setMessage('Cuvântul trebuie să aibă minim 4 litere!');
      return;
    }

    if (!word.includes(currentSet.center)) {
      setMessage(`Cuvântul trebuie să conțină litera ${currentSet.center}!`);
      return;
    }

    if (foundWords.includes(word)) {
      setMessage('Ai găsit deja acest cuvânt!');
      return;
    }

    const letterCount: { [key: string]: number } = {};
    const availableCount: { [key: string]: number } = {};
    
    currentSet.letters.forEach(letter => {
      availableCount[letter] = (availableCount[letter] || 0) + 1;
    });
    
    let canFormWord = true;
    for (let letter of word) {
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

    if (validWords.includes(word)) {
      setFoundWords(prev => [...prev, word]);
      setScore(prev => prev + word.length);
      setMessage(`Bravo! Ai găsit "${word}"! (+${word.length} puncte)`);
      setCurrentWord('');
    } else {
      setMessage(`"${word}" nu este în dicționarul nostru.`);
    }
  };

  const newGame = () => {
    const randomSet = letterSets[Math.floor(Math.random() * letterSets.length)];
    setCurrentSet(randomSet);
    setFoundWords([]);
    setCurrentWord('');
    setMessage('');
    setScore(0);
  };

  const totalWords = wordDictionary[currentSet.id]?.length || 0;
  const progress = totalWords > 0 ? (foundWords.length / totalWords) * 100 : 0;

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
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>Punctaj: {score}</span>
              </div>
              <div>Cuvinte găsite: {foundWords.length}/{totalWords}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
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
              <li>• Găsește toate cuvintele pentru a umple ulciorul! 🌻</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UlciorulCuLitere;