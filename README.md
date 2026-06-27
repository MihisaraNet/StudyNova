<div align="center">
  <img src="https://raw.githubusercontent.com/MihisaraNet/StudyNova/main/assets/icon.png" alt="StudyNova Logo" width="120" height="120" style="border-radius: 20px; margin-bottom: 20px;" />
  <h1>🚀 StudyNova</h1>
  <p><strong>Your Intelligent Student Study Planner & Companion</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Frontend-React_Native%20Expo-blue" alt="React Native Expo" />
    <img src="https://img.shields.io/badge/Backend-Spring_Boot-green" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/Database-MongoDB_Atlas-success" alt="MongoDB Atlas" />
    <img src="https://img.shields.io/badge/AI-Google_Gemini-orange" alt="Gemini AI" />
  </p>
</div>

---

## 🌟 Overview

**StudyNova** is a comprehensive, full-stack application designed to help students optimize their academic schedules, track their tasks, and boost daily productivity. Powered by the **Google Gemini AI**, StudyNova acts as your personal AI study advisor, generating custom learning plans, study tips, and priority strategies based on your specific workload.

## ✨ Key Features

- 🔐 **Secure Authentication**: JWT-based login and registration system with Bcrypt password hashing.
- 📚 **Subject & Task Management**: Organize your coursework and track assignments with prioritized deadlines.
- 🕒 **Timetable & Pomodoro**: Built-in Pomodoro timer and interactive weekly class/study timetable.
- 🧠 **AI Study Advisor**: Seamless integration with Google Gemini Pro to parse your pending tasks and generate optimized, hour-by-hour study suggestions.
- 📊 **Progress Analytics**: Track your completion rates and academic standing.
- 📱 **Cross-Platform**: Built using React Native Expo, meaning it runs flawlessly on Web, iOS, and Android.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React Native (Expo)](https://expo.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **API Communication**: [Axios](https://axios-http.com/)
- **Navigation**: React Navigation

### Backend
- **Framework**: [Spring Boot 3.2](https://spring.io/projects/spring-boot) (Java 17+)
- **Security**: Spring Security & JWT
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- **AI Integration**: Custom Service wrapping Google Gemini REST APIs

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18+)
- **Java** (JDK 17 or higher)
- **Maven** (For backend compilation)

### 1. Environment Setup

**Frontend (`frontend/.env`)**:
```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

**Backend (`backend/.env`)**:
```env
SPRING_DATA_MONGODB_URI=mongodb+srv://<your_user>:<your_password>@cluster.mongodb.net/studentplanner
GEMINI_API_KEY=your_gemini_api_key
```
*(Note: The backend is configured with `spring-dotenv` to automatically load this file).*

### 2. Running the Backend (Spring Boot)
Open a terminal in the `backend/` directory and run:
```bash
mvn clean install
mvn spring-boot:run
```
The REST API will be available at `http://localhost:8080`.

### 3. Running the Frontend (Expo)
Open a terminal in the `frontend/` directory and run:
```bash
npm install
npm run web
```
The application will launch in your browser at `http://localhost:8081`.

## 🧪 Testing

The backend includes comprehensive JUnit 5 and Mockito tests covering authentication, user management, and AI service resilience.
To run the test suite:
```bash
cd backend
mvn clean test
```

## 📜 License & Copyright

© 2026 **Isula Mihisara**. All Rights Reserved.

<div align="center">
  <sub>Built with ❤️ for better education.</sub>
</div>
