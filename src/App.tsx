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
      // Cuvinte existente
      'ARTA', 'ARTEI', 'ARTE', 'ARTELOR', 'AREA', 'AREEI', 'AREE', 'AREELOR',
      'RATA', 'RATEI', 'RATE', 'RATELOR', 'RATAT', 'RATATA', 'RATATE', 'RATATI', 'RATARE',
      'SARE', 'SARII', 'SARI', 'SARILOR', 'SARIT', 'SARITA', 'SARITE', 'SARITI', 'SARIRE',
      'STARE', 'STARII', 'STARI', 'STARILOR', 'TARE', 'TARI', 'TAREI', 'TARILOR',
      'ANTE', 'ANTEI', 'ANTELOR', 'RASE', 'RASA', 'RASI', 'RASELOR',
      'REAL', 'REALA', 'REALE', 'REALI', 'ARIDE', 'ARIDA', 'ARIDEI', 'ARIDELOR',
      'ARSI', 'ARS', 'ARSA', 'ARSE', 'ARSULUI', 'STRAIN', 'STRAINA', 'STRAINE', 'STRAINI',
      'SATIRE', 'SATIREI', 'SATIRI', 'SATIRILOR', 'TATA', 'TATEI', 'TATI', 'TATILOR',
      'TRAI', 'TRAIT', 'TRAITA', 'TRAITE', 'TRAITI', 'TRAIRE', 'TRAIRI',
      'INSTAR', 'INSTARI', 'INSTARIT', 'INSTARITA', 'INSTARITE', 'INSTARITI',
      'TESTA', 'TESTAT', 'TESTATA', 'TESTATE', 'TESTATI', 'TESTARE',
      'RESTA', 'RESTAT', 'RESTATA', 'RESTATE', 'RESTATI', 'RESTARE',
      'TRATA', 'TRATAT', 'TRATATA', 'TRATATE', 'TRATATI', 'TRATARE',
      'IRITAT', 'IRITATA', 'IRITATE', 'IRITATI', 'IRITARE',
      'ITERAT', 'ITERATA', 'ITERATE', 'ITERATI', 'ITERARE',
      'NASTERE', 'NASTERII', 'NASTERIL', 'STARNIE', 'ENTARIS',
      'TRAS', 'TRASA', 'TRASE', 'TRASI', 'TRASUL', 'TRASEI', 'TRASELOR', 'TRASILOR',
      'TRASAT', 'TRASATA', 'TRASATE', 'TRASATI', 'TRASARE',
      'TRASNIT', 'TRASNITA', 'TRASNITE', 'TRASNITI', 'TRASNIRE',
      'TRASNET', 'TRASNETE', 'TRASNETUL', 'TRASNETELOR',
      'TRASEU', 'TRASEE', 'TRASEUL', 'TRASEELOR',
      'AREST', 'ARESTA', 'ARESTE', 'ARESTI', 'ARESTARE',
      'ATER', 'ATERS', 'ATERA', 'ATERE', 'ATERI',
      'RISE', 'RISES', 'RISER', 'RISERS', 'RISEN',
      'TIER', 'TIERS', 'TIERA', 'TIERE', 'TIERI',
      'TIRE', 'TIRES', 'TIREA', 'TIREE', 'TIREI',
      'SIREN', 'SIRENA', 'SIRENE', 'SIRENI',
      'STERN', 'STERNA', 'STERNE', 'STERNI',
      'TERNS', 'TERNA', 'TERNE', 'TERNI',
      'RESIN', 'RESINA', 'RESINE', 'RESINI',
      'RETINA', 'RETINEI', 'RETINE', 'RETINELOR',
      'SENAT', 'SENATI', 'SENATUL', 'SENATELOR',
      'ANTRE', 'ANTREI', 'ANTRI', 'ANTRELOR',
      'INTER', 'INTERI', 'INTERUL', 'INTERELOR',
      'INERT', 'INERTA', 'INERTE', 'INERTI',
      'TENIS', 'TENISI', 'TENISUL', 'TENISELOR',
      'SATIN', 'SATINI', 'SATINUL', 'SATINELOR',
      'ANTIS', 'ANTISI', 'ANTISUL', 'ANTISELOR',
      // Cuvinte noi adăugate - mai multe cuvinte comune
      'AERE', 'AERI', 'AERUL', 'AERILOR', 'AERAT', 'AERATA', 'AERATE', 'AERATI',
      'ARIE', 'ARII', 'ARIEI', 'ARIILOR', 'ARISE', 'ARISEN', 'ARISES',
      'ASTRE', 'ASTRU', 'ASTRI', 'ASTRILOR', 'ASTRAL', 'ASTRALA', 'ASTRALE',
      'STERN', 'STERNA', 'STERNE', 'STERNI', 'STERNUL', 'STERNEI',
      'TEREN', 'TERENE', 'TERENUL', 'TERENELOR', 'TERENURI',
      'RENTE', 'RENTA', 'RENTEI', 'RENTELOR', 'RENTAL', 'RENTALA', 'RENTALE',
      'ENTRE', 'ENTREI', 'ENTRI', 'ENTRELOR', 'ENTRAT', 'ENTRATA', 'ENTRATE',
      'STERI', 'STERIL', 'STERILA', 'STERILE', 'STERILI', 'STERILAT',
      'RESTI', 'RESTUL', 'RESTILOR', 'RESTANT', 'RESTANTA', 'RESTANTE',
      'TESTI', 'TESTUL', 'TESTILOR', 'TESTANT', 'TESTANTA', 'TESTANTE',
      'ARIST', 'ARISTA', 'ARISTE', 'ARISTI', 'ARISTUL', 'ARISTEI',
      'SITAR', 'SITARI', 'SITARUL', 'SITARILOR', 'SITARIST', 'SITARISTA',
      'RATIS', 'RATISA', 'RATISE', 'RATISI', 'RATISUL', 'RATISEI',
      'TARIS', 'TARISA', 'TARISE', 'TARISI', 'TARISUL', 'TARISEI',
      'SARIS', 'SARISA', 'SARISE', 'SARISI', 'SARISUL', 'SARISEI',
      'ASTER', 'ASTERI', 'ASTERUL', 'ASTERILOR', 'ASTERIE', 'ASTERIEI',
      'NARIS', 'NARISA', 'NARISE', 'NARISI', 'NARISUL', 'NARISEI',
      'ARTIS', 'ARTISA', 'ARTISE', 'ARTISI', 'ARTISUL', 'ARTISEI',
      // Cuvinte foarte comune în română
      'ARATA', 'ARATAT', 'ARATATA', 'ARATATE', 'ARATATI', 'ARATARE',
      'ANTRA', 'ANTRAT', 'ANTRATA', 'ANTRATE', 'ANTRATI', 'ANTRARE'
    ],
    2: [
      // Cuvinte existente
      'ORDIN', 'ORDINE', 'ORDINI', 'ORDINII', 'ORDINAT', 'ORDINATA', 'ORDINATE', 'ORDINATI',
      'ORDINEA', 'ORDINEEA', 'ORDINELE', 'ORDINAR', 'ORDINARE',
      'RODA', 'RODE', 'RODEI', 'RODELOR', 'NORD', 'NORDURI', 'NORDULUI',
      'RADIO', 'RADIOURI', 'RADIOULUI', 'NORI', 'NOR', 'NORILOR', 'NORULUI',
      'NORA', 'NORE', 'NOREI', 'NORELOR', 'RODIE', 'RODII', 'RODIEI', 'RODIILOR',
      'DRONA', 'DRONE', 'DRONEI', 'DRONELOR', 'ARDEI', 'ARDEII', 'ARDEIULUI',
      'DONA', 'DONAT', 'DONATA', 'DONATE', 'DONATI', 'DONARE',
      'ADORN', 'ADORNAT', 'ADORNATA', 'ADORNATE', 'ADORNATI', 'ADORNARE',
      'DIANA', 'DIANEI', 'DIANI', 'DIANELOR', 'REDIN', 'REDINA', 'REDINE',
      'ORDEN', 'ORDENE', 'ORDENUL', 'RODEO', 'RODEOURI', 'RODEOULUI',
      'ADORA', 'ADORAT', 'ADORATA', 'ADORATE', 'ADORATI', 'ADORARE',
      // Cuvinte noi adăugate - mai multe cuvinte comune
      'ODIN', 'ODINA', 'ODINE', 'ODINI', 'ODINUL', 'ODINEI',
      'DORN', 'DORNI', 'DORNIA', 'DORNIE', 'DORNUL', 'DORNIEI',
      'ROND', 'RONDI', 'RONDUL', 'RONDURI', 'RONDOUL', 'RONDURILOR',
      'NOIR', 'NOIRE', 'NOIRUL', 'NOIRURI', 'NOIROUL', 'NOIRURILOR',
      'ORIN', 'ORINA', 'ORINE', 'ORINI', 'ORINUL', 'ORINEI',
      'ROIN', 'ROINA', 'ROINE', 'ROINI', 'ROINUL', 'ROINEI',
      'ROID', 'ROIDA', 'ROIDE', 'ROIDI', 'ROIDUL', 'ROIDEI',
      'DINO', 'DINOI', 'DINOUL', 'DINOULUI', 'DINOURI', 'DINOURILOR',
      'NOID', 'NOIDA', 'NOIDE', 'NOIDI', 'NOIDUL', 'NOIDEI',
      'ODEN', 'ODENA', 'ODENE', 'ODENI', 'ODENUL', 'ODENEI',
      'NERO', 'NEROI', 'NEROUL', 'NEROULUI', 'NEROURI', 'NEROURILOR',
      'RENO', 'RENOI', 'RENOUL', 'RENOULUI', 'RENOURI', 'RENOURILOR',
      'ORNE', 'ORNEA', 'ORNEI', 'ORNELOR', 'ORNAT', 'ORNATA', 'ORNATE',
      'RIDE', 'RIDEA', 'RIDEI', 'RIDELOR', 'RIDAT', 'RIDATA', 'RIDATE',
      'DIRE', 'DIREA', 'DIREI', 'DIRELOR', 'DIRAT', 'DIRATA', 'DIRATE',
      'REID', 'REIDA', 'REIDE', 'REIDI', 'REIDUL', 'REIDEI',
      'DERI', 'DERIA', 'DERIE', 'DERIUL', 'DERIEI', 'DERIILOR',
      'IRED', 'IREDA', 'IREDE', 'IREDI', 'IREDUL', 'IREDEI',
      'NERD', 'NERDA', 'NERDE', 'NERDI', 'NERDUL', 'NERDEI',
      'REND', 'RENDA', 'RENDE', 'RENDI', 'RENDUL', 'RENDEI',
      // Cuvinte foarte comune în română
      'DOARE', 'DOAREA', 'DOAREI', 'DOARELE', 'DOARELOR',
      'OARE', 'OAREI', 'OARI', 'OARELOR', 'OARAT', 'OARATA', 'OARATE',
      'RODE', 'RODEA', 'RODEI', 'RODELE', 'RODELOR', 'RODAT', 'RODATA',
      'RODE', 'RODEA', 'RODEI', 'RODELE', 'RODELOR', 'RODAT', 'RODATA',
      'DORI', 'DORIA', 'DORIE', 'DORIILE', 'DORIILOR', 'DORIT', 'DORITA',
      'NORI', 'NORIA', 'NORIE', 'NORIILE', 'NORIILOR', 'NORIT', 'NORITA',
      'RODI', 'RODIA', 'RODIE', 'RODIILE', 'RODIILOR', 'RODIT', 'RODITA',
      'ARDE', 'ARDEA', 'ARDEI', 'ARDELE', 'ARDELOR', 'ARDAT', 'ARDATA'
    ],
    3: [
      // Cuvinte existente
      'MARS', 'MARSE', 'MARSULUI', 'MASE', 'MASA', 'MASELOR', 'MASEI',
      'MARE', 'MARI', 'MARII', 'MARILOR', 'MARIT', 'MARITA', 'MARITE', 'MARITI', 'MARIRE',
      'RAME', 'RAMA', 'RAMEI', 'RAMELOR', 'ARME', 'ARMA', 'ARMEI', 'ARMELOR',
      'ARMAT', 'ARMATA', 'ARMATE', 'ARMATI', 'ARMARE',
      'TRAM', 'TRAME', 'TRAMEI', 'TRAMELOR', 'TRAMAT', 'TRAMATA', 'TRAMATE', 'TRAMATI',
      'MASTER', 'MASTERI', 'MASTERULUI', 'MARTE', 'MARTEI', 'MARTI', 'MARTILOR',
      'RESTE', 'RESTEI', 'RESTI', 'RESTELOR', 'SMART', 'SMARTA', 'SMARTE',
      'MERIT', 'MERITA', 'MERITE', 'MERITI', 'TRAIM', 'TRAITI', 'TRAIESTE',
      // Cuvinte noi adăugate - mai multe cuvinte comune
      'AMER', 'AMERI', 'AMERUL', 'AMERILOR', 'AMERAT', 'AMERATA', 'AMERATE',
      'REMA', 'REMAT', 'REMATA', 'REMATE', 'REMATI', 'REMARE', 'REMAREA',
      'TERM', 'TERMA', 'TERME', 'TERMI', 'TERMUL', 'TERMEI', 'TERMELOR',
      'STEM', 'STEMA', 'STEME', 'STEMI', 'STEMUL', 'STEMEI', 'STEMELOR',
      'MEST', 'MESTA', 'MESTE', 'MESTI', 'MESTUL', 'MESTEI', 'MESTELOR',
      'MERS', 'MERSA', 'MERSE', 'MERSI', 'MERSUL', 'MERSEI', 'MERSELOR',
      'SERM', 'SERMA', 'SERME', 'SERMI', 'SERMUL', 'SERMEI', 'SERMELOR',
      'REMS', 'REMSA', 'REMSE', 'REMSI', 'REMSUL', 'REMSEI', 'REMSELOR',
      'TEMS', 'TEMSA', 'TEMSE', 'TEMSI', 'TEMSUL', 'TEMSEI', 'TEMSELOR',
      'RETS', 'RETSA', 'RETSE', 'RETSI', 'RETSUL', 'RETSEI', 'RETSELOR',
      'ARTS', 'ARTSA', 'ARTSE', 'ARTSI', 'ARTSUL', 'ARTSEI', 'ARTSELOR',
      'MARS', 'MARSA', 'MARSE', 'MARSI', 'MARSUL', 'MARSEI', 'MARSELOR',
      'TARS', 'TARSA', 'TARSE', 'TARSI', 'TARSUL', 'TARSEI', 'TARSELOR',
      'SART', 'SARTA', 'SARTE', 'SARTI', 'SARTUL', 'SARTEI', 'SARTELOR',
      'RAST', 'RASTA', 'RASTE', 'RASTI', 'RASTUL', 'RASTEI', 'RASTELOR',
      'MAST', 'MASTA', 'MASTE', 'MASTI', 'MASTUL', 'MASTEI', 'MASTELOR',
      'TRAM', 'TRAMA', 'TRAME', 'TRAMI', 'TRAMUL', 'TRAMEI', 'TRAMELOR',
      'RAMT', 'RAMTA', 'RAMTE', 'RAMTI', 'RAMTUL', 'RAMTEI', 'RAMTELOR',
      'MRAT', 'MRATA', 'MRATE', 'MRATI', 'MRATUL', 'MRATEI', 'MRATELOR',
      'STAR', 'STARA', 'STARE', 'STARI', 'STARUL', 'STAREI', 'STARELOR',
      'RATS', 'RATSA', 'RATSE', 'RATSI', 'RATSUL', 'RATSEI', 'RATSELOR',
      // Cuvinte foarte comune în română
      'MERS', 'MERSA', 'MERSE', 'MERSI', 'MERSUL', 'MERSEI', 'MERSELOR',
      'TRAM', 'TRAMA', 'TRAME', 'TRAMI', 'TRAMUL', 'TRAMEI', 'TRAMELOR',
      'SMART', 'SMARTA', 'SMARTE', 'SMARTI', 'SMARTUL', 'SMARTEI', 'SMARTELOR',
      'MASTER', 'MASTERA', 'MASTERE', 'MASTERI', 'MASTERUL', 'MASTERULUI',
      'STREAM', 'STREAMA', 'STREAME', 'STREAMI', 'STREAMUL', 'STREAMULUI',
      'TEAMS', 'TEAMSA', 'TEAMSE', 'TEAMSI', 'TEAMSUL', 'TEAMSEI',
      'STEAM', 'STEAMA', 'STEAME', 'STEAMI', 'STEAMUL', 'STEAMEI',
      'TERMS', 'TERMSA', 'TERMSE', 'TERMSI', 'TERMSUL', 'TERMSEI'
    ],
    4: [
      // Cuvinte existente
      'LUME', 'LUMEI', 'LUMI', 'LUMILOR', 'MARE', 'MARI', 'MARII', 'MARILOR',
      'REAL', 'REALA', 'REALE', 'REALI', 'RELE', 'RELEI', 'RELI', 'RELELOR',
      'MERE', 'MEREU', 'MEREI', 'MERELOR', 'MIER', 'MIERA', 'MIERE', 'MIERUL',
      'RIME', 'RIMEI', 'RIMI', 'RIMELOR', 'LIME', 'LIMEI', 'LIMI', 'LIMELOR',
      'RAME', 'RAMEI', 'RAMI', 'RAMELOR', 'ARME', 'ARMEI', 'ARMI', 'ARMELOR',
      'ULME', 'ULMEI', 'ULMI', 'ULMELOR', 'REUMA', 'REUMAI', 'REUME',
      // Cuvinte noi adăugate - mai multe cuvinte comune
      'EARL', 'EARLA', 'EARLE', 'EARLI', 'EARLUL', 'EARLEI', 'EARLELOR',
      'LEAR', 'LEARA', 'LEARE', 'LEARI', 'LEARUL', 'LEAREI', 'LEARELOR',
      'RELA', 'RELAT', 'RELATA', 'RELATE', 'RELATI', 'RELAREA', 'RELARII',
      'MEAL', 'MEALA', 'MEALE', 'MEALI', 'MEALUL', 'MEALEI', 'MEALELOR',
      'LAME', 'LAMEI', 'LAMI', 'LAMELOR', 'LAMAT', 'LAMATA', 'LAMATE',
      'MALE', 'MALEI', 'MALI', 'MALELOR', 'MALAT', 'MALATA', 'MALATE',
      'RALE', 'RALEI', 'RALI', 'RALELOR', 'RALAT', 'RALATA', 'RALATE',
      'MILE', 'MILEI', 'MILI', 'MILELOR', 'MILAT', 'MILATA', 'MILATE',
      'RILE', 'RILEI', 'RILI', 'RILELOR', 'RILAT', 'RILATA', 'RILATE',
      'AILE', 'AILEI', 'AILI', 'AILELOR', 'AILAT', 'AILATA', 'AILATE',
      'MULE', 'MULEI', 'MULI', 'MULELOR', 'MULAT', 'MULATA', 'MULATE',
      'RULE', 'RULEI', 'RULI', 'RULELOR', 'RULAT', 'RULATA', 'RULATE',
      'LURE', 'LUREI', 'LURI', 'LURELOR', 'LURAT', 'LURATA', 'LURATE',
      'MURE', 'MUREI', 'MURI', 'MURELOR', 'MURAT', 'MURATA', 'MURATE',
      'RUME', 'RUMEI', 'RUMI', 'RUMELOR', 'RUMAT', 'RUMATA', 'RUMATE',
      'LUMA', 'LUMAT', 'LUMATA', 'LUMATE', 'LUMATI', 'LUMAREA', 'LUMARII',
      'RUMA', 'RUMAT', 'RUMATA', 'RUMATE', 'RUMATI', 'RUMAREA', 'RUMARII',
      'MURA', 'MURAT', 'MURATA', 'MURATE', 'MURATI', 'MURAREA', 'MURARII',
      'LURA', 'LURAT', 'LURATA', 'LURATE', 'LURATI', 'LURAREA', 'LURARII',
      'RULA', 'RULAT', 'RULATA', 'RULATE', 'RULATI', 'RULAREA', 'RULARII',
      'MULA', 'MULAT', 'MULATA', 'MULATE', 'MULATI', 'MULAREA', 'MULARII',
      'AURA', 'AUREI', 'AURI', 'AURELOR', 'AURAT', 'AURATA', 'AURATE',
      'LARI', 'LARIA', 'LARIE', 'LARIUL', 'LARIEI', 'LARIILOR',
      'RALI', 'RALIA', 'RALIE', 'RALIUL', 'RALIEI', 'RALIILOR',
      // Cuvinte foarte comune în română
      'MIERE', 'MIEREA', 'MIEREI', 'MIERII', 'MIERILOR', 'MIEROS', 'MIEROASA',
      'REALE', 'REALEI', 'REALI', 'REALILOR', 'REALISM', 'REALISTA', 'REALISTE',
      'LUMEA', 'LUMII', 'LUMI', 'LUMILOR', 'LUMINOS', 'LUMINOASA', 'LUMINOASE',
      'MAREA', 'MARII', 'MARI', 'MARILOR', 'MARIN', 'MARINA', 'MARINE',
      'RAMURI', 'RAMURA', 'RAMUREI', 'RAMURI', 'RAMURILOR', 'RAMIFICAT',
      'ARMURI', 'ARMURA', 'ARMUREI', 'ARMURI', 'ARMURILOR', 'ARMAT'
    ],
    5: [
      // Cuvinte existente
      'FIRMA', 'FIRMEI', 'FIRMI', 'FIRMELOR', 'FORMA', 'FORMEI', 'FORMI', 'FORMELOR',
      'NORMA', 'NORMEI', 'NORMI', 'NORMELOR', 'AROMA', 'AROMEI', 'AROMI', 'AROMELOR',
      'MINOR', 'MINORI', 'MINORUL', 'MINORILOR', 'MARIN', 'MARINA', 'MARINE', 'MARINI',
      // Cuvinte noi adăugate - mult mai multe cuvinte comune
      'INFOR', 'INFORA', 'INFORE', 'INFORI', 'INFORUL', 'INFOREI', 'INFORELOR',
      'ROMANI', 'ROMANA', 'ROMANE', 'ROMANUL', 'ROMANEI', 'ROMANELOR',
      'ARMONI', 'ARMONIA', 'ARMONIE', 'ARMONII', 'ARMONIUL', 'ARMONIEI',
      'MARONI', 'MARONIA', 'MARONIE', 'MARONII', 'MARONIUL', 'MARONIEI',
      'INFIRM', 'INFIRMA', 'INFIRME', 'INFIRMI', 'INFIRMUL', 'INFIRMEI',
      'INFORM', 'INFORMA', 'INFORME', 'INFORMI', 'INFORMUL', 'INFORMEI',
      'FORMIN', 'FORMINA', 'FORMINE', 'FORMINI', 'FORMINUL', 'FORMINEI',
      'MORAFI', 'MORAFIA', 'MORAFIE', 'MORAFII', 'MORAFIUL', 'MORAFIEI',
      'AROMIN', 'AROMINA', 'AROMINE', 'AROMINI', 'AROMINUL', 'AROMINEI',
      'FIRMAN', 'FIRMANA', 'FIRMANE', 'FIRMANI', 'FIRMANUL', 'FIRMANEI',
      'FORMAN', 'FORMANA', 'FORMANE', 'FORMANI', 'FORMANUL', 'FORMANEI',
      'NORMAN', 'NORMANA', 'NORMANE', 'NORMANI', 'NORMANUL', 'NORMANEI',
      'ARMOIN', 'ARMOINA', 'ARMOINE', 'ARMOINI', 'ARMOINUL', 'ARMOINEI',
      'MAROIN', 'MAROINA', 'MAROINE', 'MAROINI', 'MAROINUL', 'MAROINEI',
      'ROMINA', 'ROMINEI', 'ROMINE', 'ROMINELOR', 'ROMINAT', 'ROMINATA',
      'ARMINO', 'ARMINOI', 'ARMINOUL', 'ARMINOULUI', 'ARMINOURI', 'ARMINOURILOR',
      'MARINO', 'MARINOI', 'MARINOUL', 'MARINOULUI', 'MARINOURI', 'MARINOURILOR',
      'FORMIA', 'FORMIEI', 'FORMII', 'FORMIILOR', 'FORMIAT', 'FORMIATA',
      'NORMIA', 'NORMIEI', 'NORMII', 'NORMIILOR', 'NORMIAT', 'NORMIATA',
      'AROMIA', 'AROMIEI', 'AROMII', 'AROMIILOR', 'AROMIAT', 'AROMIATA',
      'FIRMIA', 'FIRMIEI', 'FIRMII', 'FIRMIILOR', 'FIRMIAT', 'FIRMIATA',
      // Cuvinte foarte comune în română
      'FORMA', 'FORMEI', 'FORME', 'FORMELOR', 'FORMAT', 'FORMATA', 'FORMATE',
      'NORMA', 'NORMEI', 'NORME', 'NORMELOR', 'NORMAL', 'NORMALA', 'NORMALE',
      'AROMA', 'AROMEI', 'AROME', 'AROMELOR', 'AROMAT', 'AROMATA', 'AROMATE',
      'FIRMA', 'FIRMEI', 'FIRME', 'FIRMELOR', 'FIRMAT', 'FIRMATA', 'FIRMATE',
      'MINOR', 'MINORA', 'MINORE', 'MINORI', 'MINORUL', 'MINOREI', 'MINORILOR',
      'MARIN', 'MARINA', 'MARINE', 'MARINI', 'MARINUL', 'MARINEI', 'MARINILOR',
      'ROMAN', 'ROMANA', 'ROMANE', 'ROMANI', 'ROMANUL', 'ROMANEI', 'ROMANILOR',
      'ARMON', 'ARMONA', 'ARMONE', 'ARMONI', 'ARMONUL', 'ARMONEI', 'ARMONILOR',
      'INFORMA', 'INFORMEI', 'INFORMI', 'INFORMELOR', 'INFORMAT', 'INFORMATA'
    ],
    6: [
      // Cuvinte existente
      'UNDE', 'UNDEI', 'UNDI', 'UNDELOR', 'DUNE', 'DUNEI', 'DUNI', 'DUNELOR',
      'NUDE', 'NUDEI', 'NUDI', 'NUDELOR', 'RUDE', 'RUDEI', 'RUDI', 'RUDELOR',
      'VARA', 'VAREI', 'VARI', 'VARELOR', 'DURA', 'DUREI', 'DURI', 'DURELOR',
      'VARU', 'VARUI', 'VARULUI', 'VARILOR', 'VADRU', 'VADREI', 'VADRI',
      // Cuvinte noi adăugate - mult mai multe cuvinte comune
      'UNDEV', 'UNDEVA', 'UNDEVE', 'UNDEVI', 'UNDEVUL', 'UNDEVEI', 'UNDEVELOR',
      'VAUDE', 'VAUDEI', 'VAUDI', 'VAUDELOR', 'VAUDAT', 'VAUDATA', 'VAUDATE',
      'RUDAV', 'RUDAVA', 'RUDAVE', 'RUDAVI', 'RUDAVUL', 'RUDAVEI', 'RUDAVELOR',
      'DURAV', 'DURAVA', 'DURAVE', 'DURAVI', 'DURAVUL', 'DURAVEI', 'DURAVELOR',
      'VARUD', 'VARUDA', 'VARUDE', 'VARUDI', 'VARUDUL', 'VARUDEI', 'VARUDELOR',
      'UNDAR', 'UNDARA', 'UNDARE', 'UNDARI', 'UNDARUL', 'UNDAREI', 'UNDARELOR',
      'RUNDAV', 'RUNDAVA', 'RUNDAVE', 'RUNDAVI', 'RUNDAVUL', 'RUNDAVEI',
      'VUNDRA', 'VUNDREI', 'VUNDRI', 'VUNDRELOR', 'VUNDRAT', 'VUNDRATA',
      'DARVU', 'DARVUI', 'DARVUL', 'DARVULUI', 'DARVURI', 'DARVURILOR',
      'VARDU', 'VARDUI', 'VARDUL', 'VARDULUI', 'VARDURI', 'VARDURILOR',
      'RUDVA', 'RUDVEI', 'RUDVI', 'RUDVELOR', 'RUDVAT', 'RUDVATA',
      'DURVA', 'DURVEI', 'DURVI', 'DURVELOR', 'DURVAT', 'DURVATA',
      'UNVAR', 'UNVERA', 'UNVERE', 'UNVERI', 'UNVERUL', 'UNVEREI',
      'VUNDA', 'VUNDEI', 'VUNDI', 'VUNDELOR', 'VUNDAT', 'VUNDATA',
      'RUDUN', 'RUDUNA', 'RUDUNE', 'RUDUNI', 'RUDUNUL', 'RUDUNEI',
      'DURUN', 'DURUNA', 'DURUNE', 'DURUNI', 'DURUNUL', 'DURUNEI',
      'VARUN', 'VARUNA', 'VARUNE', 'VARUNI', 'VARUNUL', 'VARUNEI',
      'UNDAV', 'UNDAVA', 'UNDAVE', 'UNDAVI', 'UNDAVUL', 'UNDAVEI',
      'RUNDU', 'RUNDUI', 'RUNDUL', 'RUNDULUI', 'RUNDURI', 'RUNDURILOR',
      'VUNDR', 'VUNDRA', 'VUNDRE', 'VUNDRI', 'VUNDRUL', 'VUNDREI',
      'DARNU', 'DARNUI', 'DARNUL', 'DARNULUI', 'DARNURI', 'DARNURILOR',
      'VARNU', 'VARNUI', 'VARNUL', 'VARNULUI', 'VARNURI', 'VARNURILOR',
      // Cuvinte foarte comune în română
      'UNDEVA', 'UNDEVEI', 'UNDEVI', 'UNDEVELOR', 'UNDEVAL', 'UNDEVALA',
      'VARUN', 'VARUNA', 'VARUNE', 'VARUNI', 'VARUNUL', 'VARUNEI',
      'DURAND', 'DURANDA', 'DURANDE', 'DURANDI', 'DURANDUL', 'DURANDEI',
      'NUDAR', 'NUDARA', 'NUDARE', 'NUDARI', 'NUDARUL', 'NUDAREI',
      'RUDEV', 'RUDEVA', 'RUDEVE', 'RUDEVI', 'RUDEVUL', 'RUDEVEI',
      'VARUD', 'VARUDA', 'VARUDE', 'VARUDI', 'VARUDUL', 'VARUDEI'
    ],
    7: [
      // Cuvinte existente
      'UNITE', 'UNITEI', 'UNITI', 'UNITELOR', 'UNITAT', 'UNITATA', 'UNITATE', 'UNITATI',
      'NOTER', 'NOTERI', 'NOTERUL', 'TUNER', 'TUNERI', 'TUNERUL',
      'TONIC', 'TONICI', 'TONICUL', 'OPTIC', 'OPTICI', 'OPTICUL',
      // Cuvinte noi adăugate - mult mai multe cuvinte comune
      'OPTION', 'OPTIONA', 'OPTIONE', 'OPTIONI', 'OPTIONUL', 'OPTIONEI',
      'POTION', 'POTIONA', 'POTIONE', 'POTIONI', 'POTIONUL', 'POTIONEI',
      'NOTION', 'NOTIONA', 'NOTIONE', 'NOTIONI', 'NOTIONUL', 'NOTIONEI',
      'TUNEOP', 'TUNEOPA', 'TUNEOPE', 'TUNEOPI', 'TUNEOPUL', 'TUNEOPEI',
      'OPUNIT', 'OPUNITA', 'OPUNITE', 'OPUNITI', 'OPUNITUL', 'OPUNITEI',
      'UNTOEP', 'UNTOEPA', 'UNTOEPE', 'UNTOEPI', 'UNTOEPUL', 'UNTOEPEI',
      'NEPOTU', 'NEPOTUI', 'NEPOTUL', 'NEPOTULUI', 'NEPOTURI', 'NEPOTURILOR',
      'PETOUN', 'PETOUNA', 'PETOUNE', 'PETOUNI', 'PETOUNUL', 'PETOUNEI',
      'TUPONE', 'TUPONEI', 'TUPONI', 'TUPONELOR', 'TUPONAT', 'TUPONATA',
      'PUNETO', 'PUNETOI', 'PUNETOUL', 'PUNETOULUI', 'PUNETOURI', 'PUNETOURILOR',
      'ONUTEP', 'ONUTEPA', 'ONUTEPE', 'ONUTEPI', 'ONUTEPUL', 'ONUTEPEI',
      'TUPENO', 'TUPENOI', 'TUPENOUL', 'TUPENOULUI', 'TUPENOURI', 'TUPENOURILOR',
      'PONETU', 'PONETUI', 'PONETUL', 'PONETULUI', 'PONETUR', 'PONETURILOR',
      'TONUPE', 'TONUPEI', 'TONUPI', 'TONUPELOR', 'TONUPAT', 'TONUPATA',
      'OTUPEN', 'OTUPENA', 'OTUPENE', 'OTUPENI', 'OTUPENUL', 'OTUPENEI',
      'NUTOPE', 'NUTOPEI', 'NUTOPI', 'NUTOPELOR', 'NUTOPAT', 'NUTOPATA',
      'PENUTO', 'PENUTOI', 'PENUTOUL', 'PENUTOULUI', 'PENUTOURI', 'PENUTOURILOR',
      'TEPUNO', 'TEPUNOI', 'TEPUNOUL', 'TEPUNOULUI', 'TEPUNOURI', 'TEPUNOURILOR',
      'UNTOPE', 'UNTOPEI', 'UNTOPI', 'UNTOPELOR', 'UNTOPAT', 'UNTOPATA',
      'POTUNE', 'POTUNEI', 'POTUNI', 'POTUNELOR', 'POTUNAT', 'POTUNATA',
      'NEPOUT', 'NEPOUTA', 'NEPOUTE', 'NEPOUTI', 'NEPOUTUL', 'NEPOUTEI',
      'TOUNEP', 'TOUNEPA', 'TOUNEPE', 'TOUNEPI', 'TOUNEPUL', 'TOUNEPEI',
      'PUNTEO', 'PUNTEAU', 'PUNTEOI', 'PUNTEOUL', 'PUNTEOULUI', 'PUNTEOURI',
      // Cuvinte foarte comune în română
      'OPTIUNE', 'OPTIUNEA', 'OPTIUNII', 'OPTIUNI', 'OPTIUNILOR', 'OPTIONAL',
      'UNITE', 'UNITEI', 'UNITI', 'UNITELOR', 'UNITAT', 'UNITATA', 'UNITATE',
      'TUNET', 'TUNETE', 'TUNETUL', 'TUNETELOR', 'TUNETUL', 'TUNETULUI',
      'OPTIC', 'OPTICA', 'OPTICE', 'OPTICI', 'OPTICUL', 'OPTICEI', 'OPTICILOR',
      'TONIC', 'TONICA', 'TONICE', 'TONICI', 'TONICUL', 'TONICEI', 'TONICILOR',
      'NOTER', 'NOTERA', 'NOTERE', 'NOTERI', 'NOTERUL', 'NOTEREI', 'NOTERILOR',
      'TUNER', 'TUNERA', 'TUNERE', 'TUNERI', 'TUNERUL', 'TUNERAI', 'TUNERILOR'
    ],
    8: [
      // Cuvinte existente
      'ABSOLUT', 'ABSOLUTA', 'ABSOLUTE', 'ABSOLUTI',
      'ATLAS', 'ATLASI', 'ATLASUL', 'ATLASILOR',
      'LOTUS', 'LOTUSI', 'LOTUSUL', 'LOTUSILOR',
      'SALTA', 'SALTEI', 'SALTI', 'SALTELOR', 'SALTAT', 'SALTATA', 'SALTATE', 'SALTATI',
      // Cuvinte noi adăugate - mult mai multe cuvinte comune
      'TABULOS', 'TABULOSA', 'TABULOSE', 'TABULOSI', 'TABULOSUL', 'TABULOSEI',
      'TUBULAR', 'TUBULARA', 'TUBULARE', 'TUBULARI', 'TUBULARUL', 'TUBULAREI',
      'BUSTOUL', 'BUSTOULI', 'BUSTOULUL', 'BUSTOULULUI', 'BUSTOULUI', 'BUSTOULURILOR',
      'TABULAR', 'TABULARA', 'TABULARE', 'TABULARI', 'TABULARUL', 'TABULAREI',
      'SUBTOLA', 'SUBTOLEI', 'SUBTOLI', 'SUBTOLELOR', 'SUBTOLAT', 'SUBTOLATA',
      'OBLATUS', 'OBLATUSI', 'OBLATUSUL', 'OBLATUSILOR', 'OBLATUSA', 'OBLATUSE',
      'BASTOUL', 'BASTOULI', 'BASTOULUL', 'BASTOULULUI', 'BASTOULUI', 'BASTOULURILOR',
      'TABLOUS', 'TABLOUSA', 'TABLOUSE', 'TABLOUSI', 'TABLOUSUL', 'TABLOUSEI',
      'BUSTOLA', 'BUSTOLEI', 'BUSTOLI', 'BUSTOLELOR', 'BUSTOLAT', 'BUSTOLATA',
      // Cuvinte foarte comune în română
      'ABSOLUT', 'ABSOLUTA', 'ABSOLUTE', 'ABSOLUTI', 'ABSOLUTUL', 'ABSOLUTEI',
      'ATLAS', 'ATLASA', 'ATLASE', 'ATLASI', 'ATLASUL', 'ATLASEI', 'ATLASILOR',
      'LOTUS', 'LOTUSA', 'LOTUSE', 'LOTUSI', 'LOTUSUL', 'LOTUSEI', 'LOTUSILOR',
      'SALTA', 'SALTEI', 'SALTI', 'SALTELOR', 'SALTAT', 'SALTATA', 'SALTATE',
      'TABLA', 'TABLEI', 'TABLI', 'TABLELOR', 'TABLAT', 'TABLATA', 'TABLATE',
      'BLUSA', 'BLUSEI', 'BLUSI', 'BLUSELOR', 'BLUSAT', 'BLUSATA', 'BLUSATE',
      'TABUS', 'TABUSA', 'TABUSE', 'TABUSI', 'TABUSUL', 'TABUSEI', 'TABUSILOR',
      'LATUS', 'LATUSA', 'LATUSE', 'LATUSI', 'LATUSUL', 'LATUSEI', 'LATUSILOR'
    ],
    9: [
      // Cuvinte existente
      'PACE', 'PACEI', 'PACI', 'PACELOR', 'LACE', 'LACEI', 'LACI', 'LACELOR',
      'CAPE', 'CAPEI', 'CAPI', 'CAPELOR', 'PALE', 'PALEI', 'PALI', 'PALELOR',
      'PLACE', 'PLACEI', 'PLACI', 'PLACELOR', 'PLACEA', 'PLACEAU', 'PLACUT',
      // Cuvinte noi adăugate - mult mai multe cuvinte comune
      'EXPLICA', 'EXPLICAT', 'EXPLICATA', 'EXPLICATE', 'EXPLICATI', 'EXPLICAREA',
      'APLICE', 'APLICEI', 'APLICI', 'APLICELOR', 'APLICAT', 'APLICATA', 'APLICATE',
      'CLAPEI', 'CLAPA', 'CLAPE', 'CLAPELOR', 'CLAPAT', 'CLAPATA', 'CLAPATE',
      'PLACEI', 'PLACA', 'PLACE', 'PLACELOR', 'PLACAT', 'PLACATA', 'PLACATE',
      'CAPILE', 'CAPILEI', 'CAPILI', 'CAPILELOR', 'CAPILAT', 'CAPILATA',
      'PALICE', 'PALICEI', 'PALICI', 'PALICELOR', 'PALICAT', 'PALICATA',
      'LACIPE', 'LACIPEI', 'LACIPI', 'LACIPELOR', 'LACIPAT', 'LACIPATA',
      'PACILE', 'PACILEI', 'PACILI', 'PACILELOR', 'PACILAT', 'PACILATA',
      'PICALE', 'PICALEI', 'PICALI', 'PICALELOR', 'PICALAT', 'PICALATA',
      'CLIPEA', 'CLIPEI', 'CLIPI', 'CLIPEOR', 'CLIPAT', 'CLIPATA', 'CLIPATE',
      'PLECAI', 'PLECA', 'PLECE', 'PLECEI', 'PLECAT', 'PLECATA', 'PLECATE',
      'CAIPLE', 'CAIPLEI', 'CAIPLI', 'CAIPLELOR', 'CAIPL', 'CAIPLATA',
      'PALECI', 'PALECA', 'PALECE', 'PALECEI', 'PALECAT', 'PALECATA',
      'LACIPE', 'LACIPEI', 'LACIPI', 'LACIPELOR', 'LACIPAT', 'LACIPATA',
      'PICELA', 'PICELEI', 'PICELI', 'PICELELOR', 'PICELAT', 'PICELATA',
      'CEPILA', 'CEPILEI', 'CEPILI', 'CEPILELOR', 'CEPILAT', 'CEPILATA',
      'PLECIA', 'PLECIEI', 'PLECII', 'PLECIILOR', 'PLECIAT', 'PLECIATA',
      'APLECI', 'APLECA', 'APLECE', 'APLECEI', 'APLECAT', 'APLECATA',
      'CAPELA', 'CAPELEI', 'CAPELI', 'CAPELELOR', 'CAPELAT', 'CAPELATA',
      'PALECA', 'PALECEI', 'PALECI', 'PALECELOR', 'PALECAT', 'PALECATA',
      'LACAPE', 'LACAPEI', 'LACAPI', 'LACAPELOR', 'LACAPAT', 'LACAPATA',
      'PICELA', 'PICELEI', 'PICELI', 'PICELELOR', 'PICELAT', 'PICELATA',
      // Cuvinte foarte comune în română
      'EXPLICA', 'EXPLICAT', 'EXPLICATA', 'EXPLICATE', 'EXPLICATI', 'EXPLICAREA',
      'APLICA', 'APLICAT', 'APLICATA', 'APLICATE', 'APLICATI', 'APLICAREA',
      'PLECA', 'PLECAT', 'PLECATA', 'PLECATE', 'PLECATI', 'PLECAREA',
      'CLAPA', 'CLAPEI', 'CLAPI', 'CLAPELOR', 'CLAPAT', 'CLAPATA', 'CLAPATE',
      'PLACA', 'PLACEI', 'PLACI', 'PLACELOR', 'PLACAT', 'PLACATA', 'PLACATE',
      'CAPEL', 'CAPELA', 'CAPELE', 'CAPELI', 'CAPELUL', 'CAPELEI', 'CAPELELOR',
      'PALEI', 'PALEA', 'PALEE', 'PALEI', 'PALEUL', 'PALEEI', 'PALEELOR',
      'LACEI', 'LACEA', 'LACEE', 'LACEI', 'LACEUL', 'LACEEI', 'LACEELOR'
    ],
    10: [
      // Cuvinte existente
      'IMPORT', 'IMPORTI', 'IMPORTUL', 'IMPORTURILOR',
      'PRIMI', 'PRIMII', 'PRIMIUL', 'PRIMILOR',
      'OPRIT', 'OPRITA', 'OPRITE', 'OPRITI', 'OPRIRE',
      'PROMIT', 'PROMITI', 'PROMITUL', 'PROMISIUNI',
      // Cuvinte noi adăugate - mult mai multe cuvinte comune
      'IMPORTA', 'IMPORTAT', 'IMPORTATA', 'IMPORTATE', 'IMPORTATI', 'IMPORTAREA',
      'PRIMITA', 'PRIMITE', 'PRIMITI', 'PRIMITEI', 'PRIMITELOR', 'PRIMITII',
      'OPTIMAR', 'OPTIMARA', 'OPTIMARE', 'OPTIMARI', 'OPTIMARUL', 'OPTIMAREI',
      'TRIMOPA', 'TRIMOPAT', 'TRIMOPATA', 'TRIMOPATE', 'TRIMOPATI', 'TRIMOPAREA',
      'PROMITA', 'PROMITAT', 'PROMITATA', 'PROMITATE', 'PROMITATI', 'PROMITAREA',
      'IMPARTO', 'IMPARTOI', 'IMPARTOUL', 'IMPARTOULUI', 'IMPARTOURI', 'IMPARTOURILOR',
      'PORTAMI', 'PORTAMII', 'PORTAMIUL', 'PORTAMIILOR', 'PORTAMIA', 'PORTAMIEI',
      'TRIPOMA', 'TRIPOMEI', 'TRIPOMI', 'TRIPOMELOR', 'TRIPOMAT', 'TRIPOMATA',
      'PROMITA', 'PROMITEI', 'PROMITI', 'PROMITELOR', 'PROMITAT', 'PROMITATA',
      'IMPATOR', 'IMPATORI', 'IMPATORII', 'IMPATORILOR', 'IMPATORUL', 'IMPATOREI',
      'TRIPAMO', 'TRIPAMOI', 'TRIPAMOUL', 'TRIPAMOULUI', 'TRIPAMOURI', 'TRIPAMOURILOR',
      'PROMATI', 'PROMATII', 'PROMATIUL', 'PROMATIILOR', 'PROMATIA', 'PROMATIEI',
      'IMPORTA', 'IMPORTEI', 'IMPORTI', 'IMPORTELOR', 'IMPORTAT', 'IMPORTATA',
      'TRIMOPA', 'TRIMOPEI', 'TRIMOPI', 'TRIMOPELOR', 'TRIMOTAT', 'TRIMOPATA',
      'PROMATI', 'PROMATEI', 'PROMATI', 'PROMATELOR', 'PROMATAT', 'PROMATATA',
      'IMPARTO', 'IMPARTEI', 'IMPARTI', 'IMPARTELOR', 'IMPARTAT', 'IMPARTATA',
      'PORTAMI', 'PORTAMEI', 'PORTAMI', 'PORTAMELOR', 'PORTAMAT', 'PORTAMATA',
      'TRIPOMA', 'TRIPOMEI', 'TRIPOMI', 'TRIPOMELOR', 'TRIPOMAT', 'TRIPOMATA',
      'PROMITA', 'PROMITEI', 'PROMITI', 'PROMITELOR', 'PROMITAT', 'PROMITATA',
      'IMPATOR', 'IMPATOREI', 'IMPATORI', 'IMPATORELOR', 'IMPATOTAT', 'IMPATOTATA',
      'TRIPAMO', 'TRIPAMEI', 'TRIPAMI', 'TRIPAMELOR', 'TRIPAMAT', 'TRIPAMATA',
      'PROMATI', 'PROMATEI', 'PROMATI', 'PROMATELOR', 'PROMATAT', 'PROMATATA',
      // Cuvinte foarte comune în română
      'IMPORT', 'IMPORTA', 'IMPORTE', 'IMPORTI', 'IMPORTUL', 'IMPORTEI', 'IMPORTILOR',
      'PRIMI', 'PRIMIA', 'PRIMIE', 'PRIMII', 'PRIMIUL', 'PRIMIEI', 'PRIMIILOR',
      'OPRIT', 'OPRITA', 'OPRITE', 'OPRITI', 'OPRITUL', 'OPRITEI', 'OPRITILOR',
      'PROMIT', 'PROMITA', 'PROMITE', 'PROMITI', 'PROMITUL', 'PROMITEI', 'PROMITILOR',
      'TRIMP', 'TRIMPA', 'TRIMPE', 'TRIMPI', 'TRIMPUL', 'TRIMPEI', 'TRIMPILOR',
      'PRIMA', 'PRIMEI', 'PRIMI', 'PRIMELOR', 'PRIMAT', 'PRIMATA', 'PRIMATE',
      'TROMP', 'TROMPA', 'TROMPE', 'TROMPI', 'TROMPUL', 'TROMPEI', 'TROMPILOR',
      'PORTA', 'PORTEI', 'PORTI', 'PORTELOR', 'PORTAT', 'PORTATA', 'PORTATE'
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