# Open LMS — What's Done So Far

> **Last updated:** October 22, 2026  
> **Repo:** [mayank78geu/open-lms](https://github.com/mayank78geu/open-lms)  
> **Status:** Full-Stack LMS Implementation Complete (Phases 0–6)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Structure](#2-repository-structure)
3. [Backend — Spring Boot Architecture & APIs](#3-backend--spring-boot-architecture--apis)
4. [Frontend — React + Vite Client & Wiring](#4-frontend--react--vite-client--wiring)
5. [Database Migrations & Seed Data](#5-database-migrations--seed-data)
6. [Cloudinary File Storage Integration](#6-cloudinary-file-storage-integration)
7. [Completed Features vs Out-of-Scope Roadmap](#7-completed-features-vs-out-of-scope-roadmap)

---

## 1. Project Overview

**Open LMS** is a Next-Generation Learning Management System built for **Graphic Era University (GEU)**. It is a full-stack platform supporting role-based access for students and faculty:

| Role | Access & Capabilities |
|------|-----------------------|
| **STUDENT** | Personalized dashboard, enrolled courses, course joining via code, assignments, late submissions, realtime timed quizzes with immediate score/review, resources, and grades |
| **FACULTY** | Teaching dashboard, course creation & management, student roster control, assignment publishing, grading queue with rubric scoring & feedback, quiz builder, gradebook matrix, and file uploads |

The project is structured as a **monorepo**:
- `Backend/openlms/` — Spring Boot 4.1.1 (Java 17, Spring Data JPA, Spring Security, JWT HS256, MySQL)
- `Frontend/` — React 18, Vite, Tailwind CSS, Zustand, TanStack Query

---

## 2. Repository Structure

```
OPEN-LMS/
├── Backend/
│   └── openlms/
│       ├── db/                      # Sequential migration scripts & seed_demo.sql
│       ├── pom.xml
│       └── src/main/java/com/lms/openlms/
│           ├── OpenlmsApplication.java
│           ├── config/              # SecurityConfig, CloudinaryConfig
│           ├── controller/          # 9 REST controllers
│           ├── dto/                 # Domain DTOs
│           ├── entity/              # 12 JPA entities
│           ├── exception/           # Custom exceptions + GlobalExceptionHandler
│           ├── repository/          # Spring Data JPA repositories
│           ├── security/            # JwtService, JwtAuthFilter, AuthUser, Handlers
│           └── service/             # 10 @Transactional service classes
├── Frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── app/                     # Router and providers
│       ├── components/              # Layouts, UI primitives, FileUploader
│       ├── features/
│       │   ├── auth/                # Login, Student/Professor Signup
│       │   ├── landing/             # Landing, Role chooser
│       │   ├── student/             # Student workspace pages
│       │   ├── professor/           # Professor workspace pages
│       │   ├── messages/            # Messaging interface (mock)
│       │   └── common/              # NotFoundPage
│       ├── lib/                     # apiRequest, authStorage, utils
│       ├── mocks/                   # Mock fallback fixtures
│       └── store/                   # Zustand state stores (authStore)
├── docs/
│   └── SMOKE_TEST.md                # 15-minute manual smoke test checklist
├── api_implementation_plan.md       # API Specification and Agent Contract
├── readme.md
└── what_done_so_far.md
```

---

## 3. Backend — Spring Boot Architecture & APIs

### 3.1 Technology Stack

- **Framework:** Spring Boot 4.1.1 on Java 17
- **Security:** Stateless Spring Security, HS256 signed JWT (`io.jsonwebtoken`), BCrypt password hashing
- **Persistence:** Spring Data JPA with Hibernate, MySQL 8.x
- **Storage:** Cloudinary HTTP5 SDK for cloud asset management
- **Port:** `8081` with base path `/api/v1`

### 3.2 Implemented REST Controllers & Endpoints

| Domain | Controller | Endpoints |
|---|---|---|
| **Auth** | `AuthController` | `POST /auth/register`<br>`POST /auth/login`<br>`GET /auth/me` |
| **Courses** | `CourseController` | `POST /courses` (Faculty)<br>`GET /courses/my`<br>`GET /courses/{id}`<br>`PATCH /courses/{id}` (Faculty)<br>`DELETE /courses/{id}` (Faculty)<br>`POST /courses/join` (Student)<br>`DELETE /courses/{id}/leave` (Student)<br>`GET /courses/{id}/students` (Faculty)<br>`DELETE /courses/{id}/students/{studentId}` (Faculty) |
| **Assignments** | `AssignmentController` | `POST /courses/{courseId}/assignments` (Faculty)<br>`GET /courses/{courseId}/assignments`<br>`GET /assignments/my` (Student)<br>`GET /assignments/{id}`<br>`PATCH /assignments/{id}` (Faculty)<br>`DELETE /assignments/{id}` (Faculty) |
| **Submissions** | `SubmissionController` | `POST /assignments/{assignmentId}/submissions` (Student)<br>`GET /assignments/{assignmentId}/submissions/me` (Student)<br>`GET /assignments/{assignmentId}/submissions` (Faculty)<br>`GET /submissions/my` (Student)<br>`GET /submissions` (Faculty grading queue)<br>`PATCH /submissions/{submissionId}/grade` (Faculty) |
| **Quizzes** | `QuizController` | `POST /courses/{courseId}/quizzes` (Faculty)<br>`GET /courses/{courseId}/quizzes`<br>`GET /quizzes/{quizId}` (Sanitized student view / complete faculty view)<br>`DELETE /quizzes/{quizId}` (Faculty)<br>`POST /quizzes/{quizId}/attempts/start` (Student)<br>`POST /quizzes/{quizId}/attempts/submit` (Student)<br>`GET /quizzes/{quizId}/attempts/me` (Student)<br>`GET /quizzes/{quizId}/attempts` (Faculty) |
| **Resources** | `ResourceController` | `POST /courses/{courseId}/resources` (Faculty)<br>`GET /courses/{courseId}/resources`<br>`DELETE /resources/{id}` (Faculty) |
| **Dashboards** | `DashboardController` | `GET /dashboard/student` (Student)<br>`GET /dashboard/professor` (Faculty) |
| **Gradebook** | `GradebookController` | `GET /courses/{courseId}/gradebook` (Faculty)<br>`GET /courses/{courseId}/grades/me` (Student) |
| **Files** | `FileController` | `POST /files/upload` (Authenticated, multipart/form-data) |

### 3.3 Strict Layering & Security

- **Controller → Service → Repository**: Controllers are lightweight and contain no database logic.
- **Service Layer**: All business rules, role assertions, course membership validation, and transactions live in `@Service` classes.
- **Security & Authorization**: JWT token claims include `sub` (userId), `email`, `name`, and `role`. Protected endpoints enforce `@PreAuthorize("hasRole('STUDENT')")` or `@PreAuthorize("hasRole('FACULTY')")`, alongside `CourseAccessService` ownership and enrollment checks.
- **Error Format**: Uniform error payload (`timestamp`, `status`, `error`, `message`, `path`).

---

## 4. Frontend — React + Vite Client & Wiring

### 4.1 Client Features & State

- **Authentication:** `authStore` (Zustand) with local storage synchronization (`authStorage`), token refresh on app load via `GET /auth/me`.
- **Role Routing:** Dynamic role gating (`StudentLayout` vs. `ProfessorLayout`) based on the JWT role returned by the backend.
- **Live vs. Mock Execution:** Controlled by `VITE_USE_MOCKS=false`. When `false`, all course, assignment, quiz, resource, dashboard, and grading interactions talk directly to the Spring Boot REST API.
- **Quizzes:** Interactive quiz-taking engine with server-driven timers (`endsAt`), progress indicators, auto-submission on expiry, and immediate score breakdown without question leaks prior to submission.
- **Assignments & Grading:** Dynamic badges (`PENDING`, `SUBMITTED`, `APPROVED`, `REJECTED`, `OVERDUE`), resubmission workflows, and instructor grading panel.
- **File Uploader:** `FileUploader.jsx` drag-and-drop component with progress indicators and Cloudinary integration.

---

## 5. Database Migrations & Seed Data

The database schema is managed via sequential SQL scripts in `Backend/openlms/db/`:

1. `phase0_roles.sql` — Base roles (`STUDENT`, `FACULTY`)
2. `phase1_courses.sql` — Course description and section columns
3. `phase1_assignments.sql` — Assignment description and attachment URL columns
4. `phase2_resources.sql` — Resource description and upload timestamp columns
5. `phase2_submissions.sql` — Submissions text, file URL, feedback, grading timestamps, unique index
6. `phase3_quizzes.sql` — Quiz duration and attempt start/submission timestamps
7. `seed_demo.sql` — Idempotent demo dataset with faculty, students, courses, assignments, quizzes, and submissions

---

## 6. Cloudinary File Storage Integration

- **SDK:** `com.cloudinary:cloudinary-http5:2.0.0`
- **Environment Variables:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Upload Endpoint:** `POST /api/v1/files/upload`
- **Validation:** 10MB file limit, extension and MIME type whitelist, folder partitioning (`resources`, `assignments`, `submissions`).

---

## 7. Completed Features vs Out-of-Scope Roadmap

### Completed (100%)
- [x] Full JWT Authentication & Authorization (Roles: `STUDENT`, `FACULTY`)
- [x] Complete REST API Suite (Courses, Assignments, Submissions, Quizzes, Resources, Dashboards, Gradebook, Files)
- [x] All 10 Service classes with rigorous access controls
- [x] Frontend wiring for all student and professor pages to live backend APIs
- [x] Interactive quiz taking with timed sessions and immediate review
- [x] Inline assignment submission and grading workflow with feedback
- [x] Gradebook calculation matrix across assignments and quizzes
- [x] Cloudinary cloud upload integration with `FileUploader` component
- [x] Idempotent database seed script (`seed_demo.sql`) and migration documentation
- [x] Comprehensive 15-minute smoke test checklist (`docs/SMOKE_TEST.md`)

### Out-of-Scope / Retained as Mock / Future Roadmap
- [ ] **Messages Persistence** — Messaging UI uses local React state (mock)
- [ ] **Notifications Bell** — Topbar notification dropdown uses local mock items
- [ ] **Google SSO** — Button on login displays mock guidance
- [ ] **WebSockets** — Live real-time chat and push alerts
