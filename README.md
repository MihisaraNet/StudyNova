# ✨ StudyNova: Smart Student Study Planner

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/Frontend-React%20Native%20%7C%20Expo-blue.svg)](https://reactnative.dev/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.x-green.svg)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Deployment-Docker%20Compose-blue.svg)](https://www.docker.com/)
[![AI Integration](https://img.shields.io/badge/AI-Gemini%20Pro-orange.svg)](https://deepmind.google/technologies/gemini/)

StudyNova is a premium, state-of-the-art smart student study planner application designed to elevate the academic experience. Built with a stunning dark-theme aesthetic, harmony gradients, and smooth reactive components, StudyNova helps students organize course subjects, track tasks, manage class schedules, run Pomodoro focus sessions, analyze performance trends, and receive highly tailored AI-powered workload evaluations.

---

## 🌟 Key Features

### 📊 Workload Command Center (Dashboard)
*   **Intuitive Overview**: A sleek single-page dashboard containing active tasks, course directories, daily class/study timetables, and recent performance indicators.
*   **Quick Action Hub**: Seamless navigation shortcuts to add tasks, log study hours, or activate the Pomodoro timer.

### 📝 Task Tracking System
*   **Granular Fields**: Log and manage study tasks complete with priority levels (High, Medium, Low), due dates, focus hour estimates, and customized local reminder offsets.
*   **Progress Tracking**: Mark tasks as in-progress or completed, automatically feeding into your performance analytics.

### 📚 Course Subjects Catalog
*   **Dynamic Directory**: Create, update, and manage your course subjects alongside custom color indicators and course codes.
*   **Cohesive Association**: Group task entries and weekly timetable blocks under specific course codes for simplified organization.

### 📅 Timetable & Schedule Organizer
*   **Weekly Calendar View**: Plan and track recurring classes, tutorials, and dedicated self-study blocks.
*   **Smart Reminders**: Automatically schedule local notifications to trigger before classes or self-study sessions commence.

### ⏱️ Pomodoro Focus Timer
*   **Immersive Focus Mode**: A beautiful full-screen Pomodoro timer built to keep you on-task.
*   **Customizable Intervals**: Tune focus periods, short breaks, and long breaks to fit your specific study patterns.
*   **Automatic Logging**: Focus sessions completed are directly converted into analytics data.

### 📈 Detailed Performance Analytics
*   **Study Time Trends**: Beautiful charts tracking your weekly study hours.
*   **Task Performance Ratios**: Interactive widgets illustrating high, medium, and low priority task completion statistics.

### 🤖 Gemini-Powered AI Study Advisor
*   **Custom Strategies**: An advanced prompt engine integrated with Gemini Pro that analyzes your current task list, timetable commitments, and priority levels.
*   **Tailored Action Plan**: Outputs a bespoke daily study timetable and execution strategy to help you beat academic overload.

---

## 🎨 Design & Aesthetic System
*   **Premium Dark UI**: Immersive dark mode layout featuring deep navy/charcoal backgrounds, neon purple accent highlights, and glassmorphic card layers.
*   **Harmonious Gradients**: Vibrant linear gradient backdrops providing premium visual cues and high engagement.
*   **Micro-interactions**: Smooth transitions, loading spinners, tactile feedback alerts, and interactive overlays.

---

## 🏗️ Architecture & Technology Stack

### Frontend Mobile App
*   **Framework**: React Native & Expo SDK
*   **State Management**: Zustand (Clean, reactive, and stateless store module)
*   **Form & Validation**: React Hook Form with Yup schema integration
*   **Navigation**: React Navigation (Native Stack & Bottom Tabs)
*   **Icons**: Ionicons vector package

### Backend REST API
*   **Framework**: Java Spring Boot 3.x
*   **Security & Auth**: Spring Security configured with stateless JWT authentication, password hashing, and token verification
*   **Database Interface**: Spring Data MongoDB
*   **AI Integration**: RestTemplate/WebClient client for Gemini Pro API endpoints
*   **Lombok**: Reduces boilerplate code for getters, setters, and builders

### Database & Operations
*   **Primary Database**: MongoDB (NoSQL document storage optimized for highly extensible schemas)
*   **Deployment**: Fully containerized multi-stage Docker builds running inside a bridged Docker network

---

## 🚀 Local Development Setup

### Option 1: Quick Launch via Docker Compose (Recommended)
Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

1.  Clone this repository to your local directory.
2.  Open the `docker-compose.yml` file and configure your `GEMINI_API_KEY`:
    ```yaml
    environment:
      - GEMINI_API_KEY=your_actual_gemini_api_key
    ```
3.  Launch the entire stack from the root directory:
    ```bash
    docker-compose up --build -d
    ```
4.  The backend server will spin up on `http://localhost:8080` and a MongoDB instance will mount on `mongodb://localhost:27017/studentplanner`.

---

### Option 2: Manual Step-by-Step Installation

#### 1. Prerequisites
*   Node.js (v18+)
*   Java Development Kit (JDK 17+)
*   Maven (v3+)
*   Running MongoDB Instance (Local or MongoDB Atlas)

#### 2. Backend Server Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Configure your environment variables inside a `.env` file (refer to `.env.example` as a template):
    ```env
    PORT=8080
    MONGO_URI=mongodb://localhost:27017/studentplanner
    JWT_SECRET=***REMOVED***
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
3.  Install dependencies and build the artifact:
    ```bash
    mvn clean install
    ```
4.  Run the Spring Boot application:
    ```bash
    mvn spring-boot:run
    ```

#### 3. Frontend Client Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Create a `.env` file or configure your Expo API endpoint. Refer to `.env.example`:
    ```env
    EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Launch the Expo development server:
    ```bash
    npm run start
    ```
    *   Press `a` to run on Android emulator.
    *   Press `i` to run on iOS simulator.
    *   Press `w` to launch the web client version in your browser.

---

## 🧪 Testing & Verification
*   **Backend Unit Tests**: Verify services and controllers using Spring Boot Starter Test (JUnit 5 & Mockito):
    ```bash
    cd backend
    mvn test
    ```
*   **API Validation**: You can access endpoints using Postman or cURL. Common endpoints include:
    *   `POST /api/auth/register` (Register a new account)
    *   `POST /api/auth/login` (Obtain JWT token)
    *   `GET /api/tasks` (Access user-specific tasks)

---

## 📄 License
This project is licensed under the [MIT License](LICENSE). Developed with passion by Isula Mihisara.

© 2026 Isula Mihisara. All Rights Reserved.
