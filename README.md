# 🔴 🟡 🔵 Color Drop 🔵 🟡 🔴

Minimalist reflex game built with React Native, using Reanimated and Skia, running in the Expo environment.

## Game description
Color Drop is a reflex-testing game. The goal is to rotate a 3-color wheel to match its segment with the falling droplet's color. The game speeds up over time and introduces a "color mixing" mechanic. The experience is enhanced with smooth, polished animations.

<img src="./assets/readme/demo.gif" width="300"/>

**Full gameplay:** [https://youtube.com/shorts/COmROuSNkOs](https://youtube.com/shorts/COmROuSNkOs)


## Running the App

#### Installation

```
git clone https://github.com/AleksZ28/Color-Drop
```

```
cd Color-Drop
```

```
npm install
```

1. Build APK (best performance)
```
eas build -p android --profile preview
```

2. Expo Go (near-native performance)
```
npx expo start
```

3. Native run
```
npx expo run:android
```

Make sure to disable JS Dev Mode and Fast Refresh to improve performance.

---

### Key mechanics

- **Dynamic difficulty:** The game speeds up and increases complexity as the player progresses.

- **Color mixing:** After reaching 100 points, secondary colors (Orange, Green, Pink) start dropping. The player must match between two wheel colors to "create" them.
  
- **Multiplier:** Three successful hits increase the score multiplier.
  
- **Interactive tutorial:** First launch triggers overlays that pause the game and teach the player the rules.
  
- **Vibration:** Feedback on hit or miss.
  
- **Sound effects:** Actions in the game are synced with audio.
  
- **High score:** Stored locally on the device and persists after closing the app.


### Visual effects

- Smooth transitions between menu and gameplay.
  
- Animated neon-style texts.
  
- Droplet particle splash effect.
  
- Droplet falling animation.
  
- Screen shake effect on error.
  
- Dynamic background with colored blurred circles.
   
- Animated score and multiplier updates.

### Technologies used
- React Native with Expo  
- react-native-reanimated  
- @shopify/react-native-skia  
- react-native-gesture-handler  
- react-native-async-storage  
- expo-haptics  
- expo-linear-gradient

### Architecture

1. `app/index.tsx`

   - Main game file that initializes all hooks and components, integrates game logic, animations, controls, and menu into a cohesive whole.

   - Contains the base layout of the application.

   - Conditionally renders elements.

2. `hooks/`

   - `useGameLoop.ts`: main game engine running on the UI thread.

   - `useWheelGesture.ts`: manages the wheel rotation gesture.
   
   - `useMenuTransition.ts`: manages smooth transitions between the menu and the game.

   - `useShakeEffect.ts`, `useNeonFlicker.ts`, `useGameDimensions.ts`: helper hooks for effects and layout dimensions.

3. `components/`

   - **Skia components:** `Wheel.tsx`, `Drop.tsx`, `Particle.tsx`, `AuroraBackground.tsx`, `Blob.tsx`.

   - **UI components:** `ScoreCounter.tsx`, `Multiplier.tsx`, `NeonButton.tsx`, `TutorialOverlay.tsx`, `GameOver.tsx`.

4. `assets/`
   - Contains game assets such as icons and sounds.

5. `utils/`
   - Helper functions: saving and loading the high score with AsyncStorage (`highScore.ts`), handling vibrations (`haptics.ts`).

6. `constants/gameConfig.ts`
   - Constants used throughout the game.

7. `types/`
   - Global type definition for `GameState`.

---
# 🇵🇱🇵🇱🇵🇱
# 🔴 🟡 🔵 Color Drop 🔵 🟡 🔴

Minimalistyczna gra zręcznościowa stworzona w React Native z użyciem m.in. Reanimated i Skia, działająca w środowisku Expo.

## O grze

Color Drop to gra sprawdzająca twój refleks. Celem jest obracanie 3-kolorowego koła, aby dopasować jego segment do koloru spadającej kropli. Gra z czasem przyspiesza i wprowadza mechanikę "mieszania kolorów". Całość doprawiona jest dopracowanymi, płynnymi animacjami.

<img src="./assets/readme/demo.gif" width="300"/>

**Pełny gameplay:** [https://youtube.com/shorts/COmROuSNkOs](https://youtube.com/shorts/COmROuSNkOs)


## Uruchomienie

#### Instalacja

```
git clone https://github.com/AleksZ28/Color-Drop
```

```
cd Color-Drop
```

```
npm install
```

1. Zbuildowane apk (najlepszy rezultat)
```
eas build -p android --profile preview
```

2. Expo Go (płynność zbliżona do natywnej)
```
npx expo start
```

3. Natywne uruchomienie 
```
npx expo run:android
```

Obowiązkowe jest wyłączenie JS Dev Mode oraz Fast Refresh w celu zwiększenia performance'u.

---

### Kluczowe mechaniki

- Dynamiczny poziom trudności: Gra automatycznie przyspiesza i zwiększa złożoność w miarę postępów gracza.

- Mieszanie kolorów: Po osiągnięciu progu punktowego 100pkt, gra zaczyna zrzucać kolory wtórne (Pomarańczowy, Zielony, Różówy). Gracz musi trafić między dwoma kolorami koła, aby je "stworzyć".

- Mnożnik: Trzy udane trafienia zwiększają mnożnik punktów.

- Interaktywny tutorial: Aplikacja wykrywa pierwsze uruchomienie i za pomocą pauzujących grę nakładek uczy gracza zasad gry.

- Wibracje przy trafieniu lub błędzie.

- Najlepszy wynik: Najwyższy wynik zapisywany jest lokalnie na urządzeniu, dzięki czemu pozostaje nawet po zamknięciu aplikacji.


### Efekty wizualne:

- Płynne animacje przejścia pomiędzy menu a grą

- Animujące się napisy z neonowym efektem

- Efekt rozprysku kropli na cząsteczki

- Animacja kropli w trakcie spadania

- Efekt shake ekranu przy błędzie

- Generowane kolorowe tło z dynamicznymi rozmytymi kółkami unoszącymi się losowo

- Animacje zmiany puntkacji oraz mnożnika

### Zastosowane technologie to m.in.:

- React Native z Expo
- react-native-reanimated
- @shopify/react-native-skia
- react-native-gesture-handler
- react-native-async-storage
- expo-haptics
- expo-linear-gradient

### Architektura:

1. `app/index.tsx`

   - Główny plik gry, który inicjalizuje wszystkie hooki i komponenty, łączy logikę gry, animacje, sterowanie oraz menu w jedną spójną całość.

   - Zawiera bazowy layout aplikacji.

   - Warunkowo renderuje elementy.

2. `hooks/`

   - `useGameLoop.ts`: główny silnik gry działający na wątku UI

   - `useWheelGesture.ts`: zarządza gestem obracania koła
   
   - `useMenuTransition.ts`: zarządza płynnym przejściem między menu a grą

   - `useShakeEffect.ts`, `useNeonFlicker.ts`, `useGameDimensions.ts`: hooki pomocnicze dla efektów i wymiarów

3. `components`

   - Komponenty Skia: `Wheel.tsx`, `Drop.tsx`, `Particle.tsx`, `AuroraBackground.tsx`, `Blob.tsx`

   - Komponenty UI: `ScoreCounter.tsx`, `Multiplier.tsx`, `NeonButton.tsx`, `TutorialOverlay.tsx`, `GameOver.tsx`

4. `assets/`
   - Zawiera zasoby gry takie jak ikona oraz dźwięki.

5. `utils/`
   - Funkcje pomocnicze: zapis i odczyt najlepszego wyniku z AsyncStorage (`highScore.ts`), obsługa wibracji (`haptics.ts`)

6. `constants/gameConfig.ts`
   - Stałe używane w grze.

7. `types/`
   - Definicja globalnego typu GameState.
