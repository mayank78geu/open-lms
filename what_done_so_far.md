
# Open LMS — What's Done So Far

> **Last updated:** October 22, 2026
> **Repo:** [mayank78geu/open-lms](https://github.com/mayank78geu/open-lms)
> **Latest commit:** `2e32de8` — *feat: Add Quiz and Submission functionality (Merged PR #9)*

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Structure](#2-repository-structure)
3. [Backend — Spring Boot](#3-backend--spring-boot)
4. [Frontend — React + Vite](#4-frontend--react--vite)
5. [Git Branches and Contribution History](#5-git-branches-and-contribution-history)
6. [What Is NOT Done Yet](#6-what-is-not-done-yet)

---

## 1. Project Overview

**Open LMS** is a Next-Generation Learning Management System being built for **Graphic Era University (GEU)**. It is a full-stack web application supporting two user roles:

| Role | Access |
|------|--------|
| **Student** | Dashboard, enrolled courses, assignments, quizzes, calendar, messages |
| **Professor** | Dashboard, course management, assignment grading, gradebook, messages |

The project is a **monorepo** with two independent sub-projects:
- `Backend/openlms/` — Spring Boot REST API
- `Frontend/` — React (Vite) SPA

---

## 2. Repository Structure

```
OPEN-LMS/
├── Backend/
│   └── openlms/
│       ├── pom.xml
│       └── src/main/java/com/lms/openlms/
│           ├── OpenlmsApplication.java
│           ├── config/             # Spring Security config
│           ├── controller/         # REST controllers
│           ├── dto/                # Request/Response DTOs
│           ├── entity/             # JPA entities (DB tables)
│           └── repository/         # Spring Data JPA repos
├── Frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx
│       ├── app/                    # Router and providers
│       ├── components/
│       │   ├── layout/             # Sidebar, Topbar, Layouts
│       │   └── ui/                 # Button, Card, Input, etc.
│       ├── features/
│       │   ├── auth/               # Login, Signup
│       │   ├── landing/            # Landing, Role chooser
│       │   ├── student/            # Student workspace pages
│       │   ├── professor/          # Professor workspace pages
│       │   ├── messages/           # Messaging page
│       │   └── common/             # NotFoundPage
│       ├── lib/                    # auth.js, http.js, utils.js
│       ├── mocks/                  # Mock data for dev/demo
│       └── store/                  # Zustand state stores
├── readme.md
├── package.json
└── what_done_so_far.md
```

---

## 3. Backend — Spring Boot

### 3.1 Tech Stack

| Technology | Version / Notes |
|------------|-----------------|
| **Spring Boot** | 4.1.1 |
| **Java** | 17 |
| **Spring Data JPA** | Hibernate ORM |
| **Spring Security** | 6.x (stateless, BCrypt) |
| **Spring Web MVC** | REST API |
| **MySQL Connector/J** | Runtime JDBC driver |
| **Spring Boot DevTools** | Hot reload |
| **Build Tool** | Maven (`mvnw`) |
| **Port** | `8081` |

### 3.2 Database and Configuration

- **Database:** MySQL — database name `open_lms`
- **URL:** `jdbc:mysql://localhost:3306/open_lms?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
- **Default dev credentials:** `root` / `root`
- **DDL mode:** `none` — schema managed manually, Hibernate does NOT auto-create or alter tables
- **SQL logging:** enabled with formatting
- **`open-in-view`:** disabled (stateless API best practice)

### 3.3 Data Model — All 12 JPA Entities

All entities use Jakarta Persistence (JPA) annotations in `com.lms.openlms.entity`.

#### `roles` — `Role.java`

| Column | Type | Notes |
|--------|------|-------|
| `role_id` | BIGINT PK | Auto-generated |
| `role_name` | VARCHAR(50) | Unique — `STUDENT`, `FACULTY` |

#### `users` — `User.java`

Unified user table for both students and professors (replaced old `Faculty.java` and `Student.java`).

| Column | Type | Notes |
|--------|------|-------|
| `user_id` | BIGINT PK | Auto-generated |
| `name` | VARCHAR(100) | Not null |
| `email` | VARCHAR(150) | Unique, not null |
| `password_hash` | TEXT | BCrypt, not null |
| `role_id` | BIGINT FK to roles | Eager loaded |
| `is_active` | BOOLEAN | Default true |

#### `courses` — `Course.java`

| Column | Type | Notes |
|--------|------|-------|
| `course_id` | BIGINT PK | Auto-generated |
| `course_name` | VARCHAR(150) | Not null |
| `course_code` | VARCHAR(50) | Unique, not null |
| `professor_id` | BIGINT FK to users | Eager loaded |
| `description` | *(transient)* | Not persisted yet |
| `section` | *(transient)* | Default "Section 01", not persisted |

#### `enrollments` — `Enrollment.java`

Maps students to courses (many-to-many junction table).

| Column | Type | Notes |
|--------|------|-------|
| `enrollment_id` | BIGINT PK | Auto-generated |
| `course_id` | BIGINT FK to courses | Unique constraint with student_id |
| `student_id` | BIGINT FK to users | Unique constraint with course_id |

#### `assignments` — `Assignment.java`

| Column | Type | Notes |
|--------|------|-------|
| `assignment_id` | BIGINT PK | Auto-generated |
| `course_id` | BIGINT FK to courses | Eager loaded |
| `title` | VARCHAR(150) | Not null |
| `due_date` | DATETIME | `LocalDateTime`, not null |
| `max_marks` | INT | Not null |
| `created_by` | BIGINT FK to users | Eager loaded |
| `description` | *(transient)* | Not persisted yet |

#### `submissions` — `Submission.java`

One submission per student per assignment (unique constraint).

| Column | Type | Notes |
|--------|------|-------|
| `submission_id` | BIGINT PK | Auto-generated |
| `assignment_id` | BIGINT FK | Unique with student_id |
| `student_id` | BIGINT FK | Unique with assignment_id |
| `status` | VARCHAR(50) | Default "Submitted" |
| `marks_obtained` | INT | Nullable before grading |
| `submission_text` | *(transient)* | Not persisted yet |

#### `quizzes` — `Quiz.java`

| Column | Type | Notes |
|--------|------|-------|
| `quiz_id` | BIGINT PK | Auto-generated |
| `course_id` | BIGINT FK to courses | Eager loaded |
| `title` | VARCHAR(150) | Not null |
| `total_marks` | INT | Not null |
| `created_by` | BIGINT FK to users | Eager loaded |
| questions | OneToMany to QuizQuestion | Cascade ALL, lazy |

#### `quiz_questions` — `QuizQuestion.java`

| Column | Type | Notes |
|--------|------|-------|
| `question_id` | BIGINT PK | |
| `quiz_id` | BIGINT FK | |
| `question_text` | TEXT | Not null |
| `marks` | INT | Per-question marks |
| options | OneToMany to QuizOption | Cascade ALL |

#### `quiz_options` — `QuizOption.java`

| Column | Type | Notes |
|--------|------|-------|
| `option_id` | BIGINT PK | |
| `question_id` | BIGINT FK | |
| `option_text` | VARCHAR(500) | Not null |
| `is_correct` | BOOLEAN | Marks the correct answer |

#### `quiz_attempts` — `QuizAttempt.java`

One attempt per student per quiz.

| Column | Type | Notes |
|--------|------|-------|
| `attempt_id` | BIGINT PK | |
| `quiz_id` | BIGINT FK | Unique with student_id |
| `student_id` | BIGINT FK | Unique with quiz_id |
| `score` | INT | Nullable before grading |
| `status` | VARCHAR(50) | e.g. IN_PROGRESS, SUBMITTED |

#### `quiz_answers` — `QuizAnswer.java`

Per-question answer for each attempt.

| Column | Type | Notes |
|--------|------|-------|
| `answer_id` | BIGINT PK | |
| `attempt_id` | BIGINT FK | |
| `question_id` | BIGINT FK | |
| `selected_option_id` | BIGINT FK | |

#### `resources` — `Resource.java`

Course file uploads.

| Column | Type | Notes |
|--------|------|-------|
| `resource_id` | BIGINT PK | |
| `course_id` | BIGINT FK | |
| `title` | VARCHAR(150) | Not null |
| `file_url` | VARCHAR(500) | Not null |
| `uploaded_by` | BIGINT FK to users | |

---

### 3.4 Repositories (Data Access Layer)

All repositories extend `JpaRepository` in `com.lms.openlms.repository`.

| Repository | Notable Custom Queries |
|------------|----------------------|
| `UserRepository` | `findByEmail`, `findByRoleRoleName`, `findByRoleRoleId` |
| `RoleRepository` | `findByRoleNameIgnoreCase` |
| `CourseRepository` | `findByProfessorUserId` |
| `EnrollmentRepository` | `findByStudentUserId`, `findByCourseCourseId`, `existsByCourseCourseIdAndStudentUserId`, `countByCourseCourseId` |
| `AssignmentRepository` | `findByCourseCourseId` |
| `SubmissionRepository` | `findByAssignmentAssignmentId`, `findByStudentUserId`, `findByAssignmentCourseCourseId` |
| `QuizRepository` | `findByCourseCourseId` |
| `QuizQuestionRepository` | `findByQuizQuizId` |
| `QuizOptionRepository` | `findByQuestionQuestionId` |
| `QuizAttemptRepository` | `findByQuizQuizIdAndStudentUserId`, `findByStudentUserId` |
| `QuizAnswerRepository` | `findByAttemptAttemptId` |
| `ResourceRepository` | `findByCourseCourseId` |
| `StudentRepository` | *(legacy, basic queries)* |

### 3.5 DTOs (Data Transfer Objects)

Located in `com.lms.openlms.dto`:

| DTO File | Inner Classes |
|----------|--------------|
| `AuthDtos.java` | `LoginRequest`, `RegisterRequest`, `AuthResponse` |
| `CourseDto.java` | `CourseRequest`, `CourseResponse`, `CourseListItem` |
| `AssignmentDto.java` | `AssignmentRequest`, `AssignmentResponse`, `AssignmentListItem` |
| `QuizDto.java` | `QuizRequest`, `QuizResponse`, `QuizQuestionDto`, `QuizOptionDto`, `QuizAttemptRequest`, `QuizAttemptResponse`, `QuizAnswerDto` |
| `SubmissionDto.java` | `SubmissionRequest`, `SubmissionResponse`, `SubmissionGradeRequest` |

### 3.6 Controllers (REST API)

**Base path:** `/api/v1`

#### `AuthController` — `/api/v1/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user (Student or Faculty) |
| `POST` | `/api/v1/auth/login` | Authenticate and return user info + token |

**Register body:**
```json
{ "name": "Rahul Sharma", "email": "rahul.sharma@geu.edu", "password": "pass123", "roleName": "STUDENT" }
```

**Login body:**
```json
{ "email": "rahul.sharma@geu.edu", "password": "pass123" }
```

**Response:**
```json
{ "userId": 1, "name": "Rahul Sharma", "email": "rahul.sharma@geu.edu", "role": "STUDENT", "roleId": 2, "token": "session-1", "isActive": true }
```

> **Note:** Token is a placeholder (`"session-<userId>"`) — JWT is not yet implemented.

### 3.7 Security and CORS

- **Password Encoding:** BCrypt (strength 10)
- **Session Policy:** STATELESS — no HTTP sessions
- **CSRF:** Disabled
- **Authorization:** All routes are currently public (`permitAll`) — no role enforcement yet
- **CORS:** All origins allowed (`*`), methods: GET, POST, PUT, PATCH, DELETE, OPTIONS

---

## 4. Frontend — React + Vite

### 4.1 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **Vite** | 5.4.8 | Build tool and dev server |
| **React Router DOM** | 6.26.2 | Client-side routing |
| **Zustand** | 4.5.5 | State management |
| **TailwindCSS** | 3.4.13 | Styling |
| **Lucide React** | 0.447.0 | Icons |
| **@tanstack/react-query** | 5.59.0 | Server state (installed, not yet used heavily) |
| **date-fns** | 3.6.0 | Date formatting |
| **clsx + tailwind-merge** | — | Class name utilities |

**Backend URL:** `http://localhost:8081/api/v1`
**Demo mode:** `VITE_USE_MOCKS=true` env variable

### 4.2 Application Entry and Routing

**Entry:** `src/main.jsx` → `src/app/router.jsx`

**Full Route Map:**

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `LandingPage` | Public |
| `/choose-role` | `ChooseRolePage` | Public |
| `/login` | `LoginPage` | Public |
| `/signup/student` | `StudentSignupPage` | Public |
| `/signup/professor` | `StudentSignupPage` | Public (shared form) |
| `/student/home` | `StudentDashboardPage` | Student |
| `/student/classes` | `StudentClassesPage` | Student |
| `/student/classes/:courseId` | `CourseDetailPage` | Student |
| `/student/calendar` | `StudentCalendarPage` | Student |
| `/student/assignments` | `StudentAssignmentsPage` | Student |
| `/student/classes/:courseId/quizzes/:quizId` | `QuizTakingPage` | Student, fullscreen |
| `/professor/overview` | `ProfessorDashboardPage` | Professor |
| `/professor/courses` | `ProfessorCoursesPage` | Professor |
| `/professor/submissions` | `SubmissionsGradingPage` | Professor |
| `/professor/gradebook` | `ProfessorGradebookPage` | Professor |
| `/messages` | `MessagesPage` | Shared |
| `*` | `NotFoundPage` | Fallback |

> Route protection (auth guards) is NOT yet implemented.

### 4.3 State Management

**File:** `src/store/authStore.js` — Zustand

**State:** `{ user, isAuthenticated, role }`

**Actions:**
- `login(email, password, role, remember)` — hits `/api/v1/auth/login` or mock
- `register({ name, email, password })` — hits `/api/v1/auth/register` or mock
- `logout()` — clears storage and resets state
- `switchRole(newRole)` — dev-only, switches mock user

### 4.4 HTTP and Auth Utilities

- **`src/lib/http.js`** — `apiRequest()` fetch wrapper: auto-attaches Bearer token, normalizes errors
- **`src/lib/auth.js`** — `authStorage`: manages token + user in localStorage/sessionStorage based on `remember` flag
- **`src/lib/utils.js`** — `cn()` class merge utility, `COURSE_ACCENTS` color map

### 4.5 Pages and Features

#### Landing / Public

| Page | Description |
|------|-------------|
| `LandingPage.jsx` | Marketing page: hero, "Why Open LMS" section, testimonials, CTA |
| `ChooseRolePage.jsx` | Student vs. Professor role selection before signup |

#### Authentication

| Page | Description |
|------|-------------|
| `LoginPage.jsx` | Two-panel layout (dark testimonial + login form). Supports email/password, "keep me signed in", quick demo fill buttons, Google SSO button (UI only). Connects to real backend when not in mock mode |
| `StudentSignupPage.jsx` | 3-step wizard: Step 1 credentials (name, email, password), Step 2 academic info (program, year, student ID, class code), Step 3 confirmation. Connects to `/api/v1/auth/register`. Used for both student and professor paths |

#### Student Workspace

| Page | Description |
|------|-------------|
| `StudentDashboardPage.jsx` | Hero "week at a glance" card, stats (classes, due dates, grade, streak), course progress cards, deadlines list, AI study plan drawer (mock) |
| `StudentClassesPage.jsx` | Color-coded enrolled course cards with search/filter |
| `CourseDetailPage.jsx` | Tabbed course view: overview, assignments, quizzes, resources |
| `StudentAssignmentsPage.jsx` | All assignments across courses with status (submitted/pending/overdue) |
| `StudentCalendarPage.jsx` | Monthly/weekly calendar with due dates and schedule |
| `QuizTakingPage.jsx` | Fullscreen quiz experience: question nav, MCQ options, timer, progress, submit confirmation |

#### Professor Workspace

| Page | Description |
|------|-------------|
| `ProfessorDashboardPage.jsx` | Teaching overview hero, stats (courses, students, submissions, avg grade), course list, submission queue |
| `ProfessorCoursesPage.jsx` | Courses grid with enrollment count and actions |
| `SubmissionsGradingPage.jsx` | Submission list + grading panel (marks, feedback, grade button) |
| `ProfessorGradebookPage.jsx` | Gradebook table — student grades across assignments |

#### Shared

| Page | Description |
|------|-------------|
| `MessagesPage.jsx` | Two-panel messaging (thread list + conversation). Role-aware sender labels. Reply works via local state |
| `NotFoundPage.jsx` | 404 fallback |

### 4.6 Reusable UI Components

**Layout components:**

| Component | Description |
|-----------|-------------|
| `Sidebar.jsx` | Role-aware sidebar with different nav links for Student vs. Professor |
| `Topbar.jsx` | User avatar, dev role switcher, notifications placeholder, logout |
| `DashboardLayouts.jsx` | `StudentLayout` and `ProfessorLayout` (Sidebar + Topbar + content) |

**UI primitives:**

| Component | Features |
|-----------|----------|
| `Button.jsx` | Variants: `primary`, `secondary`, `ghost`, `danger`; sizes: `sm`, `md`, `lg`; `isLoading` spinner |
| `Input.jsx` | Labeled input with error state; `PasswordInput` with show/hide toggle and forgot-password link |
| `Card.jsx` | Base `Card` + `StatCard` for stat numbers |
| `Badge.jsx` | Color-coded status badges |
| `Avatar.jsx` | Initials-based avatar |
| `Modal.jsx` | Overlay modal dialog |
| `ProgressRing.jsx` | Circular SVG ring + linear `ProgressBar` |

### 4.7 Mock Data Layer

**File:** `src/mocks/mockData.js`

| Export | Contents |
|--------|----------|
| `MOCK_USERS` | Student (Rahul Sharma) and Professor (Dr. Priya Sharma) |
| `MOCK_STUDENT_DASHBOARD` | Stats, course cards with progress, deadlines, AI plan |
| `MOCK_PROFESSOR_DASHBOARD` | Teaching stats, course list, submission queue |
| `MOCK_COURSES` | 4 courses: BIO 214, DES 202, MATH 150, PHY 301 |
| `MOCK_ASSIGNMENTS` | Assignments with due dates and statuses |
| `MOCK_QUIZZES` | Quiz metadata |
| `MOCK_QUIZ_QUESTIONS` | Full MCQ question sets with 4 options each |
| `MOCK_SUBMISSIONS` | Grading status and marks |
| `MOCK_RESOURCES` | File resource entries |
| `MOCK_MESSAGES` | Conversation threads |

---

## 5. Git Branches and Contribution History

| Branch | Purpose |
|--------|---------|
| `master` | Main integration branch |
| `database-navdeep` | Database, entities, repos, backend API (Navdeep Bhatt) |
| `frontend-by-jatin` | Frontend development (Jatin) |

**Pull Requests merged:**

| PR | Summary |
|----|---------|
| #1, #2 | Initial backend setup; Faculty and Student entities (now replaced by User) |
| #3 | Assignment entity added |
| #4, #5 | Mock data restructure, bug fixes |
| #6 | Root-level `package.json` and `package-lock.json` added |
| #7 | Comprehensive project `readme.md` (410+ lines) added |
| #8 | Frontend refinements; file renames (`Courses.java` to `Course.java`, `Quizzes.java` to `Quiz.java`); pom.xml project name updated |
| **#9** | **MAJOR** — Replaced Faculty/Student with unified `User` entity; added full Quiz system (QuizQuestion, QuizOption, QuizAttempt, QuizAnswer); added Submission, Enrollment, Resource, Role entities; added all 5 DTO files; added `AuthController` (register + login); added `SecurityConfig` (BCrypt, CORS, stateless); updated frontend auth store and login/signup to connect to real backend |

---

## 6. What Is NOT Done Yet

### Backend

- [ ] **JWT Authentication** — token is currently a placeholder `"session-<userId>"`; no signed JWT
- [ ] **Role-based Authorization** — all routes are `permitAll`; no `@PreAuthorize` or method security
- [ ] **Course Controller** — no REST endpoints to create, list, or enroll in courses
- [ ] **Assignment Controller** — no REST endpoints to create or fetch assignments
- [ ] **Quiz Controller** — no REST endpoints for quizzes or quiz-taking
- [ ] **Submission Controller** — no REST endpoints to submit assignments or grade them
- [ ] **Resource Controller** — no REST endpoints for course file resources
- [ ] **Service Layer** — no `@Service` classes; business logic sits directly in `AuthController`
- [ ] **File Upload** — `Resource.file_url` is a plain URL; no file storage (S3, local disk) integrated
- [ ] **Database Seeding / Migration** — `roles` table must be seeded manually; no Flyway or Liquibase
- [ ] **`description` and `section` persistence** in `Course.java` — currently `@Transient`
- [ ] **`description` persistence** in `Assignment.java` — currently `@Transient`
- [ ] **`submissionText` persistence** in `Submission.java` — currently `@Transient`

### Frontend

- [ ] **Route Guards / Auth Protection** — unauthenticated users can access all protected routes
- [ ] **Real API integration for courses, assignments, quizzes, submissions** — all pages still use mock data even when `VITE_USE_MOCKS=false`
- [ ] **Professor-specific signup fields** — professor signup reuses student form; no department or faculty ID fields
- [ ] **Google SSO** — button on login page shows "not configured" error; not implemented
- [ ] **Messages persistence** — messages are local React state only; not saved to any backend
- [ ] **Notifications** — topbar bell icon is a placeholder; no real notification data
- [ ] **Forgot Password flow** — link exists in login form; no implementation
- [ ] **File upload UI** — resources tab in `CourseDetailPage` shows list but has no upload functionality
- [ ] **Calendar backend sync** — calendar shows mock due dates only; no real API data
- [ ] **Real-time features** — no WebSocket or SSE for live updates (quiz timers, submission notifications)

---

> **Summary:** The project has a solid foundation. The frontend UI is nearly complete in design and layout, running fully in mock mode for easy demos. The backend has a well-structured normalized data model and a working Auth API (register + login with BCrypt). The main next steps are: building remaining backend controllers and a proper service layer, implementing JWT authentication, and wiring all frontend pages to real API data.
