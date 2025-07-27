import React, { useState, useEffect, useCallback } from 'react';
import { Shuffle, RotateCcw, Send, Trash2, Search, Trophy, BookOpen, Lightbulb, BarChart3, Calendar, X } from 'lucide-react';

// Tipuri TypeScript
interface LetterSet {
  letters: string[];
  center: string;
  id: number;
}

interface DailyStats {
  score: number;
  words: number;
  pangrams: number;
  gamesPlayed: number;
}

interface GeneralStats {
  totalGames: number;
  totalScore: number;
  streak: number;
}

interface StatsData {
  today: DailyStats;
  last7Days: Array<{
    date: string;
    score: number;
    words: number;
    pangrams: number;
    gamesPlayed: number;
    formattedDate: string;
  }>;
  totalDays: number;
  averageScore: number;
}

export default function UlciorulCuLitere() {
  const letterSets: LetterSet[] = [
    { letters: ['A', 'S', 'T', 'R', 'I', 'N', 'E'], center: 'A', id: 1 },
    { letters: ['O', 'R', 'D', 'I', 'N', 'E', 'A'], center: 'O', id: 2 },
    { letters: ['A', 'M', 'S', 'R', 'E', 'T', 'I'], center: 'A', id: 3 },
    { letters: ['E', 'L', 'U', 'M', 'A', 'R', 'I'], center: 'E', id: 4 },
    { letters: ['I', 'N', 'F', 'O', 'R', 'M', 'A'], center: 'I', id: 5 },
    { letters: ['U', 'N', 'D', 'E', 'V', 'A', 'R'], center: 'U', id: 6 },
    { letters: ['O', 'P', 'T', 'I', 'U', 'N', 'E'], center: 'O', id: 7 },
    { letters: ['A', 'B', 'S', 'O', 'L', 'U', 'T'], center: 'A', id: 8 },
    { letters: ['E', 'X', 'P', 'L', 'I', 'C', 'A'], center: 'E', id: 9 },
    { letters: ['I', 'M', 'P', 'O', 'R', 'T', 'A'], center: 'I', id: 10 },
    { letters: ['Ă', 'T', 'A', 'R', 'I', 'M', 'U'], center: 'Ă', id: 11 }
  ];

  // Dicționare complete din fișierul JSON
  const wordsData: Record<string, string[]> = {
    "1": ["AERA", "AERARE", "AERAT", "AERATE", "AERE", "AERIAN", "AERIENE", "AERIENI", "AERISA", "AERISEA", "AERISI", "AERISIRE", "AERISIREA", "AERISIRI", "AERISIRII", "AERISIT", "AIASTA", "AIEST", "AIESTA", "AIESTE", "AIESTEA", "AIESTEI", "AIESTEIA", "AINTE", "AIRA", "AIST", "AISTA", "AISTE", "AISTEA", "AISTEI", "AISTEIA", "ANANAS", "ANARTRIA", "ANARTRIE", "ANARTRIEI", "ANARTRII", "ANASTASIS", "ANAT", "ANEI", "ANIE", "ANII", "ANIN", "ANINA", "ANINARE", "ANINAT", "ANINI", "ANISET", "ANISIAN", "ANISIENE", "ANISIENI", "ANSA", "ANSE", "ANSEI", "ANSER", "ANSERINA", "ANTANTE", "ANTE", "ANTENA", "ANTENAR", "ANTENARE", "ANTENARI", "ANTENAT", "ANTENATE", "ANTENE", "ANTENEI", "ANTENIST", "ANTERA", "ANTERE", "ANTEREI", "ANTERI", "ANTERIE", "ANTET", "ANTETE", "ANTETREN", "ANTI", "ANTIAERIAN", "ANTIAERIANE", "ANTIAERIENI", "ANTIARTE", "ANTIRASIST", "ANTIRASISTE", "ANTISER", "ANTIST", "ANTITEATRE", "ANTITRINI", "ANTITRINITAR", "ANTITRINITARE", "ANTITRINITARI", "ANTRE", "ANTREN", "ANTRENA", "ANTRENANT", "ANTRENANTE", "ANTRENARE", "ANTRENAREA", "ANTRENAT", "ANTRENATE", "ARTĂ", "ARTE", "ARTEI", "ARTA", "ASERT", "ASISTA", "ASTA", "ASTEA", "ASTEI", "ASTEIA", "ASTER", "ASTERI", "ASTERIA", "ASTERIAS", "ASTERIE", "ASTERIEI", "ASTERII", "ATARE", "ATRA", "ERAI", "ERATE", "ERRATA", "ESAR", "ESENTA", "ESTRAN", "ESTRAS", "ETAN", "ETANSA", "ETATE", "ETATIST", "ETATISTE", "ETERAT", "ETERATE", "ETERIA", "ETERNITATE", "ETERNITATEA", "ETIRA", "ETIRARE", "ETIRAT", "IAER", "IARIST", "IARNA", "IASI", "IASTA", "IASTE", "IASTEA", "IERNA", "IERNARE", "IERNAT", "IERTA", "IERTAI", "IERTARE", "IERTAREA", "IERTASE", "IERTAT", "IERTATE", "IESTA", "IESTEA", "IESTEIA", "INTRA", "INTRAI", "INTRARE", "INTRAREA", "INTRASE", "INTRASEE", "INTRAT", "INTRATA", "INTRATE", "IRAN", "IRANI", "IRANIAN", "IRANIENE", "IRANIENEI", "IRANIENI", "IRANIST", "IRANISTE", "IRASER", "IRAT", "IRINA", "IRITA", "IRITAI", "IRITANT", "IRITANTE", "IRITARE", "IRITAREA", "IRITAT", "IRITATE", "ISAIA", "ISATINEI", "ISATIS", "ISTA", "ISTEA", "ISTEIA", "ISTERIA", "ISTRIA", "ITATE", "ITINERANT", "ITINERANTE", "ITINERAR", "ITINERARE", "NAIE", "NAINTE", "NAISAN", "NAIST", "NAISTE", "NANA", "NANE", "NANEI", "NANI", "NARA", "NARARE", "NARATE", "NARE", "NARINE", "NARINEI", "NART", "NASTE", "NASTIA", "NASTIE", "NASTIEI", "NASTII", "NASTRE", "NATANS", "NATANT", "NATANTE", "NATRA", "NATRE", "NATREI", "NATRIT", "RAIA", "RAIE", "RAITA", "RAITE", "RANA", "RANITI", "RANT", "RANTAS", "RANTIA", "RANTIE", "RANTIEI", "RANTII", "RARA", "RARE", "RARI", "RARITATE", "RARITATEA", "RASA", "RASAT", "RASATE", "RASE", "RASEI", "RASINA", "RASIST", "RASISTE", "RAST", "RASTER", "RASTERE", "RASTIER", "RAȚĂ", "RATAI", "RATARE", "RATAREA", "RATAT", "RATATE", "RATA", "RAȚE", "RATEI", "RATIERE", "RATIEREI", "RATINA", "RATINARE", "RATINAT", "RATITE", "SAIA", "SAINETE", "SANA", "SANATATE", "SANIA", "SANIE", "SANIEI", "SANITAR", "SANITARE", "SANITARI", "SANITARIST", "SANTINA", "SANTINE", "SANTINEI", "SANTINIER", "SANTINIERI", "SARAI", "SARANTARI", "SARASIR", "SARE", "SAREA", "SARETA", "SARI", "SARII", "SARSAN", "SART", "SARTA", "SARTIA", "SASTISEA", "SASTISI", "SASTISIRE", "SASTISIRI", "SASTISIRII", "SASTISIT", "SATAN", "SATANA", "SATANAR", "SATANE", "SATANEI", "SATANIST", "SATANISTE", "SATARA", "SATE", "SATEN", "SATIN", "SATINA", "SATINARE", "SATINAREA", "SATINAT", "SATINET", "SATIR", "SATIRA", "SATIRE", "SATIREI", "SATIRI", "SATIRII", "SATIRIST", "SATRAR", "SEARA", "SENA", "SENAR", "SENARE", "SENARI", "SENARIE", "SENAT", "SENATE", "SENINAT", "SENTINTA", "SERAI", "SERASIR", "SERAT", "SERATA", "SERATE", "SERENITATE", "SERIA", "SERIAT", "SERTAR", "SERTARE", "SESIA", "SETA", "SETAREA", "SETARIA", "SETATE", "SETEA", "SIENA", "SIERRA", "SINAI", "SINAIA", "SINAIEI", "SINANTER", "SINANTERE", "SINANTERI", "SINEA", "SINIA", "SINISTRA", "SINISTRAT", "SINISTRATE", "SINISTRITATE", "SINTAN", "SIRENIA", "SIRENIAN", "SIRIA", "SIRIAN", "SISTA", "SISTARE", "SISTAREA", "SITA", "SITAR", "SITARI", "STAI", "STAN", "STÂNĂ", "STANAT", "STÂNE", "STÂNEI", "STANI", "STANINEI", "STAR", "STARE", "STAREA", "STARET", "STARI", "STARNI", "START", "STARTER", "STARTERE", "STARTERI", "STAS", "STAT", "STATE", "STATER", "STATERI", "STATES", "STATIST", "STEA", "STEAN", "STEARAT", "STEARINEI", "STEATIT", "STERNA", "STRA", "STRAI", "STRAIE", "STRANA", "STRANE", "STRANEI", "STRANIA", "STRANIE", "STRANIETATE", "STRANII", "STRAS", "STRASTE", "STRAT", "STRATE", "STRESA", "STRESANT", "STRESANTE", "STRESARE", "STRESAT", "STRIA", "STRIAT", "STRIATA", "STRIATE", "TAENIA", "TAIAT", "TAIE", "TAIER", "TAIERE", "TAIN", "TAINA", "TAINE", "TAINEI", "TANA", "TANANA", "TANANT", "TANANTE", "TANARE", "TANAT", "TANEA", "TANIN", "TANINI", "TANTANA", "TANTAR", "TANTI", "TANTRA", "TANTRIST", "TANTRISTE", "ȚARĂ", "TARAR", "TARARA", "TARARE", "TARAS", "TARAT", "TARATA", "TARATE", "TARE", "ȚĂREI", "ȚĂRI", "TARS", "TARSIAN", "TARSIEN", "TARSIENE", "TARSIENI", "TARSITEI", "TARTAN", "TARTANE", "TARTANEI", "TARTAR", "TARTARE", "TARTARI", "TARTARIN", "TARTARINI", "TARTE", "TARTEI", "TARTINE", "TARTINEI", "TARTRAT", "TARTRE", "TASA", "TASARE", "TASAREA", "TASAT", "TASE", "TASTA", "TASTAI", "TASTARE", "TASTAREA", "TASTAT", "TASTE", "TASTEN", "TASTER", "TASTERE", "TASTERIST", "TASTERISTE", "TASTIERA", "TASTIERE", "TASTIEREI", "TATĂ", "TATAIA", "TATAIE", "TATAIEI", "TATANA", "TATE", "TATEI", "TATI", "TATIN", "TEAS", "TEATR", "TEATRE", "TENIA", "TENTA", "TENTANT", "TENTANTE", "TENTAT", "TENTATEN", "TERA", "TERARII", "TERAS", "TERASA", "TERASARE", "TERASAT", "TERASATE", "TERASE", "TERASEI", "TERASETE", "TERASIER", "TERASIERI", "TERIAN", "TERNAR", "TERNARE", "TERNARI", "TERNAT", "TERNATE", "TERRA", "TESTA", "TESTARE", "TESTAREA", "TESTAT", "TESTATE", "TESTEA", "TETA", "TETANIA", "TETANIE", "TETANIEI", "TETANII", "TETEA", "TETRA", "TETRAS", "TETRASTES", "TETREA", "TIARA", "TIARE", "TIAREI", "TINA", "TINEA", "TINEREA", "TINTA", "TIRA", "TIRAN", "TIRANA", "TIRANE", "TIRANEI", "TIRANI", "TIRANIA", "TIRANIE", "TIRANIEI", "TIRANII", "TIRANISI", "TIRANNIA", "TIRANT", "TISA", "TISAR", "TITAN", "TITANI", "TITANII", "TITANIT", "TITIREA", "TITIRISEA", "TITRA", "TITRARE", "TITRAREA", "TITRAT", "TITRATE", "TRAI", "TRAIAN", "TRAINE", "TRAINEI", "TRAISTA", "TRAISTE", "TRAISTEI", "TRAN", "TRANSE", "TRANSEI", "TRANSNISTRIAN", "TRANSNISTRIENE", "TRANSNISTRIENI", "TRANTIE", "TRAS", "TRASA", "TRASAI", "TRASANT", "TRASANTE", "TRASARE", "TRASAREA", "TRASAT", "TRASATE", "TRASE", "TRASEE", "TRASNET", "TRASS", "TRATA", "TRATARE", "TRATAREA", "TRATARISEA", "TRATARISI", "TRATAT", "TRATATE", "TRATE", "TREIA", "TREIERA", "TREIERARE", "TREIERAT", "TRENA", "TRENANT", "TRENANTE", "TRENARE", "TRENAREA", "TRESAR", "TRESARE", "TRESARI", "TRESTIA", "TRIA", "TRIAS", "TRIAT", "TRIERA", "TRIEREA", "TRINITAR", "TRINITARE", "TRINITARI", "TRINITARIAN", "TRINITARIENE", "TRINITARIENEI", "TRINITARIENI", "TRINITATE", "TRINITATEA", "TRINITRAT", "TRISA"],
    "2": ["ADENOID", "ADENOIDE", "ADINEAORI", "ADINIOAREA", "ADIO", "ADOR", "ADORA", "ADORARE", "ADORAREA", "AERODINE", "AEROION", "AEROIONI", "AIOR", "AIORI", "ANDORRA", "ANDORRAN", "ANDORRANE", "ANDORRANI", "ANDORREI", "ANDROID", "ANEROID", "ANEROIDE", "ANION", "ANIONI", "ANIONII", "ANOD", "ANODIN", "ANODINE", "ANODINI", "ARAREORI", "ARDOARE", "ARDORII", "ARON", "ARONDA", "ARONDARE", "DANO", "DEDERON", "DEDOI", "DENDROID", "DENDROIDE", "DENDRON", "DERORDINE", "DINARION", "DINIOARE", "DINIOAREA", "DINODE", "DINODEI", "DIODA", "DIODE", "DIODEI", "DIONINEI", "DIORIA", "DIORIE", "DIORIEI", "DIORII", "DOAR", "DOARE", "DODE", "DODI", "DODII", "DOINA", "DOINAR", "DOINARI", "DOINE", "DOINEA", "DOINEI", "DOINI", "DOINIRE", "DOINIRI", "DOINIRII", "DONA", "DONARE", "DONOARE", "DONOR", "DONORI", "DORADA", "DORADE", "DORADEI", "DOREA", "DORI", "DORIAN", "DORIENE", "DORIENEI", "DORIENI", "DORIN", "DORIND", "DORN", "DORNE", "DORNEAN", "DORNEI", "DORNENE", "DORNENI", "DRENOARE", "DRENOR", "DRENORI", "DROAIA", "DROAIE", "DROAIEI", "ENEODE", "ENEODEI", "ENORIA", "ENORIE", "ENORIEI", "ENORII", "EONI", "EROARE", "EROAREA", "ERODA", "ERODARE", "ERODAREA", "ERODII", "ERODIII", "EROI", "EROII", "EROINE", "EROINEI", "ERORI", "ERORII", "IDEO", "IDONEE", "IDONEI", "INDARNO", "INDOIRANIAN", "INDOOR", "INION", "INIONI", "INODOR", "INODORA", "INODORE", "INODORI", "IOAN", "IOANA", "IOANE", "IOARE", "IODIDE", "IONI", "IONIA", "IONIAN", "IONIEI", "IONIENE", "IONIENEI", "IONIENI", "IONII", "IORDAN", "IORDANE", "IORDANIA", "IORDANIAN", "IORDANIEI", "IORDANIENE", "IORDANIENEI", "IORDANIENI", "IROD", "IRON", "IRONIA", "IRONIEI", "IRONII", "NEDORIND", "NEON", "NEORDINAR", "NEORDINE", "NEORDINII", "NERO", "NEROADE", "NEROADEI", "NEROD", "NERODIRE", "NERODOI", "NERONIAN", "NOADE", "NOADEI", "NODA", "NODE", "NOIAN", "NOIANE", "NOII", "NONA", "NONE", "NONEI", "NORA", "NORD", "NOREA", "NORI", "NORIA", "NORIAN", "NORIE", "NORIEI", "NORII", "NOROADE", "NOROAIE", "NOROD", "NOROI", "NOROIA", "OADE", "OAIA", "OAIE", "OANA", "OANE", "OARDE", "OARE", "OAREA", "OAREI", "ODAIA", "ODAIE", "ODEI", "ODEOANE", "ODEON", "ODIE", "ODINE", "ODINI", "ODOARE", "ODOR", "ODORA", "ODORARE", "OIDIE", "OIER", "OIERI", "OIERIA", "OIERIE", "OIERIEI", "OIERII", "OINA", "OINEI", "ONANIA", "ONANIE", "ONANIEI", "ONANII", "ONDINE", "ONDINEI", "ONDO", "ONERAR", "ONERARE", "ONERARI", "ONIRO", "ONOARE", "ONOAREA", "ONOAREI", "ONOR", "ONORA", "ONORAR", "ONORARE", "ONORAREA", "ONORARI", "ONORARII", "ORADEA", "ORAR", "ORARE", "ORARI", "ORDA", "ORDIA", "ORDIE", "ORDIEI", "ORDII", "ORDIN", "ORDINA", "ORDINAR", "ORDINARE", "ORDINARI", "ORDINE", "ORDINEA", "ORDINI", "ORDINII", "ORDON", "ORDONA", "ORDONARE", "ORDONAREA", "ORDONE", "OREA", "OREADE", "OREADEI", "OREI", "OREIOANE", "OREION", "ORENDA", "ORIA", "ORIE", "ORIEI", "ORIER", "ORIERI", "ORII", "ORION", "ORNA", "ORNARE", "ORNAREA", "ORNI", "OROARE", "OROAREA", "ORORI", "ORORII", "RADIO", "RADIORAID", "RADON", "RAIOANE", "RAION", "RAIONA", "RAIONARE", "RAREORI", "REDOARE", "REDONNER", "REDOR", "REDORI", "REDORII", "RENO", "REORDONA", "REORDONARE", "RERAREORI", "RINO", "RINOREE", "ROADE", "ROADERE", "ROADEREA", "ROADERI", "ROADERII", "RODA", "RODAN", "RODANE", "RODANI", "RODARE", "RODEA", "RODEO", "RODI", "RODIA", "RODIE", "RODIEI", "RODIER", "RODIERI", "RODII", "RODIII", "RODIN", "RODIND", "RODINE", "RODINI", "RODINII", "RODIOARE", "RODIOAREI", "RODIRE", "RODIRI", "RODIRII", "RODO", "RODOARE", "RODODENDRON", "RODODENDRONI", "RODOID", "RODOR", "ROIA", "ROIE", "ROII", "ROIRE", "ROIRI", "ROIRII", "ROND", "RONDA", "RONDARE", "RONDE", "RONDEA", "RONDEI", "RONDINE", "RONDINO", "RONDO", "RONEO", "RONIN", "RONRON", "RONRONA"],
    "3": ["AERA", "AERARE", "AERAT", "AERATE", "AERE", "AERISA", "AERISEA", "AERISI", "AERISIRE", "AERISIREA", "AERISIRI", "AERISIRII", "AERISIT", "AMAR", "AMARA", "AMARARE", "AMARAREA", "AMARE", "AMAREI", "AMARI", "AMASTIE", "AMER", "AMETIST", "AMETISTE", "AMIMIA", "AMIMIE", "AMIMIEI", "AMIMII", "ARAM", "ARAMA", "ARAMEI", "ARAR", "ARARE", "ARAT", "ARATA", "ARATAT", "ARATE", "AREA", "AREISM", "AREST", "ARESTA", "ARESTARE", "ARESTAREA", "ARESTAT", "ARESTATE", "ARET", "ARETA", "ARIA", "ARIE", "ARIEI", "ARIERAT", "ARIERATE", "ARIES", "ARIETE", "ARII", "ARIMA", "ARIMARE", "ARIMAREA", "ARISTAT", "ARISTATA", "ARISTATE", "ARISTE", "ARISTEI", "ARITM", "ARITMIA", "ARITMIE", "ARITMIEI", "ARITMII", "ARMA", "ARMAR", "ARMARE", "ARMAREA", "ARMAT", "ARMATA", "ARMATE", "ARMATEI", "ARME", "ARMEI", "ARMIA", "ARMIE", "ARMIEI", "ARMII", "ARSE", "ARSEI", "ARSIS", "ARTĂ", "ARTE", "ARTEI", "ARTEMIS", "ARTEMISIA", "ARTERA", "ARTERE", "ARTEREI", "ARTERITE", "ARTIST", "ARTISTE", "ARTISTISM", "ARTRITA", "ARTRITE", "ARTRITEI", "ARTRITISM", "MARS", "MARSE", "MARSULUI", "MASA", "MASE", "MASELOR", "MASEI", "MARE", "MARI", "MARII", "MARILOR", "MARIT", "MARITA", "MARITE", "MARITI", "MARIRE", "MARIREA", "MARIRI", "MARIRILOR", "RAME", "RAMA", "RAMEI", "RAMELOR", "ARME", "ARMA", "ARMEI", "ARMELOR", "ARMAT", "ARMATA", "ARMATE", "ARMATI", "TRAM", "TRAME", "TRAMEI", "TRAMELOR", "MASTER", "MASTERI", "MASTERULUI", "MARTE", "MARTEI", "MARTI", "MARTILOR", "RESTE", "RESTEI", "RESTI", "RESTELOR"],
    "4": ["AERA", "AERARE", "AERARIUM", "AERE", "AERUL", "AERULUI", "LUME", "LUMEI", "LUMEA", "LUMILOR", "MERE", "MARUL", "MERELE", "MERELOR", "REAL", "REALA", "REALE", "REALI", "MARE", "MARI", "MARII", "MARILOR", "RAME", "RAMA", "RAMEI", "RAMELOR", "ARME", "ARMA", "ARMEI", "ARMELOR", "MILE", "MILA", "MILEI", "MILELOR", "RIME", "RIMA", "RIMEI", "RIMELOR"],
    "5": ["AFIF", "AFIN", "AFINA", "AFINI", "AFINOR", "AFINORI", "AFION", "AFIRM", "AFIRMA", "AFIRMI", "AFONI", "AIOR", "AIORI", "AIRA", "AMARI", "AMARINA", "AMIMIA", "AMIMII", "AMIN", "AMINA", "AMINO", "AMORFI", "ANII", "ANIM", "ANIMA", "ANIMAI", "ANIN", "ANINA", "ANINI", "ANION", "ANIONI", "ANIONII", "ANOMIA", "ANOMII", "ANONIM", "ANONIMI", "ARIA", "ARIAN", "ARII", "ARIMA", "ARIMONII", "ARIMOR", "ARIMORI", "ARIN", "ARINI", "ARMIA", "ARMII", "ARMOARII", "ARMONI", "ARMONIA", "ARMONII", "AROMI", "AROMIA", "AROMIRI", "AROMIRII", "INFO", "INFORMA", "INFORMARI", "INFORMATIA", "FIRMA", "FIRME", "FIRMEI", "FORMA", "FORME", "FORMEI", "FORMELOR", "NORMA", "NORME", "NORMEI", "RIMA", "RIME", "RIMEI", "ARMA", "ARME", "ARMEI", "ARMELOR", "MIRARE", "MIRAREA", "MIRATE"],
    "6": ["ADUN", "ADUNA", "ADUNARE", "ADUNAREA", "ADUNAU", "ADUNE", "UNDE", "UNDEI", "UNDELE", "UNDELOR", "DUNE", "DUNEI", "DUNELE", "RUDE", "RUDEI", "RUDELE", "RUDELOR", "VERDE", "VERZI", "VERZII", "VARU", "VERI", "NARAV", "NARAVURI"],
    "7": ["ENOT", "EONI", "EPOPEE", "EPOPEI", "EPOPEII", "EPOPT", "OPTIUNE", "OPTIUNI", "OPTIUNEI", "OPTIUNILOR", "UNITE", "UNITEI", "UNITELE", "PUNCT", "PUNCTE", "PUNCTUL", "TUNET", "TUNETE", "POTUN", "POTUNI"],
    "8": ["ABAT", "ABAUA", "ABBA", "ABLAUT", "ABOLLA", "ABSOLUT", "ABSOLUTA", "ABSOLUTE", "ABSOLUTUL", "ATLAS", "ATLASUL", "LOTUS", "LOTUSUL", "SLAB", "SLABA", "SLABI", "TABLA", "TABLE", "TABLEI", "TABU"],
    "9": ["ACACIEI", "ACACIILE", "ACEA", "ACEEA", "ACEI", "ACEIA", "ACEL", "ACELA", "ACELE", "ACELEA", "ACELEI", "ACELEIA", "EXPLIC", "EXPLICAM", "EXPLICATI", "EXPLICAT", "PACE", "PACEI", "PACEA", "ALEX", "PLACE", "PLACEI", "PLACEA", "PLICA"],
    "10": ["AIOR", "AIORI", "AIRA", "AMARI", "AMATORI", "AMATORII", "AMIMIA", "AMIMII", "AMORTI", "APARI", "APARITOR", "APATIA", "APATII", "APATIT", "APOI", "APORIA", "APORII", "APORTORI", "APRIAT", "APRIORI", "IMPORT", "IMPORTA", "IMPORTAM", "IMPORTATI", "IMPORTAT", "PRIMI", "PRIMII", "OPRIT", "OPRITA", "PROMPT", "PRIMAR"],
    "11": ["MĂRIT", "MĂRITA", "MĂRITE", "MĂRITĂ", "MĂRAR", "MĂRAR", "MĂTURA", "MĂTURĂ", "MĂTURI", "MĂTURIT", "AMĂRI", "AMĂRIT", "AMĂRÂT", "AMĂRÂȚI", "AMĂRIȚI", "RĂUTATE", "RĂUTAT", "RĂMÂI", "RĂMÂIT", "MĂRUȚI", "MĂRUȚIU", "MĂRIMEA", "MĂRIMII", "TĂRÂM", "TĂRÂMURI", "RĂRIT", "RĂRITA", "RĂRITE", "RĂREA", "RÂMAT", "RÂMAȚI", "RÂMIT"]
  };

  const [currentSet, setCurrentSet] = useState<LetterSet>(letterSets[0]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [withDiacritics, setWithDiacritics] = useState<boolean>(true);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [dailyStats, setDailyStats] = useState<Record<string, DailyStats>>({});
  const [generalStats, setGeneralStats] = useState<GeneralStats>({ totalGames: 0, totalScore: 0, streak: 0 });

  const shuffleLetters = useCallback(() => {
    const letters = currentSet.letters.filter((letter: string) => letter !== currentSet.center);
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
  }, [currentSet.letters, currentSet.center]);

  // Încarcă statisticile din memoria componentei (nu localStorage în artifacts)
  useEffect(() => {
    // În artifacts, simulăm doar structura de date
    const today = new Date().toISOString().split('T')[0];
    setDailyStats({
      [today]: { score: 0, words: 0, pangrams: 0, gamesPlayed: 0 }
    });
  }, []);

  // Salvează statisticile în memoria componentei
  const saveStats = (newScore: number, foundWordsCount: number, pangrams: number): void => {
    const today = new Date().toISOString().split('T')[0];
    
    // Actualizează statisticile zilnice
    const newDailyStats = {
      ...dailyStats,
      [today]: {
        score: (dailyStats[today]?.score || 0) + newScore,
        words: (dailyStats[today]?.words || 0) + foundWordsCount,
        pangrams: (dailyStats[today]?.pangrams || 0) + pangrams,
        gamesPlayed: (dailyStats[today]?.gamesPlayed || 0) + 1
      }
    };
    
    setDailyStats(newDailyStats);
    
    // Actualizează statisticile generale
    const newGeneralStats = {
      totalGames: generalStats.totalGames + 1,
      totalScore: generalStats.totalScore + newScore,
      streak: calculateStreak(newDailyStats)
    };
    
    setGeneralStats(newGeneralStats);
  };

  // Calculează seria de zile consecutive
  const calculateStreak = (stats: Record<string, DailyStats>): number => {
    const dates = Object.keys(stats).sort().reverse();
    let streak = 0;
    
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      
      if (date === expectedDateStr && stats[date].gamesPlayed > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  useEffect(() => {
    shuffleLetters();
  }, [currentSet, shuffleLetters]);

  const addSimpleDiacritics = (word: string): string => {
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

  const handleLetterClick = (letter: string): void => {
    setCurrentWord(prev => prev + letter);
    setMessage('');
  };

  const clearWord = (): void => {
    setCurrentWord('');
    setMessage('');
  };

  const deleteLastLetter = (): void => {
    setCurrentWord(prev => prev.slice(0, -1));
    setMessage('');
  };

  const submitWord = (): void => {
    const word = currentWord.toUpperCase();
    const setId = currentSet.id.toString();
    const availableWords = wordsData[setId] || [];
    
    if (word.length < 4) {
      setMessage('Cuvântul trebuie să aibă minim 4 litere!');
      setTimeout(() => {
        setMessage('');
        setCurrentWord(''); // Auto-curăță
      }, 2000);
      return;
    }

    if (!word.includes(currentSet.center)) {
      setMessage(`Cuvântul trebuie să conțină litera ${currentSet.center}!`);
      setTimeout(() => {
        setMessage('');
        setCurrentWord(''); // Auto-curăță
      }, 2000);
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
      setTimeout(() => {
        setMessage('');
        setCurrentWord(''); // Auto-curăță
      }, 2000);
      return;
    }

    if (availableWords.includes(word)) {
      const displayWord = addSimpleDiacritics(word);
      
      if (foundWords.includes(displayWord)) {
        setMessage('Ai găsit deja acest cuvânt!');
        setTimeout(() => {
          setMessage('');
          setCurrentWord(''); // Auto-curăță
        }, 2000);
        return;
      }

      // Verifică dacă este pangram
      const wordLetters = new Set(word.split(''));
      const isPangram = currentSet.letters.every((letter: string) => wordLetters.has(letter));
      
      let points = displayWord.length;
      let bonusMessage = '';
      
      if (isPangram) {
        points += 10; // Bonus +10 pentru pangram
        bonusMessage = ' 🎯 PANGRAM! +10 bonus!';
      }

      setFoundWords(prev => [...prev, displayWord]);
      setScore(prev => prev + points);
      setMessage(`Bravo! Ai găsit "${displayWord}"! (+${points} puncte)${bonusMessage}`);
      setCurrentWord('');
      setTimeout(() => setMessage(''), 4000);
    } else {
      setMessage(`"${word}" nu este în dicționarul nostru.`);
      setTimeout(() => {
        setMessage('');
        setCurrentWord(''); // Auto-curăță cuvintele greșite
      }, 2000);
    }
  };

  const newGame = (): void => {
    // Salvează statisticile jocului curent înainte de a începe unul nou
    if (foundWords.length > 0) {
      const currentPangrams = foundWords.filter((word: string) => {
        const wordLetters = new Set(word.replace(/[ĂÂ]/g, 'A').replace(/[ÎÍ]/g, 'I').replace(/[ȘŞ]/g, 'S').replace(/[ȚŢ]/g, 'T').split(''));
        return currentSet.letters.every((letter: string) => wordLetters.has(letter));
      }).length;
      
      saveStats(score, foundWords.length, currentPangrams);
    }
    
    const randomSet = letterSets[Math.floor(Math.random() * letterSets.length)];
    setCurrentSet(randomSet);
    setFoundWords([]);
    setCurrentWord('');
    setMessage('');
    setScore(0);
  };

  const switchSet = (direction: 'prev' | 'next'): void => {
    // Salvează statisticile înainte de a schimba setul
    if (foundWords.length > 0) {
      const currentPangrams = foundWords.filter((word: string) => {
        const wordLetters = new Set(word.replace(/[ĂÂ]/g, 'A').replace(/[ÎÍ]/g, 'I').replace(/[ȘŞ]/g, 'S').replace(/[ȚŢ]/g, 'T').split(''));
        return currentSet.letters.every((letter: string) => wordLetters.has(letter));
      }).length;
      
      saveStats(score, foundWords.length, currentPangrams);
    }
    
    const currentIndex = letterSets.findIndex((set: LetterSet) => set.id === currentSet.id);
    let newIndex: number;
    
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

  const toggleDiacritics = (): void => {
    setWithDiacritics(prev => !prev);
    setFoundWords(prev => prev.map((word: string) => 
      withDiacritics ? 
        word.replace(/[ĂÂ]/g, 'A').replace(/[ÎÍ]/g, 'I').replace(/[ȘŞ]/g, 'S').replace(/[ȚŢ]/g, 'T') :
        addSimpleDiacritics(word)
    ));
  };

  const totalWords = wordsData[currentSet.id.toString()]?.length || 0;
  const progress = totalWords > 0 ? (foundWords.length / totalWords) * 100 : 0;
  
  const pangrams = foundWords.filter((word: string) => {
    const wordLetters = new Set(word.replace(/[ĂÂ]/g, 'A').replace(/[ÎÍ]/g, 'I').replace(/[ȘŞ]/g, 'S').replace(/[ȚŢ]/g, 'T').split(''));
    return currentSet.letters.every((letter: string) => wordLetters.has(letter));
  });

  const maxPangrams = wordsData[currentSet.id.toString()]?.filter((word: string) => {
    const wordLetters = new Set(word.split(''));
    return currentSet.letters.every((letter: string) => wordLetters.has(letter));
  }).length || 0;

  // Formatează statisticile pentru afișare
  const getStatsData = (): StatsData => {
    const sortedDates = Object.keys(dailyStats).sort().reverse();
    const last7Days = sortedDates.slice(0, 7);
    
    return {
      today: dailyStats[new Date().toISOString().split('T')[0]] || { score: 0, words: 0, pangrams: 0, gamesPlayed: 0 },
      last7Days: last7Days.map((date: string) => ({
        date,
        ...dailyStats[date],
        formattedDate: new Date(date).toLocaleDateString('ro-RO', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      })),
      totalDays: Object.keys(dailyStats).length,
      averageScore: generalStats.totalGames > 0 ? Math.round(generalStats.totalScore / generalStats.totalGames) : 0
    };
  };

  // Componentă pentru modalul de statistici
  const StatsModal = (): JSX.Element | null => {
    if (!showStats) return null;
    
    const stats = getStatsData();
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Statistici
              </h2>
              <button 
                onClick={() => setShowStats(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Statistici de astăzi */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Astăzi
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.today.score}</div>
                  <div className="text-sm text-gray-600">Puncte</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.today.words}</div>
                  <div className="text-sm text-gray-600">Cuvinte</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.today.pangrams}</div>
                  <div className="text-sm text-gray-600">Pangrame</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.today.gamesPlayed}</div>
                  <div className="text-sm text-gray-600">Jocuri</div>
                </div>
              </div>
            </div>

            {/* Statistici generale */}
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Statistici generale</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-600">{generalStats.totalGames}</div>
                  <div className="text-sm text-gray-600">Total jocuri</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">{generalStats.streak}</div>
                  <div className="text-sm text-gray-600">Zile consecutive</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{generalStats.totalScore}</div>
                  <div className="text-sm text-gray-600">Total puncte</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{stats.averageScore}</div>
                  <div className="text-sm text-gray-600">Medie/joc</div>
                </div>
              </div>
            </div>

            {stats.totalDays === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Începe să joci pentru a vedea statisticile!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
            
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mb-4">
              <button onClick={() => switchSet('prev')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">◀</button>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span>Punctaj: {score}</span>
                </div>
                <div>Set: {currentSet.id}/11</div>
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
              
              {shuffledLetters.map((letter: string, index: number) => {
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
                {foundWords.map((word: string, index: number) => (
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
              onClick={() => setShowStats(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <BarChart3 className="w-4 h-4" />
              Statistici
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
              <li>• 🎯 Pangramele folosesc toate literele și dau <strong>+10 bonus puncte!</strong></li>
              <li>• 🏆 Explorează toate cele 11 seturi cu litere diferite</li>
              <li>• 📊 Urmărește progresul în statistici zilnice și săptămânale</li>
              <li>• Găsește toate cuvintele pentru a umple ulciorul! 🌻</li>
            </ul>
            
            <div className="mt-3 p-2 bg-yellow-100 rounded text-xs text-yellow-800">
              💡 <strong>Sfat:</strong> Cuvintele greșite se șterg automat! Pangramele primesc +10 bonus puncte!
            </div>
          </div>

        </div>
      </div>

      {/* Modal pentru statistici */}
      <StatsModal />
    </div>
  );
}