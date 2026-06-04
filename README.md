# 🌌 StudyNova — Smart Student Study Planner

StudyNova is a premium, state-of-the-art academic planner designed for students to take absolute control of their study schedules, task deadlines, and performance goals. Combining a stunning, highly immersive dark-theme interface with intelligent workload optimization powered by **Google Gemini Pro AI**, StudyNova acts as a complete command center for academic success.

---

## ✨ Features at a Glance

### 📱 Premium Frontend Client (React Native & Expo)
*   **Dynamic Workload Command Center**: A unified dashboard highlighting active tasks, daily timetable blocks, subject catalogs, and quick-action triggers.
*   **Generalized Task Tracker**: Advanced task management featuring estimated focus hours, due dates, reminder offsets, and priority categorization (High, Medium, Low).
*   **Timetable Scheduler**: Weekly scheduler displaying class times and self-study blocks, with interactive widgets to register new sessions.
*   **Focus Timer (Pomodoro)**: Custom focus tracker (Focus, Short Break, Long Break modes) that automatically logs completed focus sessions directly into the user's study timetable.
*   **AI Study Advisor Screen**: Renders personalized study recommendations, workload analysis, and study plans with a custom React Native markdown parser.
*   **Advanced Profile Settings**: Custom notification preferences, support ticket submission interface, password changing, profile editing, and developer links.

### ⚙️ Scalable REST API (Spring Boot & MongoDB)
*   **JWT Stateless Authentication**: Secure signup, login, profile updates, and password changes protected by stateless token validation.
*   **MongoDB Persistence**: Fully normalized data layer mapping Users, Course Subjects, Tasks, and Timetable Sessions.
*   **AI Integration Engine**: Dynamic prompt construction evaluating current workload metrics, timetable gaps, and task urgency to construct optimized study tactics.

---

## 🛠️ Technology Stack

### Frontend Client
*   **Core**: React Native & Expo (supports iOS, Android, and Web platforms)
*   **State Store**: Zustand (lightweight reactive store architecture)
*   **Form Control**: React Hook Form & Yup (robust schemas and inputs)
*   **Animations**: React Native Reanimated & Linear Gradients
*   **Icons**: Ionicons Vector Package
*   **Charts**: React Native Gifted Charts (visualizing study analytics)

### Backend Service
*   **Core Framework**: Spring Boot 3 (Java 17)
*   **Database Access**: Spring Data MongoDB
*   **Security Suite**: Spring Security & Jakarta Validation
*   **Utilities**: Project Lombok (reduces boilerplate code)
*   **Model Integration**: Gemini Pro API (via generative language endpoints)

---

## 📂 Project Architecture

```mermaid
graph TD
    subgraph Frontend Client (Expo/React Native)
        UI[Aesthetic Dark-Theme UI] --> Store[Zustand Stores: Auth, Task, Subject, Timetable, Timer]
        Store --> Service[Axios HTTP Services]
    end

    subgraph Backend REST API (Spring Boot)
        Service --> Controller[REST Controllers]
        Controller --> Sec[Spring Security & JWT Auth Filter]
        Sec --> SVC[Services: Auth, Task, Subject, Timetable, AI]
        SVC --> Repos[Spring Data MongoDB Repositories]
        SVC --> Gemini[Gemini Pro API]
    end

    subgraph Database
        Repos --> Mongo[(MongoDB Instance)]
    end
```

---

## 💻 Local Setup & Installation

### 1. Prerequisites
Ensure you have the following installed locally:
*   [Node.js](https://nodejs.org/) (v18+)
*   [Java Development Kit (JDK 17)](https://www.oracle.com/java/technologies/downloads/)
*   [Maven](https://maven.apache.org/download.cgi) (v3+)
*   [MongoDB](https://www.mongodb.com/try/download/community) (Local Server or MongoDB Atlas cloud URI)

### 2. Backend Server Configuration
1.  Navigate into the backend directory:
    ```bash
    cd backend
    ```
2.  Create a `.env` file in the `backend/` directory using `.env.example` as a template:
    ```env
    PORT=8080
    MONGO_URI=mongodb://localhost:27017/studentplanner
    JWT_SECRET=your_super_secure_jwt_secret_key_here
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
3.  Build and run the Spring Boot API:
    ```bash
    mvn clean spring-boot:run
    ```
    The server will run on `http://localhost:8080`.

### 3. Frontend Client Configuration
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables in `.env` or `src/constants/config.js` to point to your backend base URL:
    *   For local emulators, use your machine's local IP address (e.g. `http://192.168.x.x:8080`) instead of `localhost`.
4.  Start the Expo development server:
    ```bash
    npm run start
    ```
    *   Press `a` to load on an Android Emulator.
    *   Press `i` to load on an iOS Simulator.
    *   Press `w` to load in a Web Browser.

---

## 🛡️ Security Best Practices
*   Sensitive secrets (MongoDB Atlas connection keys, API credentials, and JWT keys) must be loaded dynamically using the `.env` configuration file.
*   Default fallback properties in `application.properties` are configured for safe **local development** (`mongodb://localhost:27017/studentplanner`) to prevent exposing cloud credentials in git history.
*   Client-side authentication handles session logouts by discarding stored JWT keys immediately.

---

## 📄 License
This project is licensed under the MIT License. Developed by Isula Mihisara.
