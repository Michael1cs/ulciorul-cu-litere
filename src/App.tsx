import React, { useState, useEffect, useCallback } from 'react';
import { Shuffle, Trophy, RotateCcw } from 'lucide-react';

interface LetterSet {
  letters: string[];
  center: string;
  id: number;
}

interface DailyStats {
  [date: string]: number;
}

// Extend Window interface for fs
declare global {
  interface Window {
    fs?: {
      readFile: (path: string, options: { encoding: string }) => Promise<string>;
    };
  }
}

const UlciorulCuLitere: React.FC = () => {
  const letterSets: LetterSet[] = [
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

  const wordDictionary: { [key: number]: string[] } = {
    1: [
      // Set 1: A,R,E,S,T,I,N (centru: A) - doar cuvinte reale românești
      'ARTA', 'ARTEI', 'ARTE', 'ARTELOR', 'ARTIST', 'ARTISTA', 'ARTISTE', 'ARTISTI',
      'AREA', 'AREEI', 'AREE', 'AREELOR', 'AREAL', 'AREALA', 'AREALE',
      'RATA', 'RATEI', 'RATE', 'RATELOR', 'RATAT', 'RATATA', 'RATATE', 'RATATI',
      'SARE', 'SARII', 'SARI', 'SARILOR', 'SARIT', 'SARITA', 'SARITE', 'SARITI',
      'STARE', 'STARII', 'STARI', 'STARILOR', 'TARE', 'TARI', 'TAREI', 'TARILOR',
      'ANTE', 'ANTEI', 'ANTELOR', 'RASE', 'RASA', 'RASI', 'RASELOR',
      'REAL', 'REALA', 'REALE', 'REALI', 'REALITATE', 'REALIST', 'REALISTA',
      'STRAIN', 'STRAINA', 'STRAINE', 'STRAINI', 'STRAINATATE',
      'TRAI', 'TRAIT', 'TRAITA', 'TRAITE', 'TRAITI', 'TRAIRE',
      'TRAS', 'TRASA', 'TRASE', 'TRASI', 'TRASUL', 'TRASARE',
      'AREST', 'ARESTA', 'ARESTE', 'ARESTI', 'ARESTARE', 'ARESTAT',
      'SIREN', 'SIRENA', 'SIRENE', 'SIRENI', 'SIRENELE',
      'TEREN', 'TERENE', 'TERENUL', 'TERENELOR', 'TERENURI',
      'SENAT', 'SENATI', 'SENATUL', 'SENATELOR', 'SENATOR',
      'INTER', 'INTERI', 'INTERUL', 'INTERELOR', 'INTERIOR',
      'INERT', 'INERTA', 'INERTE', 'INERTI', 'INERTIE',
      'TENIS', 'TENISI', 'TENISUL', 'TENISULUI', 'TENISMAN',
      'SATIN', 'SATINI', 'SATINUL', 'SATINULUI', 'SATINATA',
      'ARATA', 'ARATAT', 'ARATATA', 'ARATATE', 'ARATATI', 'ARATARE',
      'ANTRA', 'ANTRAT', 'ANTRATA', 'ANTRATE', 'ANTRATI', 'ANTRARE',
      'SEARA', 'SEAREI', 'SERI', 'SERILOR', 'SERAL', 'SERALA',
      'ASTE', 'ASTEA', 'ASTA', 'ASTORA', 'ASTRE', 'ASTRU'
    ],
    2: [
      // Set 2: O,R,D,I,N,E,A (centru: O) - doar cuvinte reale românești
      'ORDIN', 'ORDINE', 'ORDINI', 'ORDINII', 'ORDINAT', 'ORDINATA', 'ORDINATE', 'ORDINATI',
      'ORDINEA', 'ORDINELE', 'ORDINAR', 'ORDINARE', 'ORDONAT', 'ORDONATA',
      'RODA', 'RODE', 'RODEI', 'RODELOR', 'RODAT', 'RODATA', 'RODATE',
      'NORD', 'NORDURI', 'NORDULUI', 'NORDIC', 'NORDICA', 'NORDICE',
      'RADIO', 'RADIOURI', 'RADIOULUI', 'RADIOFON', 'RADIOFONIC',
      'NORI', 'NOR', 'NORILOR', 'NORULUI', 'NOROS', 'NOROASA', 'NOROASE',
      'NORA', 'NORE', 'NOREI', 'NORELOR', 'NORILE', 'NORILOR',
      'RODIE', 'RODII', 'RODIEI', 'RODIILOR', 'RODIILE',
      'DRONA', 'DRONE', 'DRONEI', 'DRONELOR', 'DRONELE',
      'ARDEI', 'ARDEII', 'ARDEIULUI', 'ARDEILOR',
      'DONA', 'DONAT', 'DONATA', 'DONATE', 'DONATI', 'DONARE', 'DONATOR',
      'ADORN', 'ADORNAT', 'ADORNATA', 'ADORNATE', 'ADORNATI', 'ADORNARE',
      'DIANA', 'DIANEI', 'DIANI', 'DIANELOR',
      'RODEO', 'RODEOURI', 'RODEOULUI', 'RODEOUL',
      'ADORA', 'ADORAT', 'ADORATA', 'ADORATE', 'ADORATI', 'ADORARE',
      'DOARE', 'DOAREA', 'DOAREI', 'DOARELE', 'DOARELOR',
      'OARE', 'OAREI', 'OARI', 'OARELOR', 'OARECARE', 'OARECINE',
      'DORI', 'DORIA', 'DORIE', 'DORIILE', 'DORIILOR', 'DORIT', 'DORITA',
      'NORI', 'NORIA', 'NORIE', 'NORIILE', 'NORIILOR',
      'ARDE', 'ARDEA', 'ARDEI', 'ARDELE', 'ARDELOR', 'ARDAT', 'ARDATA'
    ],
    3: [
      // Set 3: A,M,S,R,E,T,I (centru: A) - doar cuvinte reale românești
      'MARS', 'MARSE', 'MARSULUI', 'MARSURI', 'MARSUL',
      'MASA', 'MASE', 'MASEI', 'MASELOR', 'MASELE',
      'MARE', 'MARI', 'MARII', 'MARILOR', 'MARIT', 'MARITA', 'MARITE', 'MARITI',
      'RAMA', 'RAME', 'RAMEI', 'RAMELOR', 'RAMELE',
      'ARMA', 'ARME', 'ARMEI', 'ARMELOR', 'ARMAT', 'ARMATA', 'ARMATE', 'ARMATI',
      'TRAM', 'TRAME', 'TRAMEI', 'TRAMELOR', 'TRAMAT', 'TRAMATA', 'TRAMATE',
      'MASTER', 'MASTERI', 'MASTERULUI', 'MASTERUL',
      'MARTE', 'MARTEI', 'MARTI', 'MARTILOR', 'MARTIAN', 'MARTIANA',
      'RESTE', 'RESTEI', 'RESTI', 'RESTELOR', 'RESTUL', 'RESTURILOR',
      'SMART', 'SMARTA', 'SMARTE', 'SMARTI', 'SMARTUL',
      'MERIT', 'MERITA', 'MERITE', 'MERITI', 'MERITAT', 'MERITATA',
      'TRAIM', 'TRAITI', 'TRAIESTE', 'TRAIND', 'TRAITOR',
      'AMER', 'AMERI', 'AMERUL', 'AMERILOR', 'AMERAT', 'AMERATA',
      'TERM', 'TERMA', 'TERME', 'TERMI', 'TERMUL', 'TERMIC', 'TERMICA',
      'STEM', 'STEMA', 'STEME', 'STEMI', 'STEMUL', 'STEMAT',
      'MERS', 'MERSA', 'MERSE', 'MERSI', 'MERSUL', 'MERSULUI',
      'STAR', 'STARA', 'STARE', 'STARI', 'STARUL', 'STAREI',
      'MAST', 'MASTA', 'MASTE', 'MASTI', 'MASTUL', 'MASTULUI',
      'TEAMS', 'TEAMUL', 'TEAMULUI', 'TEAMURI', 'TEAMURILOR',
      'STEAM', 'STEAMUL', 'STEAMULUI', 'STEAMURI'
    ],
    4: [
      // Set 4: E,L,U,M,A,R,I (centru: E) - doar cuvinte reale românești
      'LUME', 'LUMEI', 'LUMI', 'LUMILOR', 'LUMILE', 'LUMINA', 'LUMINOS',
      'MARE', 'MARI', 'MARII', 'MARILOR', 'MAREA', 'MARILE',
      'REAL', 'REALA', 'REALE', 'REALI', 'REALUL', 'REALEI', 'REALILOR',
      'RELE', 'RELEI', 'RELI', 'RELELOR', 'RELELE', 'RAUA', 'RAUL',
      'MERE', 'MEREU', 'MEREI', 'MERELOR', 'MERELE', 'MERITA',
      'MIER', 'MIERA', 'MIERE', 'MIERUL', 'MIEREA', 'MIEROS', 'MIEROASA',
      'RIME', 'RIMEI', 'RIMI', 'RIMELOR', 'RIMELE', 'RIMAT', 'RIMATA',
      'LIME', 'LIMEI', 'LIMI', 'LIMELOR', 'LIMELE', 'LIMITAT', 'LIMITATA',
      'RAMA', 'RAME', 'RAMEI', 'RAMELOR', 'RAMELE', 'RAMURA', 'RAMURI',
      'ARME', 'ARMEI', 'ARMI', 'ARMELOR', 'ARMELE', 'ARMURA', 'ARMURI',
      'ULME', 'ULMEI', 'ULMI', 'ULMELOR', 'ULMELE', 'ULMUL',
      'REUMA', 'REUMAI', 'REUME', 'REUMATIC', 'REUMATICA',
      'MEAL', 'MEALA', 'MEALE', 'MEALI', 'MEALUL',
      'LAME', 'LAMEI', 'LAMI', 'LAMELOR', 'LAMELE',
      'MALE', 'MALEI', 'MALI', 'MALELOR', 'MALELE',
      'MILE', 'MILEI', 'MILI', 'MILELOR', 'MILELE',
      'MULE', 'MULEI', 'MULI', 'MULELOR', 'MULELE',
      'RULE', 'RULEI', 'RULI', 'RULELOR', 'RULELE', 'RULAT', 'RULATA',
      'MURE', 'MUREI', 'MURI', 'MURELOR', 'MURELE', 'MURAT', 'MURATA',
      'AURA', 'AUREI', 'AURI', 'AURELOR', 'AURELE', 'AURIT', 'AURITA'
    ],
    5: [
      // Set 5: I,N,F,O,R,M,A (centru: I) - doar cuvinte reale românești
      'FIRMA', 'FIRMEI', 'FIRMI', 'FIRMELOR', 'FIRMELE', 'FIRMAT', 'FIRMATA',
      'FORMA', 'FORMEI', 'FORME', 'FORMELOR', 'FORMELE', 'FORMAT', 'FORMATA',
      'NORMA', 'NORMEI', 'NORME', 'NORMELOR', 'NORMELE', 'NORMAL', 'NORMALA',
      'AROMA', 'AROMEI', 'AROME', 'AROMELOR', 'AROMELE', 'AROMAT', 'AROMATA',
      'MINOR', 'MINORI', 'MINORUL', 'MINORILOR', 'MINORII', 'MINORA', 'MINORE',
      'MARIN', 'MARINA', 'MARINE', 'MARINI', 'MARINUL', 'MARINEI', 'MARINILOR',
      'ROMAN', 'ROMANA', 'ROMANE', 'ROMANI', 'ROMANUL', 'ROMANEI', 'ROMANILOR',
      'INFOR', 'INFORA', 'INFORE', 'INFORI', 'INFORUL', 'INFOREI',
      'INFORM', 'INFORMA', 'INFORME', 'INFORMI', 'INFORMUL', 'INFORMEI',
      'FIRMA', 'FIRMEI', 'FIRME', 'FIRMELOR', 'FIRMAT', 'FIRMATA', 'FIRMATE',
      'NORMA', 'NORMEI', 'NORME', 'NORMELOR', 'NORMAL', 'NORMALA', 'NORMALE',
      'AROMA', 'AROMEI', 'AROME', 'AROMELOR', 'AROMAT', 'AROMATA', 'AROMATE',
      'INFORMA', 'INFORMEI', 'INFORMI', 'INFORMELOR', 'INFORMAT', 'INFORMATA'
    ],
    6: [
      // Set 6: U,N,D,E,V,A,R (centru: U) - doar cuvinte reale românești
      'UNDE', 'UNDEI', 'UNDI', 'UNDELOR', 'UNDELE', 'UNDEVA', 'UNDITA',
      'DUNE', 'DUNEI', 'DUNI', 'DUNELOR', 'DUNELE', 'DUNAR', 'DUNARA',
      'NUDE', 'NUDEI', 'NUDI', 'NUDELOR', 'NUDELE', 'NUDISM', 'NUDIST',
      'RUDE', 'RUDEI', 'RUDI', 'RUDELOR', 'RUDELE', 'RUDAR', 'RUDARA',
      'VARA', 'VAREI', 'VARI', 'VARELOR', 'VARELE', 'VARAL', 'VARALA',
      'DURA', 'DUREI', 'DURI', 'DURELOR', 'DURELE', 'DURABIL', 'DURABILA',
      'VARU', 'VARUI', 'VARULUI', 'VARILOR', 'VARUL', 'VARUIT', 'VARUITA',
      'UNDEVA', 'UNDEVEI', 'UNDEVI', 'UNDEVELOR', 'UNDEVAL', 'UNDEVALA',
      'VARUN', 'VARUNA', 'VARUNE', 'VARUNI', 'VARUNUL', 'VARUNEI',
      'NUDAR', 'NUDARA', 'NUDARE', 'NUDARI', 'NUDARUL', 'NUDAREI'
    ],
    7: [
      // Set 7: O,P,T,I,U,N,E (centru: O) - doar cuvinte reale românești
      'UNITE', 'UNITEI', 'UNITI', 'UNITELOR', 'UNITAT', 'UNITATA', 'UNITATE', 'UNITATI',
      'NOTER', 'NOTERI', 'NOTERUL', 'NOTERULUI', 'NOTAT', 'NOTATA', 'NOTATE',
      'TUNER', 'TUNERI', 'TUNERUL', 'TUNERULUI', 'TUNAT', 'TUNATA', 'TUNATE',
      'TONIC', 'TONICI', 'TONICUL', 'TONICULUI', 'TONICA', 'TONICE',
      'OPTIC', 'OPTICI', 'OPTICUL', 'OPTICULUI', 'OPTICA', 'OPTICE',
      'OPTIUNE', 'OPTIUNEA', 'OPTIUNII', 'OPTIUNI', 'OPTIUNILOR', 'OPTIONAL',
      'POTION', 'POTIONA', 'POTIONE', 'POTIONI', 'POTIONUL', 'POTIONEI',
      'NOTION', 'NOTIONA', 'NOTIONE', 'NOTIONI', 'NOTIONUL', 'NOTIONEI',
      'TUNET', 'TUNETE', 'TUNETUL', 'TUNETELOR', 'TUNETUL', 'TUNETULUI',
      'OPTIC', 'OPTICA', 'OPTICE', 'OPTICI', 'OPTICUL', 'OPTICEI', 'OPTICILOR',
      'TONIC', 'TONICA', 'TONICE', 'TONICI', 'TONICUL', 'TONICEI', 'TONICILOR',
      'NOTER', 'NOTERA', 'NOTERE', 'NOTERI', 'NOTERUL', 'NOTEREI', 'NOTERILOR',
      'TUNER', 'TUNERA', 'TUNERE', 'TUNERI', 'TUNERUL', 'TUNERAI', 'TUNERILOR'
    ],
    8: [
      // Set 8: A,B,S,O,L,U,T (centru: A) - doar cuvinte reale românești
      'ABSOLUT', 'ABSOLUTA', 'ABSOLUTE', 'ABSOLUTI', 'ABSOLUTUL', 'ABSOLUTEI',
      'ATLAS', 'ATLASA', 'ATLASE', 'ATLASI', 'ATLASUL', 'ATLASEI', 'ATLASILOR',
      'LOTUS', 'LOTUSA', 'LOTUSE', 'LOTUSI', 'LOTUSUL', 'LOTUSEI', 'LOTUSILOR',
      'SALTA', 'SALTEI', 'SALTI', 'SALTELOR', 'SALTAT', 'SALTATA', 'SALTATE',
      'TABLA', 'TABLEI', 'TABLI', 'TABLELOR', 'TABLAT', 'TABLATA', 'TABLATE',
      'BLUSA', 'BLUSEI', 'BLUSI', 'BLUSELOR', 'BLUSAT', 'BLUSATA', 'BLUSATE',
      'TABUS', 'TABUSA', 'TABUSE', 'TABUSI', 'TABUSUL', 'TABUSEI', 'TABUSILOR',
      'LATUS', 'LATUSA', 'LATUSE', 'LATUSI', 'LATUSUL', 'LATUSEI', 'LATUSILOR',
      'BLAST', 'BLASTA', 'BLASTE', 'BLASTI', 'BLASTUL', 'BLASTEI',
      'BOLAS', 'BOLASA', 'BOLASE', 'BOLASI', 'BOLASUL', 'BOLASEI',
      'SABLO', 'SABLOI', 'SABLOUL', 'SABLOULUI', 'SABLOURI', 'SABLOURILOR'
    ],
    9: [
      // Set 9: E,X,P,L,I,C,A (centru: E) - doar cuvinte reale românești
      'PACE', 'PACEI', 'PACI', 'PACELOR', 'PACILE', 'PACIFIC', 'PACIFICA',
      'LACE', 'LACEI', 'LACI', 'LACELOR', 'LACILE', 'LACAT', 'LACATA',
      'CAPE', 'CAPEI', 'CAPI', 'CAPELOR', 'CAPILE', 'CAPABIL', 'CAPABILA',
      'PALE', 'PALEI', 'PALI', 'PALELOR', 'PALILE', 'PALID', 'PALIDA',
      'PLACE', 'PLACEI', 'PLACI', 'PLACELOR', 'PLACEA', 'PLACEAU', 'PLACUT',
      'EXPLICA', 'EXPLICAT', 'EXPLICATA', 'EXPLICATE', 'EXPLICATI', 'EXPLICAREA',
      'APLICA', 'APLICAT', 'APLICATA', 'APLICATE', 'APLICATI', 'APLICAREA',
      'PLECA', 'PLECAT', 'PLECATA', 'PLECATE', 'PLECATI', 'PLECAREA',
      'CLAPA', 'CLAPEI', 'CLAPI', 'CLAPELOR', 'CLAPAT', 'CLAPATA', 'CLAPATE',
      'PLACA', 'PLACEI', 'PLACI', 'PLACELOR', 'PLACAT', 'PLACATA', 'PLACATE',
      'CAPEL', 'CAPELA', 'CAPELE', 'CAPELI', 'CAPELUL', 'CAPELEI', 'CAPELELOR',
      'LACEI', 'LACEA', 'LACEE', 'LACEI', 'LACEUL', 'LACEEI', 'LACEELOR'
    ],
    10: [
      // Set 10: I,M,P,O,R,T,A (centru: I) - doar cuvinte reale românești
      'IMPORT', 'IMPORTA', 'IMPORTE', 'IMPORTI', 'IMPORTUL', 'IMPORTEI', 'IMPORTILOR',
      'PRIMI', 'PRIMIA', 'PRIMIE', 'PRIMII', 'PRIMIUL', 'PRIMIEI', 'PRIMIILOR',
      'OPRIT', 'OPRITA', 'OPRITE', 'OPRITI', 'OPRITUL', 'OPRITEI', 'OPRITILOR',
      'PROMIT', 'PROMITA', 'PROMITE', 'PROMITI', 'PROMITUL', 'PROMITEI', 'PROMITILOR',
      'IMPORTA', 'IMPORTAT', 'IMPORTATA', 'IMPORTATE', 'IMPORTATI', 'IMPORTAREA',
      'PRIMITA', 'PRIMITE', 'PRIMITI', 'PRIMITEI', 'PRIMITELOR', 'PRIMITII',
      'PRIMA', 'PRIMEI', 'PRIMI', 'PRIMELOR', 'PRIMAT', 'PRIMATA', 'PRIMATE',
      'PORTA', 'PORTEI', 'PORTI', 'PORTELOR', 'PORTAT', 'PORTATA', 'PORTATE',
      'TROMP', 'TROMPA', 'TROMPE', 'TROMPI', 'TROMPUL', 'TROMPEI', 'TROMPILOR',
      'TRIMP', 'TRIMPA', 'TRIMPE', 'TRIMPI', 'TRIMPUL', 'TRIMPEI', 'TRIMPILOR'
    ]
  };

  const [currentSet, setCurrentSet] = useState<LetterSet>(letterSets[0]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats>({});
  const [pangrams, setPangrams] = useState<string[]>([]);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [romanianWords, setRomanianWords] = useState<string[]>([]);
  const [isLoadingWords, setIsLoadingWords] = useState<boolean>(false);

  const getCurrentDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  const isPangram = (word: string): boolean => {
    const wordLetters = new Set(word.split(''));
    const setLetters = new Set(currentSet.letters);
    return setLetters.size <= wordLetters.size && 
           Array.from(setLetters).every(letter => wordLetters.has(letter));
  };

  const calculateWordScore = (word: string): number => {
    let baseScore = word.length;
    if (word.length >= 7) baseScore += 3;
    if (word.length >= 9) baseScore += 5;
    if (isPangram(word)) baseScore += 10;
    return baseScore;
  };

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

  // Încarcă lista de cuvinte românești
  useEffect(() => {
    const loadRomanianWords = async () => {
      setIsLoadingWords(true);
      try {
        if (window.fs) {
          const response = await window.fs.readFile('big_romanian_list.txt', { encoding: 'utf8' });
          const words = response.split('\n')
            .map((word: string) => word.trim().toUpperCase())
            .filter((word: string) => word.length >= 4 && word.length <= 12)
            .filter((word: string) => /^[A-ZĂÂÎȘȚ]+$/.test(word));
          
          setRomanianWords(words);
          console.log(`📚 Încărcat ${words.length} cuvinte românești din big_romanian_list.txt`);
        }
      } catch (error) {
        console.error('Eroare la încărcarea listei de cuvinte:', error);
        setRomanianWords([]);
      }
      setIsLoadingWords(false);
    };

    loadRomanianWords();
  }, []);

  const shuffleLetters = useCallback(() => {
    const letters = currentSet.letters.filter(letter => letter !== currentSet.center);
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
  }, [currentSet]);

  useEffect(() => {
    shuffleLetters();
  }, [currentSet, shuffleLetters]);

  const generateWordCombinations = (letters: string[], centerLetter: string): string[] => {
    const combinations = new Set<string>();
    
    const generateRecursive = (current: string, remaining: string[], depth: number, maxDepth: number): void => {
      if (current.length >= 4 && current.length <= maxDepth && current.includes(centerLetter)) {
        combinations.add(current);
      }
      
      if (current.length >= maxDepth) return;
      
      for (let i = 0; i < letters.length; i++) {
        generateRecursive(current + letters[i], remaining, depth + 1, maxDepth);
      }
    };
    
    for (let maxLen = 4; maxLen <= 9; maxLen++) {
      generateRecursive('', letters, 0, maxLen);
    }
    
    return Array.from(combinations);
  };

  const scanForWords = (): void => {
    if (romanianWords.length === 0) {
      setMessage('📚 Lista de cuvinte nu este încărcată încă...');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    console.log('🔍 SCAN pentru setul', currentSet.id);
    setMessage('🔍 Scanez pentru cuvinte noi...');
    
    const currentWords = wordDictionary[currentSet.id] || [];
    const combinations = generateWordCombinations(currentSet.letters, currentSet.center);
    
    console.log(`📊 Generate ${combinations.length} combinații posibile`);
    console.log(`📝 ${currentWords.length} cuvinte în dicționar, căutând în ${romanianWords.length} cuvinte românești...`);
    
    const foundWords = combinations.filter((word: string) => 
      romanianWords.includes(word) && !currentWords.includes(word)
    );
    
    console.log('✅ Cuvinte găsite:', foundWords.slice(0, 10), foundWords.length > 10 ? `... și încă ${foundWords.length - 10}` : '');
    
    setTimeout(() => {
      if (foundWords.length > 0) {
        setMessage(`🎉 Găsite ${foundWords.length} cuvinte noi în dicționarul românesc!`);
        console.log('📝 Lista completă de cuvinte găsite:', foundWords);
        console.log('💡 Sugestie: Adaugă aceste cuvinte în wordDictionary pentru setul', currentSet.id);
      } else {
        setMessage('ℹ️ Nu am găsit cuvinte noi în dicționarul românesc.');
      }
      setTimeout(() => setMessage(''), 4000);
    }, 1500);
  };

  const handleLetterClick = (letter: string): void => {
    setCurrentWord(prev => prev + letter);
    setMessage('');
  };

  const deleteLastLetter = (): void => {
    setCurrentWord(prev => prev.slice(0, -1));
  };

  const submitWord = (): void => {
    const word = currentWord.toUpperCase();
    const validWords = wordDictionary[currentSet.id] || [];
    
    if (word.length < 4) {
      setMessage('Cuvântul trebuie să aibă minim 4 litere!');
      setTimeout(() => {
        setCurrentWord('');
        setMessage('');
      }, 2000);
      return;
    }

    if (!word.includes(currentSet.center)) {
      setMessage(`Cuvântul trebuie să conțină litera ${currentSet.center}!`);
      setTimeout(() => {
        setCurrentWord('');
        setMessage('');
      }, 2000);
      return;
    }

    if (foundWords.includes(word)) {
      setMessage('Ai găsit deja acest cuvânt!');
      setTimeout(() => {
        setCurrentWord('');
        setMessage('');
      }, 2000);
      return;
    }

    const wordLetters = word.split('');
    const availableLetters = currentSet.letters;
    
    let canFormWord = true;
    for (let letter of wordLetters) {
      if (!availableLetters.includes(letter)) {
        canFormWord = false;
        break;
      }
    }
    
    if (!canFormWord) {
      setMessage('Folosești litere care nu sunt disponibile!');
      setTimeout(() => {
        setCurrentWord('');
        setMessage('');
      }, 2000);
      return;
    }

    if (validWords.includes(word) || (romanianWords.length > 0 && romanianWords.includes(word))) {
      const wordScore = calculateWordScore(word);
      const isWordPangram = isPangram(word);
      
      setFoundWords(prev => [...prev, word]);
      setScore(prev => prev + wordScore);
      
      if (isWordPangram) {
        setPangrams(prev => [...prev, word]);
      }
      
      saveDailyStats(wordScore);
      
      if (isWordPangram) {
        setMessage(`🎉 PANGRAM! "${word}" folosește toate literele! (+${wordScore} puncte)`);
      } else {
        setMessage(`Bravo! Ai găsit "${word}"! (+${wordScore} puncte)`);
      }
      
      setCurrentWord('');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`"${word}" nu este în dicționarul nostru. Trimite-mi acest cuvânt să îl verific și adaug!`);
      console.log(`🔍 CUVÂNT NECUNOSCUT: "${word}" pentru setul ${currentSet.id} (${currentSet.letters.join('-')})`);
      setTimeout(() => {
        setCurrentWord('');
        setMessage('');
      }, 4000);
    }
  };

  const newGame = (): void => {
    const randomSet = letterSets[Math.floor(Math.random() * letterSets.length)];
    setCurrentSet(randomSet);
    setFoundWords([]);
    setCurrentWord('');
    setMessage('');
    setScore(0);
    setPangrams([]);
  };

  const totalWords = wordDictionary[currentSet.id]?.length || 0;
  const progress = totalWords > 0 ? (foundWords.length / totalWords) * 100 : 0;
  const todayScore = dailyStats[getCurrentDate()] || 0;
  const totalDays = Object.keys(dailyStats).length;

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
            
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>Punctaj: {score}</span>
              </div>
              <div>Set: {currentSet.id}/10</div>
              <div>Cuvinte: {foundWords.length}/{totalWords}</div>
              {isLoadingWords && <div className="text-xs text-blue-600">📚 Încărcare dicționar...</div>}
              {romanianWords.length > 0 && <div className="text-xs text-green-600">📚 {romanianWords.length} cuvinte</div>}
            </div>
            
            {pangrams.length > 0 && (
              <div className="text-sm text-amber-600 mb-2">
                <span className="font-bold">🎯 Pangrame: {pangrams.length}</span>
              </div>
            )}
            
            <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
              <span>Astăzi: {todayScore} puncte</span>
              <span>Zile: {totalDays}</span>
              <button 
                onClick={() => setShowStats(!showStats)}
                className="text-blue-500 hover:text-blue-700 underline"
              >
                Statistici
              </button>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {showStats && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">📊 Statistici</h2>
                  <button 
                    onClick={() => setShowStats(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalDays}</div>
                    <div className="text-xs text-blue-800">Zile jucate</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{todayScore}</div>
                    <div className="text-xs text-green-800">Puncte azi</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">📅 Istoric:</h3>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {Object.keys(dailyStats).length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Joacă pentru a vedea progresul!</p>
                    ) : (
                      Object.keys(dailyStats)
                        .sort()
                        .reverse()
                        .slice(0, 10)
                        .map(date => (
                          <div key={date} className="flex justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{date === getCurrentDate() ? 'Astăzi' : date}</span>
                            <span className="text-sm font-bold">{dailyStats[date]}</span>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                message.includes('Bravo') || message.includes('🎉') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </div>

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
            <button
              onClick={scanForWords}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
            >
              🔍 Scan
            </button>
          </div>

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