#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pentru repararea diacriticelor în dicționarul românesc
Versiune reparată - folosește caractere Unicode directe
"""

import json
import re
import sys

def add_romanian_diacritics(word):
    """
    Aplică reguli de transformare pentru diacriticele românești
    Folosește caractere Unicode directe pentru a evita erorile de escape
    """
    if not word or not isinstance(word, str):
        return word
    
    result = word.upper()
    
    # === REGULI PENTRU Ă (folosesc direct caracterul) ===
    result = re.sub(r'\bARTA\b', 'ARTĂ', result)
    result = re.sub(r'\bCASA\b', 'CASĂ', result)
    result = re.sub(r'\bMASA\b', 'MASĂ', result)
    result = re.sub(r'\bFATA\b', 'FAȚĂ', result)
    result = re.sub(r'\bVINA\b', 'VINĂ', result)
    result = re.sub(r'\bFRUMOASA\b', 'FRUMOASĂ', result)
    result = re.sub(r'\bSTRAINA\b', 'STRĂINĂ', result)
    result = re.sub(r'\bTATA\b', 'TATĂ', result)
    result = re.sub(r'\bMAMA\b', 'MAMĂ', result)
    
    # === REGULI PENTRU Ț ===
    result = re.sub(r'\bRATA\b', 'RAȚĂ', result)
    result = re.sub(r'\bRATE\b', 'RAȚE', result)
    result = re.sub(r'\bTARI\b', 'ȚĂRI', result)
    result = re.sub(r'\bTARA\b', 'ȚARĂ', result)
    result = re.sub(r'\bTAREI\b', 'ȚĂREI', result)
    result = re.sub(r'NATIUNE', 'NAȚIUNE', result)
    result = re.sub(r'NATIUNI', 'NAȚIUNI', result)
    result = re.sub(r'STATIUNE', 'STAȚIUNE', result)
    result = re.sub(r'CONSTITUTIE', 'CONSTITUȚIE', result)
    result = re.sub(r'ACTIUNE', 'ACȚIUNE', result)
    result = re.sub(r'REVOLUTIE', 'REVOLUȚIE', result)
    result = re.sub(r'INSTITUTIE', 'INSTITUȚIE', result)
    
    # === REGULI PENTRU Ș ===
    result = re.sub(r'STIINTA', 'ȘTIINȚĂ', result)
    result = re.sub(r'\bSTIU\b', 'ȘTIU', result)
    result = re.sub(r'\bSCOALA\b', 'ȘCOALĂ', result)
    result = re.sub(r'\bSTIRE\b', 'ȘTIRE', result)
    result = re.sub(r'\bSTERG\b', 'ȘTERG', result)
    result = re.sub(r'ACTIUNE', 'ACȚIUNE', result)
    
    # === REGULI PENTRU Î/Â ===
    result = re.sub(r'\bINVAT', 'ÎNVĂȚ', result)
    result = re.sub(r'\bINTELEG\b', 'ÎNȚELEG', result)
    result = re.sub(r'\bINTREABA\b', 'ÎNTREABĂ', result)
    result = re.sub(r'\bIMPART\b', 'ÎMPART', result)
    result = re.sub(r'\bIMPREUNA\b', 'ÎMPREUNĂ', result)
    result = re.sub(r'\bINTRU\b', 'ÎNTRU', result)
    result = re.sub(r'\bINTREB\b', 'ÎNTREB', result)
    
    # === REGULI PENTRU STÂNĂ ===
    result = re.sub(r'\bSTANA\b', 'STÂNĂ', result)
    result = re.sub(r'\bSTANE\b', 'STÂNE', result)
    result = re.sub(r'\bSTANEI\b', 'STÂNEI', result)
    
    # === PARTICIPII COMUNE ===
    result = re.sub(r'\bSARIT\b', 'SĂRIT', result)
    result = re.sub(r'\bSARITA\b', 'SĂRITĂ', result)
    result = re.sub(r'\bSARITE\b', 'SĂRITE', result)
    result = re.sub(r'\bSARITI\b', 'SĂRIȚI', result)
    
    result = re.sub(r'\bFACUT\b', 'FĂCUT', result)
    result = re.sub(r'\bFACUTA\b', 'FĂCUTĂ', result)
    result = re.sub(r'\bFACUTE\b', 'FĂCUTE', result)
    result = re.sub(r'\bFACUTI\b', 'FĂCUȚI', result)
    
    # === ADJECTIVE COMUNE ===
    result = re.sub(r'\bFRUMOS\b', 'FRUMOS', result)  # rămâne la fel
    result = re.sub(r'\bREAU\b', 'RĂU', result)
    result = re.sub(r'\bREA\b', 'REA', result)  # rămâne la fel
    
    # === FORME VERBALE ===
    result = re.sub(r'\bSA\b', 'SĂ', result)
    result = re.sub(r'\bDIN\b', 'DIN', result)  # rămâne la fel
    result = re.sub(r'\bCU\b', 'CU', result)    # rămâne la fel
    
    # === CUVINTE CU Â ===
    result = re.sub(r'\bROMAN\b', 'ROMÂN', result)
    result = re.sub(r'\bROMANA\b', 'ROMÂNA', result)
    result = re.sub(r'\bROMANI\b', 'ROMÂNI', result)
    result = re.sub(r'\bROMANE\b', 'ROMÂNE', result)
    
    result = re.sub(r'\bMINCA\b', 'MÂNCA', result)
    result = re.sub(r'\bMINA\b', 'MÂNA', result)
    result = re.sub(r'\bVINT\b', 'VÂNT', result)
    result = re.sub(r'\bCANT\b', 'CÂNT', result)
    
    # === CORECTURI FINALE ===
    # Elimină diacritice duple dacă apar
    result = re.sub(r'ĂĂ', 'Ă', result)
    result = re.sub(r'ȚȚ', 'Ț', result)
    result = re.sub(r'ȘȘ', 'Ș', result)
    result = re.sub(r'ÎÎ', 'Î', result)
    result = re.sub(r'ÂÂ', 'Â', result)
    
    return result

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
            examples_shown = 0
            
            for word in words:
                original = word
                transformed = add_romanian_diacritics(word)
                repaired_words.append(transformed)
                
                total_words += 1
                if original != transformed:
                    transformed_words += 1
                    if examples_shown < 10:  # Afișează primele 10 exemple per set
                        print(f"  🔄 {original} → {transformed}")
                        examples_shown += 1
            
            repaired_data[set_id] = repaired_words
            print(f"  ✅ Set {set_id}: {len([w for w in repaired_words if w != words[repaired_words.index(w)] if w in repaired_words])} transformări")
        
        print(f"\n📊 STATISTICI FINALE:")
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
    print("🏺 REPARATOR DIACRITICE ROMÂNEȘTI v2.0")
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
        print("   1. mv public/ulcior_words_by_set_with_diacritics_repaired.json public/ulcior_words_by_set_with_diacritics.json")
        print("   2. Refresh aplicația")
        print("   3. Scrie 'ARTA' și vezi 'ARTĂ'!")
    else:
        print("\n💥 EȘEC! Verifică erorile de mai sus.")
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())