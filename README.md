# StudyNova - Smart Student Study Planner

StudyNova is a premium, modern study planner application designed to help students streamline their academic schedule, track daily tasks, organize course subjects, and receive smart AI-powered workload suggestions. Built with a stunning dark-theme aesthetic, harmony gradients, and smooth reactive components.

---

## 🚀 Key Features

*   **Dynamic Dashboard**: A comprehensive workload command center showing your active tasks, subject count, daily timetable sessions, and quick actions at a single glance.
*   **Generalized Task Tracker**: Easily log, view, edit, and filter your study tasks. Track estimated focus hours, due dates, reminder offsets, and set priority levels (High, Medium, Low).
*   **Subjects Directory**: Simple catalog to register your course name and course code to tie your study sessions and tasks together.
*   **Timetable Scheduler**: Stay ahead of your weekly classes and self-study blocks with a dedicated daily/weekly schedule planner.
*   **AI Study Advisor**: An advanced prompt engine integrated with Gemini Pro that evaluates your current workload, timetable gaps, and task priorities to draft a highly customized execution schedule and study strategy.

---

## 🛠️ Technology Stack

### Frontend Client
*   **Core**: React Native & Expo
*   **State Management**: Zustand (lightweight, reactive store architecture)
*   **Form Validation**: React Hook Form & Yup
*   **Navigation**: React Navigation (Native Stack, Bottom Tabs)
*   **Design System**: Harmonious dark mode UI tailored with Vanilla CSS Stylesheet, Linear Gradients, and Ionicons vector package.

### Backend REST API
*   **Framework**: Spring Boot (Java 17)
*   **Database**: MongoDB (Spring Data MongoDB)
*   **Security**: Spring Security integrated with stateless JWT token validation
*   **Validation**: Spring Boot Starter Validation
*   **Dev Productivity**: Project Lombok

---

## 💻 Local Setup & Installation

### 1. Prerequisites
*   Node.js (v18+)
*   Java Development Kit (JDK 17+)
*   Maven (v3+)
*   MongoDB Instance (Local or MongoDB Atlas cloud cluster)

### 2. Backend Server Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Configure your environment variables in `.env` (using `.env.example` as a template):
    ```env
    PORT=8080
    MONGO_URI=mongodb://localhost:27017/studynova
    JWT_SECRET=your_super_secure_jwt_secret_key_here
    GEMINI_API_KEY=your_optional_gemini_api_key
    ```
3.  Build and run the Spring Boot API:
    ```bash
    mvn spring-boot:run
    ```

### 3. Frontend Client Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Expo development server:
    ```bash
    npm run start
    ```
    *   Press `a` to run on Android emulator.
    *   Press `i` to run on iOS simulator.
    *   Press `w` to run in web browser mode.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE). Developed with passion by Isula Mihisara.
