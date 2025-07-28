# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
# 🏺 Ulciorul cu Litere

Jocul tradițional românesc de cuvinte - versiunea digitală.

## Copyright
© 2025 Michael1cs. Toate drepturile rezervate.

## Contact
Pentru întrebări despre licență: [mihai.crisan.sarbu@gmail.com]
# 🏺 Ulciorul cu Litere

**Jocul tradițional românesc de cuvinte - Prima implementare digitală**

[![Live Demo](https://img.shields.io/badge/Demo-Live-success?style=for-the-badge)](https://ulciorul-cu-litere.vercel.app)
[![Version](https://img.shields.io/badge/Version-2.0-blue?style=for-the-badge)](https://github.com/Michael1cs/ulciorul-cu-litere/releases)
[![License](https://img.shields.io/badge/License-Proprietary-orange?style=for-the-badge)](./LICENSE)

## 🌟 Despre Joc

**Ulciorul cu Litere** este primul joc românesc digital care aduce tradițiile limbii române în era modernă. Inspirat din jocurile clasice de cuvinte, acest joc folosește **diacriticele românești** ca literă centrală - o premieră absolută în lumea jocurilor digitale!

### ✨ Ce face acest joc special?

- 🇷🇴 **100% Autentic Românesc** - Prima implementare cu diacritice (Ă, Î, Ș, Ț) ca literă centrală
- 🏺 **Tematică Tradițională** - Design inspirat din arta populară românească
- 💎 **Funcționalități Moderne** - Tehnologie avansată cu experiență premium
- 📱 **Responsive Perfect** - Funcționează perfect pe toate device-urile

## 🎮 Cum să Joci

### Reguli de Bază
1. **Formează cuvinte** cu literele din ulcior (hexagon)
2. **Litera aurită** (centrală) trebuie să apară în toate cuvintele
3. **Minim 4 litere** per cuvânt
4. **Poți folosi** aceleași litere de mai multe ori
5. **Găsește pangrame** pentru bonus +10 puncte! 🎯

### Tipuri de Hint-uri 💡
- **Prima literă + lungime:** "A_____ (6 litere)"
- **Statistică pe litere:** "3 cuvinte încep cu R"
- **Info pangrame:** "Mai există 2 pangrame! 🎯"
- **Cuvinte pe lungimi:** "4 cuvinte de 5 litere"

*Maxim 5 hint-uri per set pentru a păstra provocarea!*

## 🚀 Funcționalități Complete

### 🎯 Gameplay Avansat
- ✅ **14 seturi** de litere diferite
- ✅ **4 seturi cu diacritice** ca literă centrală (Ă, Î, Ș, Ț)
- ✅ **Pangrame** cu detectare automată și bonus puncte
- ✅ **Hint-uri reale** - 4 tipuri utile, nu doar mesaje generice
- ✅ **Auto-clear** pentru cuvinte greșite după 2 secunde

### 💾 Persistență Inteligentă
- ✅ **Progres salvat 24h** per set - nu pierzi progresul!
- ✅ **Statistici complete** zilnice și generale
- ✅ **Streak tracking** - urmărește zilele consecutive
- ✅ **Local storage** securizat pentru toate datele

### 🎨 Design și UX
- ✅ **Responsive perfect** pe mobile, tablet și desktop
- ✅ **Paletă românească** - culori inspirate din tricolorul național
- ✅ **Animații fluide** cu feedback vizual
- ✅ **Accesibilitate** cu contrast optim și markup semantic

### 📊 Statistici Detaliate
- 📈 **Scor zilnic** și total
- 🔢 **Număr cuvinte** găsite
- 🎯 **Pangrame** descoperite
- 🔥 **Streak** de zile consecutive
- 📅 **Istoric** ultimele 7 zile

## 🛠️ Tehnologii Folosite

### Frontend
- **React 18** - Biblioteca principală UI
- **TypeScript** - Tipare sigure și cod robust
- **Tailwind CSS** - Design responsive și modern
- **Lucide React** - Iconuri elegante și consistente

### Deployment & Tools
- **Vercel** - Hosting și deployment automat
- **GitHub** - Version control și colaborare
- **ESLint** - Code quality și best practices

### Funcționalități Browser
- **Local Storage** - Persistența datelor locale
- **Service Workers Ready** - Pentru funcționalitate offline viitoare

## 📦 Instalare și Dezvoltare

### Cerințe
- Node.js 16+ 
- npm sau yarn
- Git

### Pași de Instalare

```bash
# 1. Clonează repository-ul
git clone https://github.com/Michael1cs/ulciorul-cu-litere.git
cd ulciorul-cu-litere

# 2. Instalează dependențele
npm install

# 3. Pornește serverul de dezvoltare
npm start

# 4. Deschide browser-ul la http://localhost:3000
```

### Build pentru Producție

```bash
# Build optimizat pentru producție
npm run build

# Testează build-ul local
npm install -g serve
serve -s build
```

## 📊 Structura Proiectului

```
ulciorul-cu-litere/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.tsx          # Componenta principală a jocului
│   ├── index.tsx        # Entry point
│   └── index.css        # Stiluri globale
├── package.json         # Dependențe și scripturi
├── tailwind.config.js   # Configurare Tailwind
├── tsconfig.json        # Configurare TypeScript
├── LICENSE              # Licența proprietară
└── README.md           # Această documentație
```

## 🎯 Roadmap Viitor

### Version 2.1 (Planificată)
- [ ] **Mai multe seturi** cu toate diacriticele românești
- [ ] **Nivele de dificultate** (Începător, Mediu, Expert)
- [ ] **Teme vizuale** alternative (Tradițional, Modern, Întunecat)
- [ ] **Sunet și muzică** de fundal opțională

### Version 2.2 (Planificată)
- [ ] **Multiplayer** - joacă cu prietenii
- [ ] **Leaderboard** global și săptămânal
- [ ] **Achievements** și badge-uri speciale
- [ ] **Export statistici** în PDF

### Version 3.0 (Viziune)
- [ ] **Aplicație mobilă** nativă (iOS/Android)
- [ ] **Mode offline** complet funcțional
- [ ] **Sync cross-device** prin cont de utilizator
- [ ] **API public** pentru dezvoltatori

## 📈 Statistici Proiect

- 📅 **Dezvoltat în:** Iulie 2025
- 🔧 **Ore de dezvoltare:** 40+ ore
- 📝 **Linii de cod:** 1000+ linii TypeScript/React
- 🎮 **Seturi de joc:** 14 seturi complete
- 📚 **Cuvinte în dicționar:** 2000+ cuvinte românești
- 🌍 **Limbă:** Română (cu suport pentru diacritice)

## 🤝 Contribuții

Acest proiect folosește o **licență proprietară**. Pentru contribuții sau sugestii:

1. **Deschide un Issue** pentru bug-uri sau cereri de funcționalități
2. **Contactează-mă direct** pentru colaborări mai mari
3. **Partajează jocul** cu prietenii pentru feedback

### Tipuri de Contribuții Acceptate
- 🐛 **Raportare bug-uri** și probleme tehnice
- 💡 **Sugestii de îmbunătățiri** pentru gameplay
- 📚 **Adăugare cuvinte** noi în dicționar
- 🎨 **Feedback design** și experiență utilizator
- 🧪 **Testare** pe diferite device-uri și browsere

## 📜 Licență

Copyright © 2025 Michael1cs. Toate drepturile rezervate.

Acest software este protejat de o **licență proprietară**. Vezi fișierul [LICENSE](./LICENSE) pentru detalii complete.

### Permisiuni
✅ Utilizare personală și demonstrații  
✅ Studiu și analiză pentru scopuri educaționale  
✅ Feedback și sugestii de îmbunătățire  

### Restricții
❌ Redistribuire sau modificare a codului  
❌ Utilizare comercială fără permisiune  
❌ Reverse engineering sau decompilare  

## 🌐 Link-uri Utile

- 🎮 **Joacă Live:** [ulciorul-cu-litere.vercel.app](https://ulciorul-cu-litere.vercel.app)
- 💻 **Cod Sursă:** [GitHub Repository](https://github.com/Michael1cs/ulciorul-cu-litere)
- 📋 **Issues:** [GitHub Issues](https://github.com/Michael1cs/ulciorul-cu-litere/issues)
- 🏷️ **Releases:** [GitHub Releases](https://github.com/Michael1cs/ulciorul-cu-litere/releases)

## 📞 Contact

Pentru întrebări, sugestii sau colaborări:

- 📧 **Email:** [prin GitHub Issues](https://github.com/Michael1cs/ulciorul-cu-litere/issues)
- 💻 **GitHub:** [@Michael1cs](https://github.com/Michael1cs)
- 🌐 **Website:** [ulciorul-cu-litere.vercel.app](https://ulciorul-cu-litere.vercel.app)

---

<div align="center">

**🏺 Ulciorul cu Litere - Tradițiile românești în era digitală 🌻**

*Făcut cu ❤️ în România*

[![Stars](https://img.shields.io/github/stars/Michael1cs/ulciorul-cu-litere?style=social)](https://github.com/Michael1cs/ulciorul-cu-litere/stargazers)
[![Fork](https://img.shields.io/github/forks/Michael1cs/ulciorul-cu-litere?style=social)](https://github.com/Michael1cs/ulciorul-cu-litere/network)

</div>