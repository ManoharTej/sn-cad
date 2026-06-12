# CAD Smart Prep Engine 🚀

![ServiceNow](https://img.shields.io/badge/ServiceNow-Certified%20App%20Developer-green?style=for-the-badge)
![React Native](https://img.shields.io/badge/React_Native-Expo-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-brown?style=for-the-badge)

A premium, cross-platform mobile and web application designed to help candidates prepare for the **ServiceNow Certified Application Developer (CAD)** exam. 

The CAD Smart Prep Engine moves beyond static PDFs, providing a dynamic, offline-first learning environment that tracks your progress, identifies weak areas, and simulates the actual exam environment.

---

## 🎯 Features

- **📊 Dynamic Progress Dashboard:** Real-time tracking of your total attempts and overall accuracy.
- **📝 60-Question Mock Exams:** Automatically shuffles and compiles a realistic 60-question simulation from a pristine dataset of 229 verified CAD questions.
- **🏋️ Practice Weak Areas:** Advanced algorithmic tracking identifies the questions you miss most frequently and drills you on them to rapidly improve your score.
- **📚 Module Practice:** Practice specific topics based on the official ServiceNow Exam Blueprint domains (e.g., *Application User Interface*, *Security & Restricting Access*).
- **🎴 Animated Flashcards:** A beautifully animated, interactive 3D flip-card UI for rapid active recall of single-answer questions and explanations.
- **📱 Fully Cross-Platform:** Built with Expo, optimized natively for iOS, Android, and Web.
- **✈️ 100% Offline Support:** Powered by Zustand and AsyncStorage, your data and progress live entirely on your device.

---

## 🏗️ Architecture

- **Frontend Core:** React Native & Expo Router
- **Global State Management:** Zustand
- **Local Persistence:** React Native AsyncStorage
- **Icons & UI:** Expo Vector Icons (FontAwesome5)

For an in-depth breakdown of the technical decisions and data structures, see the [Project Analysis Documentation](./docs/PROJECT_ANALYSIS.md).

---

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)
- Expo Go App on your mobile device (optional, for physical device testing)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ManoharTej/sn-cad.git
   cd sn-cad
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo Development Server:**
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform:**
   - Press `w` to open in your Web Browser.
   - Press `a` to open in an Android Emulator.
   - Press `i` to open in an iOS Simulator.
   - Scan the QR code with your phone's camera (iOS) or Expo Go app (Android).

---

## 🚀 Usage

1. **Dashboard:** Upon launch, you will see your total accuracy and attempt statistics.
2. **Take Mock Exam:** Click this to begin a timed, 60-question randomly generated exam.
3. **Practice Weak Areas:** If you have answered questions incorrectly, this mode will specifically compile those questions for you to retry.
4. **Module Practice:** Select this to open the domain list and drill down into specific areas like *Application Automation* or *Working with External Data*.
5. **Flashcards:** Tap to flip cards, review correct answers, and read detailed technical explanations for every topic.

---

## 🔮 Future Improvements
- Migration to Firebase/Supabase for cross-device cloud synchronization.
- Gamification mechanics including daily study streaks and achievement badges.
- Data visualization charts (React Native Chart Kit) to map progress over time.

---
*Maintained by [Manohar Tej](https://github.com/ManoharTej)*
