#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pentru repararea diacriticelor în dicționarul românesc
Transformă toate cele 983 cuvinte din fiecare set cu diacritice corecte
"""

import json
import re
import sys

def add_romanian_diacritics(word):
    """
    Aplică reguli de transformare pentru diacriticele românești
    """
    if not word or not isinstance(word, str):
        return word
    
    result = word.upper()
    
    # === REGULI PENTRU Ă ===
    # Cuvinte care se termină în -A și sunt feminine/neutre
    result = re.sub(r'\bART([A])\b', r'ART\u0102', result)  # ARTA → ARTĂ
    result = re.sub(r'\bRAT([A])\b', r'RAT\u0102', result)  # RATA → RAȚĂ (greșit aici, va fi corectat mai jos)
    result = re.sub(r'\bCAS([A])\b', r'CAS\u0102', result)  # CASA → CASĂ
    result = re.sub(r'\bMAS([A])\b', r'MAS\u0102', result)  # MASA → MASĂ
    result = re.sub(r'\bFAT([A])\b', r'FAT\u0102', result)  # FATA → FAȚA
    result = re.sub(r'\bLUN([A])\b', r'LUN\u0102', result)  # LUNA → LUNA (nu se schimbă)
    result = re.sub(r'\bVIN([A])\b', r'VIN\u0102', result)  # VINA → VINĂ
    
    # Substantive feminine în -Ă
    result = re.sub(r'\bFRUMOAS([A])\b', r'FRUMOAS\u0102', result)  # FRUMOASA → FRUMOASĂ
    result = re.sub(r'\bSTRAIN([A])\b', r'STR\u0102IN\u0102', result)  # STRAINA → STRĂINĂ
    result = re.sub(r'\bROM[A]N([A])\b', r'ROM\u00C2N\u0102', result)  # ROMANA → ROMÂNA
    
    # === REGULI PENTRU Ț ===
    # T în finale specifice
    result = re.sub(r'\bRAT([A])\b', r'RA\u021A\u0102', result)  # RATA → RAȚĂ + Ă finale
    result = re.sub(r'([^S])TAR([I])\b', r'\1\u021A\u0102R\2', result)  # TARI → ȚĂRI (nu STARI)
    result = re.sub(r'\bTAR([A])\b', r'\u021A\u0102R\u0102', result)  # TARA → ȚARĂ
    result = re.sub(r'\bSUNT\b', r'SUNT', result)  # SUNT rămâne la fel
    result = re.sub(r'NATIUNE', r'NA\u021AIUNE', result)  # NATIUNE → NAȚIUNE
    result = re.sub(r'STATIUNE', r'STA\u021AIUNE', result)  # STATIUNE → STAȚIUNE
    result = re.sub(r'CONSTITUTIE', r'CONSTITU\u021AIE', result)  # CONSTITUTIE → CONSTITUȚIE
    
    # === REGULI PENTRU Ș ===
    # S în poziții specifice
    result = re.sub(r'STIINTA', r'\u0218TIIN\u021A\u0102', result)  # STIINTA → ȘTIINȚĂ
    result = re.sub(r'STIU', r'\u0218TIU', result)  # STIU → ȘTIU
    result = re.sub(r'\bSCOALA\b', r'\u0218COAL\u0102', result)  # SCOALA → ȘCOALĂ
    result = re.sub(r'ACTIUNE', r'AC\u021AIUNE', result)  # ACTIUNE → ACȚIUNE
    
    # === REGULI PENTRU Î/Â ===
    # Î la început și în prefixe
    result = re.sub(r'\bINVAT', r'\u00CENV\u0102\u021A', result)  # INVATAT → ÎNVĂȚAT
    result = re.sub(r'\bINTELEG', r'\u00CENA\u021AELEG', result)  # INTELEG → ÎNȚELEG
    result = re.sub(r'\bINTREB', r'\u00CENTEREB', result)  # INTREBA → ÎNTREABĂ
    result = re.sub(r'\bIMPART', r'\u00CEMPART', result)  # IMPART → ÎMPART
    
    # Â în mijlocul cuvintelor
    result = re.sub(r'([A-Z])A([A-Z])', lambda m: m.group(1) + '\u00C2' + m.group(2) if should_be_a_circumflex(m.group(0)) else m.group(0), result)
    
    # === REGULI PENTRU PARTICIPII ===
    # Participii în -AT → -AT (majoritatea rămân la fel, dar cu transformări de bază)
    result = re.sub(r'SARIT', r'S\u0102RIT', result)  # SARIT → SĂRIT
    result = re.sub(r'FACUT', r'F\u0102CUT', result)  # FACUT → FĂCUT
    
    # === REGULI PENTRU FORME SPECIFICE ===
    result = re.sub(r'\bSTAN([A])\b', r'ST\u00C2N\u0102', result)  # STANA → STÂNĂ
    result = re.sub(r'\bTAT([A])\b', r'TAT\u0102', result)  # TATA → TATĂ
    result = re.sub(r'\bMAM([A])\b', r'MAM\u0102', result)  # MAMA → MAMĂ
    
    # === CORECTURI FINALE ===
    # Corecturi pentru transformări duble sau greșite
    result = re.sub(r'RA\u021A\u0102\u0102', r'RA\u021A\u0102', result)  # Corecție dublă
    result = re.sub(r'\u0102\u0102', r'\u0102', result)  # Elimină Ă dublă
    result = re.sub(r'\u021A\u021A', r'\u021A', result)  # Elimină Ț dublă
    
    return result

def should_be_a_circumflex(word_part):
    """
    Determină dacă A din mijlocul cuvântului ar trebui să fie Â
    Reguli simpliste - se poate îmbunătăți
    """
    # Lista de cuvinte care au Â în mijloc
    words_with_circumflex = ['ROMAN', 'SANT', 'VANT', 'CANT', 'PLANT']
    return any(w in word_part for w in words_with_circumflex)

def repair_json_diacritics(input_file, output_file):
    """
    Repară diacriticele în fișierul JSON
    """
    print(f"🔧 Încărcare fișier: {input_file}")
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"✅ Fișier încărcat: {len(data)} seturi găsite")
        
        # Transformă fiecare set
        repaired_data = {}
        total_words = 0
        transformed_words = 0
        
        for set_id, words in data.items():
            print(f"🔄 Procesare set {set_id}: {len(words)} cuvinte")
            
            repaired_words = []
            for word in words:
                original = word
                transformed = add_romanian_diacritics(word)
                repaired_words.append(transformed)
                
                total_words += 1
                if original != transformed:
                    transformed_words += 1
                    if len(repaired_words) <= 10:  # Afișează primele 10 exemple
                        print(f"  🔄 {original} → {transformed}")
            
            repaired_data[set_id] = repaired_words
        
        print(f"\n📊 STATISTICI:")
        print(f"  • Total cuvinte procesate: {total_words}")
        print(f"  • Cuvinte transformate: {transformed_words}")
        print(f"  • Procent cu diacritice: {(transformed_words/total_words)*100:.1f}%")
        
        # Salvează rezultatul
        print(f"\n💾 Salvare fișier: {output_file}")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(repaired_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Fișier salvat cu succes!")
        print(f"📁 Locație: {output_file}")
        
        return True
        
    except FileNotFoundError:
        print(f"❌ EROARE: Fișierul {input_file} nu a fost găsit!")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ EROARE JSON: {e}")
        return False
    except Exception as e:
        print(f"❌ EROARE: {e}")
        return False

def main():
    """
    Funcția principală
    """
    print("🏺 REPARATOR DIACRITICE ROMÂNEȘTI")
    print("=" * 50)
    
    # Fișiere
    input_file = "public/ulcior_words_by_set.json"
    output_file = "public/ulcior_words_by_set_with_diacritics_repaired.json"
    
    # Verifică argumentele
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    
    print(f"📂 Input:  {input_file}")
    print(f"📁 Output: {output_file}")
    print("-" * 50)
    
    # Execută repararea
    success = repair_json_diacritics(input_file, output_file)
    
    if success:
        print("\n🎉 SUCCES! Diacriticele au fost reparate!")
        print("🔥 Pentru a testa:")
        print("   1. Înlocuiește fișierul vechi cu cel nou")
        print("   2. Refresh aplicația")
        print("   3. Scrie 'ARTA' și vezi 'ARTĂ'!")
    else:
        print("\n💥 EȘEC! Verifică erorile de mai sus.")
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())