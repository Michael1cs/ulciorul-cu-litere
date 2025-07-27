import React, { useState, useEffect, useCallback } from 'react';
import { Shuffle, RotateCcw, Trophy, Lightbulb, BookOpen } from 'lucide-react';

export default function UlciorulCuLitere() {
  const letterSets = [
    { letters: ['A', 'S', 'T', 'R', 'I', 'N', 'E'], center: 'A', id: 1 },
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

  const wordsData = {
    "1": ["ARTA", "ARTEI", "ARTE", "ARTELOR", "ARTISTA", "ARTISTE", "ARTISTI", "AREA", "AREE", "AREEI", "AREELOR", "RATA", "RATE", "RATEI", "RATELOR", "SARE", "SARII", "SARI", "SARILOR", "STARE", "STARI", "STARII", "STARILOR", "REAL", "REALA", "REALE", "REALI", "TARE", "TARI", "TAREI", "TARILOR", "ANTE", "ANTENE", "ANTENA", "ANTENEI", "STRAIN", "STRAINA", "STRAINI", "STRAINE", "SARIT", "SARITA", "SARITE", "SARITI", "NATIUNE", "NATIUNI", "NATIUNEI", "NATIUNILOR", "STANA", "STANE", "STANEI", "STANELOR", "TATA", "TATI", "TATAL", "TATILOR"],
    "2": ["ORDIN", "ORDINE", "ORDINI", "ORDINII", "ORDINALE", "RODA", "RODE", "RODEI", "RODELOR", "NORD", "NORDURI", "NORDULUI", "RADIO", "RADIOURI", "RADIOULUI", "NORI", "NOR", "NORILOR", "NORULUI", "NORA", "NORE", "NOREI", "NORELOR", "RODIE", "RODII", "RODIEI", "DRONA", "DRONE", "DRONEI", "DRONELOR", "DONA", "DONEAZA", "DONAM", "ADORN", "ADORNI", "ADORNA", "ADORNAM"],
    "3": ["MARS", "MARSE", "MARSULUI", "MASA", "MASE", "MASELOR", "MASEI", "MARE", "MARI", "MARII", "MARILOR", "MARIT", "MARITA", "MARITE", "MARITI", "MARIRE", "MARIREA", "MARIRI", "MARIRILOR", "RAME", "RAMA", "RAMEI", "RAMELOR", "ARME", "ARMA", "ARMEI", "ARMELOR", "ARMAT", "ARMATA", "ARMATE", "ARMATI", "TRAM", "TRAME", "TRAMEI", "TRAMELOR", "MASTER", "MASTERI", "MASTERULUI", "MARTE", "MARTEI", "MARTI", "MARTILOR", "RESTE", "RESTEI", "RESTI", "RESTELOR"],
    "4": ["LUME", "LUMEI", "LUMEA", "LUMILOR", "MERE", "MARUL", "MERELE", "MERELOR", "REAL", "REALA", "REALE", "REALI", "MARE", "MARI", "MARII", "MARILOR", "RAME", "RAMA", "RAMEI", "RAMELOR", "ARME", "ARMA", "ARMEI", "ARMELOR", "MILE", "MILA", "MILEI", "MILELOR", "RIME", "RIMA", "RIMEI", "RIMELOR"],
    "5": ["INFO", "INFORMA", "INFORMARI", "INFORMATIA", "FIRMA", "FIRME", "FIRMEI", "FORMA", "FORME", "FORMEI", "FORMELOR", "NORMA", "NORME", "NORMEI", "RIMA", "RIME", "RIMEI", "ARMA", "ARME", "ARMEI", "ARMELOR", "MIRARE", "MIRAREA", "MIRATE"],
    "6": ["UNDE", "UNDEI", "UNDELE", "UNDELOR", "DUNE", "DUNEI", "DUNELE", "RUDE", "RUDEI", "RUDELE", "RUDELOR", "VERDE", "VERZI", "VERZII", "VARU", "VERI", "NARAV", "NARAVURI"],
    "7": ["OPTIUNE", "OPTIUNI", "OPTIUNEI", "OPTIUNILOR", "UNITE", "UNITEI", "UNITELE", "PUNCT", "PUNCTE", "PUNCTUL", "TUNET", "TUNETE", "POTUN", "POTUNI"],
    "8": ["ABSOLUT", "ABSOLUTA", "ABSOLUTE", "ATLAS", "ATLASUL", "LOTUS", "LOTUSUL", "SLAB", "SLABA", "SLABI", "TABLA", "TABLE", "TABLEI", "TABU"],
    "9": ["EXPLIC", "EXPLICAM", "EXPLICATI", "EXPLICAT", "PACE", "PACEI", "PACEA", "ALEX", "PLACE", "PLACEI", "PLACEA", "PLICA"],
    "10": ["IMPORT", "IMPORTA", "IMPORTAM", "IMPORTATI", "IMPORTAT", "PRIMI", "PRIMII", "OPRIT", "OPRITA", "PROMPT", "PRIMAR"]
  };

  const [currentSet, setCurrentSet] = useState(letterSets[0]);
  const [foundWords, setFoundWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [withDiacritics, setWithDiacritics] = useState(false);

  const shuffleLetters = useCallback(() => {
    const letters = currentSet.letters.filter(letter => letter !== currentSet.center);
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
  }, [currentSet.letters, currentSet.center]);

  useEffect(() => {
    shuffleLetters();
  }, [currentSet, shuffleLetters]);

  const addSimpleDiacritics = (word) => {
    if (!withDiacritics) return word;
    
    return word
      .replace(/\bARTA\b/g, 'ARTĂ')
      .replace(/\bRATA\b/g, 'RAȚĂ')
      .replace(/\bTARI\b/g, 'ȚĂRI')
      .replace(/\bTARA\b/g, 'ȚARĂ')
      .replace(/\bSTANA\b/g, 'STÂNĂ')
      .replace(/\bNATIUNE\b/g, 'NAȚIUNE')
      .replace(/\bTATA\b/g, 'TATĂ');
  };

  const handleLetterClick = (letter) => {
    setCurrentWord(prev => prev + letter);
    setMessage('');
  };

  const clearWord = () => {
    setCurrentWord('');
    setMessage('');
  };

  const deleteLastLetter = () => {
    setCurrentWord(prev => prev.slice(0, -1));
    setMessage('');
  };

  const submitWord = () => {
    const word = currentWord.toUpperCase();
    const setId = currentSet.id.toString();
    const availableWords = wordsData[setId] || [];
    
    if (word.length < 4) {
      setMessage('Cuvântul trebuie să aibă minim 4 litere!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (!word.includes(currentSet.center)) {
      setMessage(`Cuvântul trebuie să conțină litera ${currentSet.center}!`);
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    let canFormWord = true;
    for (let letter of word) {
      if (!currentSet.letters.includes(letter)) {
        canFormWord = false;
        break;
      }
    }
    
    if (!canFormWord) {
      setMessage('Folosești litere care nu sunt disponibile!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (availableWords.includes(word)) {
      const displayWord = addSimpleDiacritics(word);
      
      if (foundWords.includes(displayWord)) {
        setMessage('Ai găsit deja acest cuvânt!');
        setTimeout(() => setMessage(''), 2000);
        return;
      }

      setFoundWords(prev => [...prev, displayWord]);
      setScore(prev => prev + displayWord.length);
      setMessage(`Bravo! Ai găsit "${displayWord}"! (+${displayWord.length} puncte)`);
      setCurrentWord('');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`"${word}" nu este în dicționarul nostru.`);
      setTimeout(() => setMessage(''), 2000);
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

  const switchSet = (direction) => {
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
    setFoundWords(prev => prev.map(word => 
      withDiacritics ? 
        word.replace(/[ĂÂ]/g, 'A').replace(/[ÎÍ]/g, 'I').replace(/[ȘŞ]/g, 'S').replace(/[ȚŢ]/g, 'T') :
        addSimpleDiacritics(word)
    ));
  };

  const totalWords = wordsData[currentSet.id.toString()]?.length || 0;
  const progress = totalWords > 0 ? (foundWords.length / totalWords) * 100 : 0;
  
  const pangrams = foundWords.filter(word => {
    const wordLetters = new Set(word.replace(/[ĂÂ]/g, 'A').replace(/[ÎÍ]/g, 'I').replace(/[ȘŞ]/g, 'S').replace(/[ȚŢ]/g, 'T').split(''));
    return currentSet.letters.every(letter => wordLetters.has(letter));
  });

  const maxPangrams = wordsData[currentSet.id.toString()]?.filter(word => {
    const wordLetters = new Set(word.split(''));
    return currentSet.letters.every(letter => wordLetters.has(letter));
  }).length || 0;

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
            
            <div className="flex justify-center mb-4">
              <button
                onClick={toggleDiacritics}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  withDiacritics 
                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {withDiacritics ? '✨ Cu diacritice' : '📝 Fără diacritice'}
              </button>
            </div>
            
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mb-4">
              <button onClick={() => switchSet('prev')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">◀</button>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span>Punctaj: {score}</span>
                </div>
                <div>Set: {currentSet.id}/10</div>
                <div>Cuvinte: {foundWords.length}/{totalWords}</div>
              </div>
              <button onClick={() => switchSet('next')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">▶</button>
            </div>

            {maxPangrams > 0 && (
              <div className="mb-4">
                <div className="flex justify-center items-center gap-2 text-sm">
                  <span className="text-2xl">🎯</span>
                  <span className="text-orange-600 font-medium">Pangrame: {pangrams.length}/{maxPangrams}</span>
                </div>
              </div>
            )}
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">{progress.toFixed(1)}% din cuvinte găsite</div>

            <div className="grid grid-cols-3 gap-4 mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{score}</div>
                <div className="text-xs text-gray-600">Puncte</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{foundWords.length}</div>
                <div className="text-xs text-gray-600">Găsite</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{pangrams.length}</div>
                <div className="text-xs text-gray-600">Pangrame</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-12">
            <div className="relative w-40 h-40">
              <button
                onClick={() => handleLetterClick(currentSet.center)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-2xl font-bold text-gray-800 transition-all duration-200 shadow-lg z-10 hover:scale-105"
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
                    className="absolute w-14 h-14 bg-gray-200 hover:bg-gray-300 rounded-lg text-xl font-bold text-gray-800 transition-all duration-200 shadow-md hover:scale-105"
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
                onChange={(e) => setCurrentWord(e.target.value.toUpperCase())}
                className="text-2xl font-mono text-center bg-transparent border-none outline-none w-full"
                placeholder="Scrie cuvântul aici..."
              />
            </div>
            
            {message && (
              <div className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
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
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Cuvinte găsite ({foundWords.length}):
              </h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {foundWords.map((word, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      pangrams.includes(word) 
                        ? 'bg-orange-100 text-orange-800 border border-orange-300' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {word}
                    {pangrams.includes(word) && ' 🎯'}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={newGame}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <RotateCcw className="w-4 h-4" />
              Joc Nou
            </button>
            <button
              onClick={() => setMessage(foundWords.length > 0 ? `Ai găsit ${foundWords.length} din ${totalWords} cuvinte! Continuă să cauți! 🔍` : 'Încearcă să formezi cuvinte cu literele din ulcior! 🏺')}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Lightbulb className="w-4 h-4" />
              Hint
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
              <li>• Poți folosi aceleași litere de mai multe ori</li>
              <li>• 🎯 Pangramele folosesc toate literele și dau bonus!</li>
              <li>• ✨ Toggle diacriticele pentru versiunea românească completă</li>
              <li>• 🏆 Explorează toate cele 10 seturi cu litere diferite</li>
              <li>• Găsește toate cuvintele pentru a umple ulciorul! 🌻</li>
            </ul>
            
            <div className="mt-3 p-2 bg-yellow-100 rounded text-xs text-yellow-800">
              💡 <strong>Sfat:</strong> Încearcă cuvinte ca ARTA → ARTĂ, RATA → RAȚĂ cu diacriticele activate!
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}