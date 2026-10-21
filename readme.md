# 🎓 Open LMS

> **A Next-Generation, Full-Stack Learning Management System**  
> Designed and built for seamless academic collaboration, course delivery, assignment workflows, interactive assessments, and modern grading.

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build%20Tool-Vite%205-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%204.1%20%2F%203.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Language-Java%2017-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208.x-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand%20%2B%20TanStack%20Query-443e3e)](https://zustand-demo.pmnd.rs/)
[![Academic](https://img.shields.io/badge/Project-MCA%203rd%20Sem%20PBL-blueviolet)](#project-team--academic-credits)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Project Highlights & Key Features](#-project-highlights--key-features)
  - [Student Workspace](#1-student-workspace)
  - [Instructor & Faculty Workspace](#2-instructor--faculty-workspace)
  - [Collaborative & Shared Tools](#3-collaborative--shared-tools)
- [System Architecture](#-system-architecture)
- [System Design Diagrams](#-system-design-diagrams)
  - [Entity-Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
  - [Level 2 Data Flow Diagram (DFD)](#level-2-data-flow-diagram-dfd)
- [Technology Stack](#-technology-stack)
- [Database Schema & Entities](#-database-schema--entities)
- [Project Directory Structure](#-project-directory-structure)
- [Installation & Getting Started](#-installation--getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup (Spring Boot + MySQL)](#1-backend-setup-spring-boot--mysql)
  - [2. Frontend Setup (React + Vite)](#2-frontend-setup-react--vite)
- [REST API Endpoints](#-rest-api-endpoints)
- [Future Roadmap](#-future-roadmap)
- [Project Team & Academic Credits](#-project-team--academic-credits)
- [License](#-license)

---

## 📖 Overview

**Open LMS** is a modern, unified Learning Management System created to bridge the gap between traditional classroom dynamics and digital education. Built as an MCA 3rd Semester Project-Based Learning (PBL) initiative at **Graphic Era Deemed to be University**, Open LMS replaces disjointed tools with an all-in-one platform for curriculum delivery, submission evaluation, real-time progress tracking, and student-teacher interactions.

### Why Open LMS?
- **Unified Academic Workflow:** Combines courses, assignments, timed quizzes, document rubrics, and direct messaging into one cohesive portal.
- **Role-Tailored Portals:** Clean separation of concerns with distinct environments optimized for students and educators.
- **Fast & Responsive Experience:** Built on modern frontend architecture (React 18, Vite, Tailwind CSS) with instantaneous state updates and offline mock fallbacks.
- **Robust Enterprise Backend:** Powered by Spring Boot, Spring Data JPA, and MySQL with entity relationships designed for scale.

---

## 🚀 Project Highlights & Key Features

### 1. Student Workspace

```
Dashboard ──► My Classes ──► Interactive Quizzes ──► Assignments ──► Academic Calendar
```

- **Personalized Student Dashboard:**
  - Weekly progress visualizer and learning streak counter.
  - Quick KPI stats: active classes, pending submissions, and cumulative GPA.
  - "Continue Learning" section highlighting current class materials.
  - Upcoming deadlines banner with smart countdown chips.
- **Course & Classroom Hub:**
  - Interactive course pages displaying modules, syllabus breakdowns, lecture notes, and downloadable assets.
  - Direct instructor contact details and office hour schedules.
- **Interactive Quiz Engine:**
  - Focus-mode quiz interface with question navigation, timer alerts, and multiple-choice question layout.
  - Instant score computation and answer review after submission.
- **Assignment Submission Center:**
  - Deadline tracking with automated status badges (*Pending*, *Submitted*, *Graded*).
  - File attachment support and rubric preview to understand scoring benchmarks before submitting.
- **Academic Calendar:**
  - Centralized schedule showing lectures, exam dates, submission cutoffs, and university events.

---

### 2. Instructor & Faculty Workspace

```
Teaching Overview ──► Course Management ──► Inline Grading ──► Gradebook Matrix
```

- **Faculty Overview Dashboard:**
  - Total enrolled students, active courses, and real-time pending grading counters.
  - Class average indicators and recent submission activity feeds.
- **Course Builder & Curriculum Manager:**
  - Tools to publish and structure course modules, add syllabus items, and distribute resources.
- **Submission Review & Inline Rubric Grading Suite:**
  - Document viewer for reviewing student submissions without external tools.
  - Criteria-based rubric grading with point sliders, preset comments, and overall submission feedback.
- **Dynamic Gradebook:**
  - Tabular grade matrix mapping enrolled students against all coursework and quizzes.
  - Automatic average calculations and grade distribution metrics.

---

### 3. Collaborative & Shared Tools

- **Direct Messages & Discussions:** Threaded conversations between faculty and students for queries, feedback, and assignment clarification.
- **Dual-Role Authentication & Role Switcher:** Fast switching between student and instructor views for demonstration and testing.
- **Resilient Data Layer:** Seamless transition between local mock fixtures (`VITE_USE_MOCKS=true`) for UI development and live Spring Boot REST endpoints (`VITE_USE_MOCKS=false`).

---

## 🏗 System Architecture

Open LMS employs a decoupled client-server architecture with standard RESTful communication:

```mermaid
flowchart TD
    subgraph Client ["Client Layer (React 18 + Vite)"]
        UI["Tailwind CSS UI Components"]
        Router["React Router v6"]
        State["Zustand + TanStack Query"]
        HTTP["Axios / Fetch Client Layer"]
    end

    subgraph Server ["Backend Layer (Spring Boot 4.x / 3.x)"]
        Sec["Spring Security & Auth Filters"]
        Controllers["REST Controllers (MVC)"]
        Services["Business Service Layer"]
        Repos["Spring Data JPA Repositories"]
    end

    subgraph Database ["Persistence Layer"]
        MySQL[("MySQL Relational Database")]
    end

    UI --> Router
    Router --> State
    State --> HTTP
    HTTP -- "JSON over HTTP / REST (Port 8081)" --> Sec
    Sec --> Controllers
    Controllers --> Services
    Services --> Repos
    Repos --> MySQL
```

---

## 📊 System Design Diagrams

### Entity-Relationship Diagram (ERD)

The relational schema maps out the interactions between Students, Faculty, Courses, Modules, Assignments, Quizzes, and Submissions:

<p align="center">
  <img width="950" alt="Open LMS Entity Relationship Diagram" src="https://github.com/user-attachments/assets/6fc48f01-9b6b-4a1f-8c33-dd429c01222e" />
</p>

### Level 2 Data Flow Diagram (DFD)

The Level 2 DFD illustrates detailed data movements across user authentication, course enrollment, assignment dispatch, quiz assessment, and grading pipelines:

<p align="center">
  <img width="1050" alt="Open LMS Level 2 Data Flow Diagram" src="https://github.com/user-attachments/assets/0d3a87cb-12f8-444b-be62-422c5366f780" />
</p>

---

## 💻 Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18.3](https://react.dev/) | Component-based interactive UI library |
| **Build & Bundler** | [Vite 5.4](https://vitejs.dev/) | Next-generation fast frontend tooling |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Utility-first responsive design system |
| **Client Routing** | [React Router v6](https://reactrouter.com/) | Client-side declarative routing and role layouts |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | Lightweight, predictable global state store |
| **Server State / Cache** | [TanStack React Query v5](https://tanstack.com/query) | Asynchronous query fetching and cache synchronization |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) | Clean and modern SVG icon set |
| **Date Manipulation** | [date-fns](https://date-fns.org/) | Modular date arithmetic and formatting |
| **Backend Framework** | [Spring Boot 4.1.1 / 3.x](https://spring.io/projects/spring-boot) | Enterprise Java backend framework |
| **Language** | [Java 17 (LTS)](https://www.oracle.com/java/) | Modern object-oriented programming language |
| **ORM / Data Access** | [Spring Data JPA / Hibernate](https://spring.io/projects/spring-data-jpa) | Relational data mapping and persistence |
| **Security** | [Spring Security](https://spring.io/projects/spring-security) | Authentication and role-based access control |
| **Database** | [MySQL 8.x](https://www.mysql.com/) | Relational database management system |
| **Build Management** | [Apache Maven](https://maven.apache.org/) | Backend build, testing, and dependency management |

---

## 🗄 Database Schema & Entities

The core JPA domain entities configured in `Backend/openlms`:

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Student    │         │    Course    │◄────────│   Faculty    │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │         │ id (PK)      │
│ name         │         │ courseName   │         │ name         │
│ email        │         │ courseCode   │         │ email        │
│ phone        │         │ description  │         │ phone        │
└──────────────┘         └──────┬───────┘         └──────────────┘
                                │
               ┌────────────────┴────────────────┐
               ▼                                 ▼
        ┌──────────────┐                  ┌──────────────┐
        │     Quiz     │                  │  Assignment  │
        ├──────────────┤                  ├──────────────┤
        │ id (PK)      │                  │ id (PK)      │
        │ title        │                  │ title        │
        │ totalMarks   │                  │ description  │
        │ courseId     │                  │ dueDate      │
        │ createdBy    │                  │ maxScore     │
        └──────────────┘                  └──────────────┘
```

1. **`Student` (`com.lms.openlms.entity.Student`)**: Represents enrolled students with identifier, full name, email address, and phone number.
2. **`Faculty` (`com.lms.openlms.entity.Faculty`)**: Represents educators and course creators managing academic curricula.
3. **`Course` (`com.lms.openlms.entity.Course`)**: Central subject entity containing `courseName`, `courseCode`, and syllabus description.
4. **`Quiz` (`com.lms.openlms.entity.Quiz`)**: Timed evaluations associated with a `courseId`, `totalMarks`, and creator metadata.
5. **`Assignment` (`com.lms.openlms.entity.Assignment`)**: Homework tasks, problem sets, and practicals submitted by students for rubric assessment.

---

## 📁 Project Directory Structure

```
open-lms/
├── Backend/
│   └── openlms/                           # Spring Boot Application
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/lms/openlms/
│       │   │   │   ├── entity/            # JPA Entities (Student, Faculty, Course, Quiz, Assignment)
│       │   │   │   ├── repository/        # Spring Data JPA Repositories (StudentRepository, etc.)
│       │   │   │   └── OpenlmsApplication.java  # Main Application Entry Point
│       │   │   └── resources/
│       │   │       └── application.properties   # Database and Server Port Configuration
│       │   └── test/                      # Unit and Integration Tests
│       ├── mvnw / mvnw.cmd                # Maven Wrapper Executables
│       └── pom.xml                        # Maven Dependencies & Build Configuration
│
├── Frontend/                              # React 18 + Vite Application
│   ├── public/                            # Static assets and icons
│   ├── src/
│   │   ├── app/
│   │   │   ├── router.jsx                 # Client-side routing configuration
│   │   │   └── providers.jsx              # React Query and app-level context providers
│   │   ├── components/
│   │   │   ├── layout/                    # StudentLayout, ProfessorLayout, Sidebar, Topbar
│   │   │   └── ui/                        # Button, Input, Modal, Card, StatusBadge, ProgressRing
│   │   ├── features/
│   │   │   ├── auth/                      # LoginPage, StudentSignupPage
│   │   │   ├── landing/                   # LandingPage, ChooseRolePage
│   │   │   ├── student/                   # Dashboard, Classes, QuizTaking, Assignments, Calendar
│   │   │   ├── professor/                 # Dashboard, Courses, SubmissionsGrading, Gradebook
│   │   │   ├── messages/                  # Real-time discussion & messaging threads
│   │   │   └── common/                    # NotFoundPage, error screens
│   │   ├── lib/
│   │   │   ├── auth.js                    # Local storage authentication token utilities
│   │   │   ├── http.js                    # Centralized API fetch wrapper with mock fallback
│   │   │   └── utils.js                   # Class merging (clsx/tailwind-merge) & formatters
│   │   ├── mocks/
│   │   │   └── mockData.js                # Rich domain fixtures for offline & standalone operation
│   │   ├── store/
│   │   │   └── authStore.js               # Zustand store for user profiles, roles, and auth state
│   │   ├── styles/                        # Global CSS and Tailwind directives
│   │   ├── main.jsx                       # Application bootstrap
│   │   ├── index.html                     # HTML root template
│   │   ├── package.json                   # Frontend dependencies & scripts
│   │   ├── tailwind.config.js             # Custom design tokens, colors & typography
│   │   └── vite.config.js                 # Vite development server configuration
│
└── readme.md                              # Main Project Documentation
```

---

## ⚙️ Installation & Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18.x or later) & **npm** (v9.x or later)
- **Java Development Kit (JDK 17)** or higher
- **MySQL Server 8.0+** running locally on port `3306`
- **Git**

---

### 1. Backend Setup (Spring Boot + MySQL)

#### A. Create the Database
Log in to your local MySQL instance and create the database schema:

```sql
CREATE DATABASE openlms;
```

#### B. Configure Database Credentials
Verify or update the configuration in `Backend/openlms/src/main/resources/application.properties`:

```properties
spring.application.name=openlms
spring.datasource.url=jdbc:mysql://localhost:3306/openlms
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8081
```

#### C. Run the Backend Application
Navigate to the backend directory and launch via the Maven wrapper:

**On Windows (PowerShell / Command Prompt):**
```powershell
cd Backend\openlms
.\mvnw.cmd spring-boot:run
```

**On macOS / Linux:**
```bash
cd Backend/openlms
chmod +x ./mvnw
./mvnw spring-boot:run
```

The backend server will start on `http://localhost:8081`.

---

### 2. Frontend Setup (React + Vite)

#### A. Install Dependencies
Open a new terminal window, navigate to the `Frontend` folder, and install packages:

```bash
cd Frontend
npm install
```

#### B. Choose Execution Mode (Mock vs Live Backend)

The frontend includes a built-in mock fallback with full student and professor data. You can configure mode via an `.env` file in the `Frontend/` folder:

```properties
# Set to 'true' for offline standalone mode (uses realistic fixtures)
# Set to 'false' to communicate with the Spring Boot server
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://localhost:8081/api/v1
```

Set `VITE_USE_MOCKS=true` only when running the frontend without the backend. With
`VITE_USE_MOCKS=false`, registration and login use the Spring Boot authentication
endpoints and credentials are stored in the configured MySQL database.

#### C. Run Development Server
```bash
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

#### D. Quick Login Credentials (Demo / Mock Mode)
- **Student Profile:** Any student email (e.g. `rahul.sharma@geu.edu`) or password.
- **Faculty Profile:** Include `prof` or `priya` in the email (e.g. `priya.sharma@geu.edu`) to automatically sign in with instructor permissions.

---

## 📡 REST API Endpoints

The backend exposes RESTful endpoints for frontend consumption:

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user and issue session token | Public |
| `GET` | `/api/v1/students` | Retrieve list of all enrolled students | Faculty / Admin |
| `GET` | `/api/v1/students/{id}` | Retrieve specific student profile | Student / Faculty |
| `POST` | `/api/v1/students` | Register a new student profile | Public / Admin |
| `GET` | `/api/v1/courses` | List all available academic courses | Authenticated |
| `POST` | `/api/v1/courses` | Create a new course syllabus | Faculty |
| `GET` | `/api/v1/courses/{id}` | Retrieve detailed course curriculum & modules | Authenticated |
| `GET` | `/api/v1/quizzes/course/{courseId}` | Fetch quizzes associated with a course | Authenticated |
| `POST` | `/api/v1/quizzes` | Publish an interactive quiz | Faculty |
| `POST` | `/api/v1/assignments/submit` | Submit student assignment document | Student |
| `POST` | `/api/v1/grades/rubric` | Submit rubric grading and evaluation feedback | Faculty |

---

## 🗺 Future Roadmap

- [ ] **Real-time WebSockets:** Live messaging and instant notification badges for grades and announcements.
- [ ] **AI-Assisted Quiz & Rubric Generator:** Automated draft generation of assessment questions from course lecture notes.
- [ ] **Video Lecture Integration:** Native video streaming with timestamped lecture notes and progress synchronization.
- [ ] **Plagiarism & Document Scanner:** Automated integrity checks on student file submissions.
- [ ] **Exportable Reports:** One-click PDF/Excel grade sheet export for department administration.

---

## 👥 Project Team & Academic Credits

Developed as part of the **MCA 3rd Semester Project-Based Learning (PBL)** curriculum at **Graphic Era Deemed to be University (GEU)**, Dehradun, Uttarakhand, India.

### 🌟 Core Contributors
- **Navdeep Bhatt** ([@Navdeepbhatt08](https://github.com/Navdeepbhatt08))
- **Mayank Kumar** ([@mayank78geu](https://github.com/mayank78geu))
- **Jatin Kadiyan**
- **Ishu Kumar** ([@ishukumar958](https://github.com/ishukumar958))

---

## 📄 License

This project is developed for educational and academic purposes under the MCA curriculum. Feel free to use, modify, and reference this repository in accordance with standard open-source academic guidelines.