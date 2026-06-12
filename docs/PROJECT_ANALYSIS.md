# Project Analysis: CAD Smart Prep Engine

## 1. Project Overview
The CAD Smart Prep Engine is a cross-platform mobile and web application built using **React Native** and **Expo**. It serves as an interactive study and preparation engine for the **ServiceNow Certified Application Developer (CAD)** exam. 

The application transforms a static dataset of 229 carefully curated CAD exam questions into an interactive learning experience with dynamic progress tracking, performance analysis, and multiple adaptive study modes.

## 2. Problem Solved
Traditional certification preparation relies heavily on static PDFs, making it difficult for candidates to identify knowledge gaps, track their progress, or simulate the actual exam environment. The CAD Smart Prep Engine solves this by:
- Automatically identifying and drilling down on the user's weakest areas based on historical performance.
- Segmenting the learning process into the 6 core domains defined in the ServiceNow CAD blueprint.
- Providing a realistic 60-question mock exam simulation.
- Offering interactive Flashcards for rapid, active recall testing.

## 3. Technical Decisions & Architecture

### Core Tech Stack
- **Framework:** React Native / Expo (Cross-platform: iOS, Android, Web)
- **Routing:** Expo Router (File-based routing)
- **State Management:** Zustand (Global store with persist middleware)
- **Storage:** React Native Async Storage (Local device persistence)
- **Styling:** React Native StyleSheet & Expo Theming (Dark/Light mode support)

### Code Structure
- `/app` - Contains all route screens (`index.tsx`, `quiz.tsx`, `flashcards.tsx`, `modules.tsx`, `results.tsx`).
- `/components` - Reusable UI components (Themed Views/Text, External links).
- `/store` - Contains `useQuizStore.ts` which handles all business logic, statistics processing, and data fetching.
- `/assets/data` - Contains `questions.json`, the pre-processed, pristine dataset of 229 ServiceNow CAD questions.

### State Management Strategy
The application uses **Zustand** combined with **AsyncStorage** to persist the user's progress entirely on-device, meaning the app functions 100% offline. 
The global state tracks:
- `attempts`: Total times a question has been answered.
- `correct` / `wrong`: Success rates used to feed the "Weak Areas" algorithm.
- `lastSeen`: Timestamps for spaced repetition features.

The `useQuizStore` exposes highly optimized getter functions to slice the 229-question dataset dynamically:
- `getMockExam()`: Shuffles and returns exactly 60 questions.
- `getModuleQuestions(moduleName)`: Filters by ServiceNow domain and returns a random 20-question set.
- `getWeakQuestions()`: Sorts the dataset by `wrong` count in descending order to surface the lowest-performing questions.
- `getFlashcards()`: Filters out multiple-choice questions to provide single-answer scenarios optimized for flip cards.

### Future Improvements
1. **Gamification:** Introduction of daily streaks, XP points, and leaderboard functionality.
2. **Cloud Sync:** Migrating from local `AsyncStorage` to Firebase to allow cross-device sync.
3. **Advanced Analytics:** Chart integration (e.g., `react-native-chart-kit`) to visually represent module-by-module performance trends over time.
