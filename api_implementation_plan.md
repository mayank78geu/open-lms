# Open LMS — API Implementation Plan (Agent Contract)

> **Date:** October 22, 2026
> **Repo:** `mayank78geu/open-lms` (monorepo: `Backend/openlms/` Spring Boot, `Frontend/` React + Vite)
> **Audience:** Two AI coding agents (**Agent A**, **Agent B**) working in parallel on the same repo.
> **Status of this document:** Source of truth. If the code and this document disagree, or this document is ambiguous, **stop and ask Mayank**. Do not improvise across ownership boundaries.

---

## 0. How to use this document

1. Read sections 1–5 completely before writing any code. They apply to both agents.
2. Execute **only the tasks labelled with your agent letter**, in the order given in section 6.
3. Each task ends with a **Done when** checklist. A task is not finished until every box is true.
4. After each task: build, commit, sync, push (section 3), then move to your next task.
5. Never start a task whose **phase gate** (section 6) has not been met.

---

## 1. Project context (what exists today)

- **Backend:** Spring Boot 4.1.1, Java 17, Spring Data JPA (Hibernate), Spring Security (stateless, BCrypt), MySQL, Maven (`mvnw`), port **8081**, base path `/api/v1`. Verify real dependency versions in `pom.xml`; do not assume.
- **DB:** MySQL database `open_lms`, `spring.jpa.hibernate.ddl-auto=none` (**Hibernate does not create or alter tables**), `open-in-view=false`.
- **Existing entities (12):** `Role`, `User`, `Course`, `Enrollment`, `Assignment`, `Submission`, `Quiz`, `QuizQuestion`, `QuizOption`, `QuizAttempt`, `QuizAnswer`, `Resource`. Several fields are `@Transient` placeholders (`Course.description`, `Course.section`, `Assignment.description`, `Submission.submissionText`) — they become real columns in this plan.
- **Existing repositories:** all 12 exist with the finder methods listed in `what_done_so_far.md`. Add new finder methods as needed, but only in repositories your task owns (section 3.4).
- **Existing DTO files:** `AuthDtos`, `CourseDto`, `AssignmentDto`, `QuizDto`, `SubmissionDto` (static nested classes). **Read the existing file before editing it; extend it, do not rewrite it from scratch.**
- **Existing controller:** only `AuthController` (register + login). Token is a placeholder `session-<userId>`. All routes are `permitAll`.
- **Frontend:** React 18, Vite, React Router 6, Zustand (`authStore`), TailwindCSS, `@tanstack/react-query` (installed, barely used), `lib/http.js` (`apiRequest`), `lib/auth.js` (`authStorage`). Every page except login/signup currently renders **mock data** from `src/mocks/mockData.js`. `VITE_USE_MOCKS=true` is the demo-mode switch and must keep working.
- **Roles:** DB/API role names are `STUDENT` and `FACULTY`. The proposal and UI say "Professor"; in the API it is always `FACULTY`.

---

## 2. Global conventions (both agents, every task)

### 2.1 Package layout (backend, `com.lms.openlms`)

| Package | Content |
|---|---|
| `config` | Spring configuration (`SecurityConfig`, later `CloudinaryConfig`) |
| `security` | `JwtService`, `JwtAuthenticationFilter`, `AuthUser`, entry-point and access-denied handlers |
| `controller` | Thin REST controllers. **No business logic, no repository calls.** |
| `service` | `@Service` classes with `@Transactional`. **All business logic and authorization checks live here.** |
| `dto` | Request/response DTOs, one file per domain, static nested classes |
| `entity` | JPA entities |
| `repository` | Spring Data repositories |
| `exception` | Custom exceptions + `GlobalExceptionHandler` |

Controller → Service → Repository. A controller never touches a repository directly. A service never returns an entity from a public method that a controller sends to the client; it returns DTOs.

### 2.2 Authentication and authorization

- JWT, HS256. Library: `io.jsonwebtoken:jjwt-api / jjwt-impl / jjwt-jackson` (0.12.x, check current at build time).
- Header: `Authorization: Bearer <token>`.
- Claims: `sub` = userId (as string), `email`, `name`, `role` (`STUDENT` or `FACULTY`). Expiry 24 h (`app.jwt.expiration-ms=86400000`). Secret from `app.jwt.secret=${JWT_SECRET:<dev-default-at-least-32-chars>}`.
- Principal in controllers: `@AuthenticationPrincipal AuthUser user` where `AuthUser` is a record `(Long userId, String email, String role)`.
- Authorities are `ROLE_STUDENT` / `ROLE_FACULTY`. Use `@PreAuthorize("hasRole('FACULTY')")` on controller methods for role gating. Enable with `@EnableMethodSecurity`.
- **Public endpoints:** `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, and `OPTIONS` preflight. **Everything else requires a valid JWT.**
- Role checks are not enough. **Ownership/membership checks are mandatory and live in services** (e.g. a faculty can only modify courses where `professor_id` = their userId; a student can only read courses they are enrolled in). Use `CourseAccessService` (created in A0).

### 2.3 Authorization matrix (summary)

| Action | STUDENT | FACULTY |
|---|---|---|
| Create course | ✗ | ✓ |
| Read course / its content | only if enrolled | only if owner |
| Modify course, assignments, quizzes, resources | ✗ | only if owner |
| Join course by code | ✓ | ✗ |
| Submit assignment, attempt quiz | ✓ (enrolled) | ✗ |
| Grade submissions, view all submissions / attempts / gradebook | ✗ | only if owner of the course |

### 2.4 Errors

Every error returns this JSON (produced by `GlobalExceptionHandler`):

```json
{
  "timestamp": "2026-10-22T10:15:30",
  "status": 404,
  "error": "NOT_FOUND",
  "message": "Course not found",
  "path": "/api/v1/courses/99",
  "fieldErrors": [ { "field": "courseName", "message": "must not be blank" } ]
}
```

`fieldErrors` is present only for validation failures (400).

| Exception class | HTTP | `error` |
|---|---|---|
| `BadRequestException`, bean-validation failure, malformed JSON | 400 | `BAD_REQUEST` / `VALIDATION_FAILED` |
| `UnauthorizedException`, missing/invalid/expired JWT, bad login | 401 | `UNAUTHORIZED` |
| `ForbiddenException`, `AccessDeniedException` | 403 | `FORBIDDEN` |
| `ResourceNotFoundException` | 404 | `NOT_FOUND` |
| `ConflictException` | 409 | `CONFLICT` |
| Anything else | 500 | `INTERNAL_ERROR` (never leak stack traces) |

**Not-found vs forbidden rule:** if the user is not allowed to see a course/assignment/quiz at all (not owner, not enrolled), return **404**, not 403, to avoid leaking existence. Use 403 only when the user can see the thing but lacks the role for the action (e.g. a student calling a FACULTY-only endpoint).

### 2.5 Response conventions

- **No success envelope.** Success returns the DTO (or array) directly. This keeps the existing `AuthController` response shape and the frontend unchanged.
- Status codes: `201` for create (POST that creates a resource), `200` for reads/updates, `204` for deletes. Join/start/submit actions return `200`/`201` as specified per endpoint.
- IDs are `Long`. Dates are ISO-8601 `LocalDateTime` strings (`2026-11-05T23:59:00`), server timezone.
- JSON field names are `camelCase`. Booleans are named `isX` in JSON only where specified below.
- Lists return plain arrays, no pagination (PBL scale).
- Validate request DTOs with Jakarta Validation (`@NotBlank`, `@Size`, `@Min`, …) and `@Valid` in controllers (add `spring-boot-starter-validation` in A0 if missing).

### 2.6 Transaction and lazy-loading rule

`spring.jpa.open-in-view=false`. `Quiz.questions` and `QuizQuestion.options` are **lazy**. Always map entities to DTOs **inside** the `@Transactional` service method. Touching lazy collections in a controller will throw `LazyInitializationException`.

### 2.7 Database changes (manual schema)

Hibernate will not change the schema. Therefore:

- Each task that needs columns ships a SQL file at `Backend/openlms/db/<phase>_<name>.sql` (filenames given in each task). One file per task, so agents never edit the same file.
- The agent applies it to the local DB if reachable (`root`/`root`, DB `open_lms`); otherwise it states the exact file to run in its completion message to Mayank.
- If a column listed already exists in the real schema, skip that statement and mention it in the completion message.
- Add the matching field to the entity (remove `@Transient`) in the same commit as the SQL file.

### 2.8 Verification standard (every backend task)

1. `./mvnw -q -DskipTests compile` passes (from `Backend/openlms`).
2. App boots (`./mvnw spring-boot:run`) against the DB.
3. Each new endpoint is exercised with `curl` (or equivalent) for the happy path and at least one 401/403/404/400 case. Use real JWTs obtained via `/auth/login`.
4. Paste the commands used into the commit body only if short; otherwise just state the result in the completion message.

### 2.9 Frontend conventions (every frontend task)

- One API module per domain in `Frontend/src/lib/api/` (`authApi.js`, `coursesApi.js`, `resourcesApi.js`, `assignmentsApi.js`, `submissionsApi.js`, `quizzesApi.js`, `gradesApi.js`, `dashboardApi.js`, `filesApi.js`). They use `apiRequest` from `lib/http.js`. **Pages never call `fetch` directly.**
- Each API function checks `VITE_USE_MOCKS`: if true, return the existing mock data (shape-compatible with the real response); if false, call the backend. Pages do not branch on mock mode.
- Use `@tanstack/react-query` (`useQuery`/`useMutation`, invalidate on mutation) for server state. Show loading and error states using existing UI primitives (`Card`, `Badge`, `Button`, `Modal`, …).
- **Do not redesign the UI.** Keep layout, styling and copy. Only replace data sources and add missing forms/modals in the existing visual style.
- A `401` response anywhere triggers logout and redirect to `/login`.
- Verification: `npm run build` (from `Frontend/`) passes, and the flow works in the browser with `VITE_USE_MOCKS=false` against the running backend.

---

## 3. Git and parallel-work protocol

### 3.1 Working directories (important)

Both agents are in the same repository, but **two agents editing one working directory at the same time will overwrite each other's uncommitted changes and break each other's builds.** Each agent must have its own working directory on its own branch, created from the same repo:

```bash
# once, from the main checkout (Mayank or Agent A runs this)
git worktree add ../open-lms-agent-a -b agent-a origin/master
git worktree add ../open-lms-agent-b -b agent-b origin/master
```

Agent A works only in `../open-lms-agent-a`, Agent B only in `../open-lms-agent-b`. (A git worktree is the same repo, so history and remotes are shared. Two separate clones also work.)

### 3.2 Per-task loop (the "commit to master, then fetch" procedure)

```bash
# 1. start of task: be current
git fetch origin
git rebase origin/master            # or: git merge origin/master

# 2. implement, build, verify (section 2.8 / 2.9)

# 3. commit (one commit per API or logical unit, message format in 3.3)
git add -A
git commit -m "feat(courses): POST /courses create class"

# 4. publish to master
git fetch origin
git rebase origin/master
# rebuild if the rebase pulled in changes touching your area
git push origin HEAD:master         # fast-forward push to master

# 5. if the push is rejected (the other agent pushed first): repeat step 4. Never force-push.
```

Then read the phase gate (section 6) before starting the next task.

### 3.3 Commit message format

`<type>(<scope>): <summary>` — types `feat`, `fix`, `refactor`, `docs`, `chore`. Scope is the domain (`auth`, `courses`, `resources`, `assignments`, `submissions`, `quizzes`, `grades`, `dashboard`, `files`, `ui`). Example: `feat(submissions): PATCH /submissions/{id}/grade`.

### 3.4 File ownership (prevents merge conflicts)

- A file is edited only by the agent that owns it. Ownership follows the task that creates it. If you need a change in a file you do not own, **stop and tell Mayank**; do not edit it.
- **Shared files — edited only in the task named here, by that agent:**
  - `pom.xml` → A0 (JWT + validation deps), A6 (Cloudinary dep). Nobody else.
  - `application.properties` → A0 (JWT props), A6 (Cloudinary + multipart props). Nobody else.
  - `SecurityConfig.java` → A0 only.
  - `GlobalExceptionHandler.java` and exception classes → A0 only. Need a new exception type? Use an existing one.
  - `Frontend/src/app/router.jsx` → B0 creates all routes (including stubs). Later tasks fill pages but **do not edit the router**, unless the task explicitly says so.
  - `Frontend/src/lib/http.js`, `Frontend/src/store/authStore.js` → B0 (generic 401 handling) and A3 (real JWT/role flow). In that order.
  - `what_done_so_far.md`, `readme.md` → B6 only.
- Repository interfaces: the agent owning the domain adds finder methods. Domain owners: `UserRepository`, `RoleRepository`, `CourseRepository`, `EnrollmentRepository`, `ResourceRepository` → **A**. `AssignmentRepository`, `SubmissionRepository`, `Quiz*Repository` → **B**. Cross-domain read needs (e.g. dashboards counting submissions) are satisfied by calling the owning domain's **service or repository method that already exists**; if the needed query does not exist, A4/B4 task text names who adds it.

### 3.5 When blocked

Missing context, contradictory requirement, a needed change in someone else's file, or a failing dependency from the other agent's earlier work → **stop, write a 3-line message to Mayank** (what you need, which file/endpoint, what you tried). Do not guess and do not edit the other agent's files.

### 3.6 Completion message (after each task)

Send Mayank: task ID, commit hash, SQL file to run (if any), endpoints delivered, anything that deviated from this document and why.

---

## 4. Shared backend building blocks (created in A0, used by everyone)

### 4.1 `CourseAccessService` (package `service`)

Used by every service that touches course-scoped data. Methods:

| Method | Behaviour |
|---|---|
| `Course requireOwner(Long courseId, Long facultyUserId)` | Course must exist and `professor.userId == facultyUserId`, else `ResourceNotFoundException("Course not found")` |
| `Course requireMemberOrOwner(Long courseId, AuthUser user)` | FACULTY → must be owner; STUDENT → must be enrolled; else `ResourceNotFoundException("Course not found")` |
| `boolean isEnrolled(Long courseId, Long studentId)` | Uses `EnrollmentRepository.existsByCourseCourseIdAndStudentUserId` |
| `void requireStudentEnrolled(Long courseId, Long studentId)` | Throws `ResourceNotFoundException("Course not found")` when not enrolled |

### 4.2 Status vocabularies (fixed, uppercase strings)

- `Submission.status`: `SUBMITTED`, `APPROVED`, `REJECTED`
- `QuizAttempt.status`: `IN_PROGRESS`, `SUBMITTED`
- Computed (not stored) assignment state for a student: `PENDING`, `OVERDUE`, `SUBMITTED`, `APPROVED`, `REJECTED`. If the student has no submission: `OVERDUE` when `now > dueDate`, else `PENDING`; otherwise the submission's status.

---

## 5. Endpoint catalogue

Base path `/api/v1`. "Owner" = FACULTY who owns the course. "Member" = enrolled STUDENT or owner.

| ID | Method & path | Who | Task |
|---|---|---|---|
| AU1 | `POST /auth/register` | public | A0 |
| AU2 | `POST /auth/login` | public | A0 |
| AU3 | `GET /auth/me` | any | A0 |
| C1 | `POST /courses` | FACULTY | A1 |
| C2 | `GET /courses/my` | any | A1 |
| C3 | `GET /courses/{courseId}` | member | A1 |
| C4 | `PUT /courses/{courseId}` | owner | A1 |
| C5 | `POST /courses/join` | STUDENT | A1 |
| C6 | `GET /courses/{courseId}/students` | owner | A1 |
| C7 | `DELETE /courses/{courseId}/students/{studentId}` | owner | A1 |
| C8 | `DELETE /courses/{courseId}/enrollment` | STUDENT | A1 |
| R1 | `POST /courses/{courseId}/resources` | owner | A2 |
| R2 | `GET /courses/{courseId}/resources` | member | A2 |
| R3 | `DELETE /resources/{resourceId}` | owner | A2 |
| AS1 | `POST /courses/{courseId}/assignments` | owner | B1 |
| AS2 | `GET /courses/{courseId}/assignments` | member | B1 |
| AS3 | `GET /assignments/my` | STUDENT | B1 |
| AS4 | `GET /assignments/{assignmentId}` | member | B1 |
| AS5 | `PUT /assignments/{assignmentId}` | owner | B1 |
| AS6 | `DELETE /assignments/{assignmentId}` | owner | B1 |
| S1 | `POST /assignments/{assignmentId}/submissions` | STUDENT | B2 |
| S2 | `GET /assignments/{assignmentId}/submissions/me` | STUDENT | B2 |
| S3 | `GET /assignments/{assignmentId}/submissions` | owner | B2 |
| S4 | `GET /submissions/my` | STUDENT | B2 |
| S5 | `GET /submissions` (queue, filters) | FACULTY | B2 |
| S6 | `PATCH /submissions/{submissionId}/grade` | owner | B2 |
| Q1 | `POST /courses/{courseId}/quizzes` | owner | B3 |
| Q2 | `GET /courses/{courseId}/quizzes` | member | B3 |
| Q3 | `GET /quizzes/{quizId}` | member | B3 |
| Q4 | `DELETE /quizzes/{quizId}` | owner | B3 |
| Q5 | `POST /quizzes/{quizId}/attempts/start` | STUDENT | B3 |
| Q6 | `POST /quizzes/{quizId}/attempts/submit` | STUDENT | B3 |
| Q7 | `GET /quizzes/{quizId}/attempts/me` | STUDENT | B3 |
| Q8 | `GET /quizzes/{quizId}/attempts` | owner | B3 |
| G1 | `GET /courses/{courseId}/gradebook` | owner | B4 |
| G2 | `GET /courses/{courseId}/grades/me` | STUDENT | B4 |
| D1 | `GET /dashboard/student` | STUDENT | A4 |
| D2 | `GET /dashboard/professor` | FACULTY | A4 |
| F1 | `POST /files/upload` (Cloudinary) | any | A6 |

**Explicitly out of scope (stay mock / placeholder):** messaging, notifications, Google SSO, forgot-password, study-streak and "AI study plan" widgets, real-time features, course deletion/archival, quiz editing (delete and recreate instead).

---

## 6. Phases, tasks and gates

**Phase gate rule:** Phase N tasks may start only after **both** agents' Phase N−1 tasks are pushed to `master`. Within a phase, A and B tasks are independent and run in parallel.

| Phase | Agent A | Agent B |
|---|---|---|
| **P0** | **A0** Backend foundation (JWT, security, errors, service scaffolding, auth endpoints) | **B0** Frontend foundation (route guards, API modules, 401 handling, professor course page shell) |
| **P1** | **A1** Courses & enrollment (C1–C8) | **B1** Assignments (AS1–AS6) |
| **P2** | **A2** Resources (R1–R3) | **B2** Submissions & grading (S1–S6) |
| **P3** | **A3** Frontend wiring: auth, courses, resources | **B3** Quizzes & attempts (Q1–Q8) |
| **P4** | **A4** Dashboards (D1, D2) backend + frontend | **B4** Gradebook & grades (G1, G2) |
| **P5** | **A5** Frontend wiring: quizzes (student + professor) | **B5** Frontend wiring: assignments, submissions, grading, gradebook |
| **P6** | **A6** Cloudinary upload endpoint + `FileUploader` + Resources upload | **B6** Demo seed SQL, docs update, backend smoke checklist |
| **P7** | **A7** End-to-end QA pass, fix A-owned defects | **B7** Wire `FileUploader` into assignment attachments and submissions |

Exception to the gate rule: **B1 needs A0 only** (not A1) because it relies on `CourseAccessService`, not on the course endpoints. While A1 is unfinished, B1 tests with a course row inserted via SQL plus a faculty/student created through `/auth/register`.

---

## 7. Phase 0 — Foundation

### A0 — Backend foundation

**Dependencies to add (`pom.xml`):** `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (0.12.x), `spring-boot-starter-validation` (if absent).
**`application.properties`:** `app.jwt.secret=${JWT_SECRET:<dev default ≥ 32 chars>}`, `app.jwt.expiration-ms=86400000`.

**Build, in this order (one commit each is fine):**

1. **Exceptions + `GlobalExceptionHandler`** exactly per section 2.4. Includes handlers for `MethodArgumentNotValidException`, `HttpMessageNotReadableException`, `AccessDeniedException`, generic `Exception`.
2. **`JwtService`:** `generateToken(User)`, `parse(token)` → claims; throws `UnauthorizedException` semantics on invalid/expired.
3. **`JwtAuthenticationFilter`** (`OncePerRequestFilter`): reads `Authorization: Bearer`, validates, sets `SecurityContext` with `AuthUser` principal and `ROLE_<role>` authority. No header → continue unauthenticated (the security rules then reject protected routes).
4. **`SecurityConfig` update:** stateless; permit `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `OPTIONS /**`; **authenticate everything else**; `@EnableMethodSecurity`; custom `AuthenticationEntryPoint` (401 JSON per 2.4) and `AccessDeniedHandler` (403 JSON). Keep BCrypt and CORS as they are.
5. **`AuthService`:** move the logic out of `AuthController` into the service. Controller becomes thin.
6. **`CourseAccessService`** per section 4.1.
7. **SQL `Backend/openlms/db/phase0_roles.sql`:** `INSERT IGNORE INTO roles (role_name) VALUES ('STUDENT'), ('FACULTY');` Also make the app fail clearly (400/500 with message "Role not configured") if a role is missing.

**AU1 — `POST /auth/register`** (public)
- Request: `{ "name": "...", "email": "...", "password": "...", "roleName": "STUDENT" | "FACULTY" }`.
- Validation: name 2–100 chars; valid email, max 150, stored lowercased/trimmed; password 6–72 chars; `roleName` case-insensitive; accept `PROFESSOR` as an alias and normalise it to `FACULTY`. Any other role → 400.
- Logic: reject duplicate email (`ConflictException`, 409, "Email already registered"); BCrypt-hash; save with `isActive=true`.
- Response `201`: the existing `AuthResponse` shape `{ userId, name, email, role, roleId, token, isActive }`, where `token` is now a **real JWT**.
- Note: anyone can register as FACULTY (no admin approval). This is accepted for the PBL; do not add an approval flow.

**AU2 — `POST /auth/login`** (public)
- Request: `{ "email", "password" }`. (The frontend also holds a selected role; the **backend ignores it** and returns the real role.)
- Logic: lookup by lowercased email; BCrypt match; wrong email **or** password → 401 with the same message ("Invalid email or password"); `isActive=false` → 403 "Account disabled".
- Response `200`: same `AuthResponse` with a real JWT.

**AU3 — `GET /auth/me`** (any authenticated)
- Response `200`: `{ userId, name, email, role, roleId, isActive }` from the DB (not just the token).

**Done when**
- [ ] Register → login returns a valid JWT; the token decodes with the claims in 2.2.
- [ ] Calling any other `/api/v1/**` path without a token returns 401 in the 2.4 JSON; with an invalid token, 401.
- [ ] Duplicate email → 409; bad role → 400 with `fieldErrors`/message; wrong password → 401.
- [ ] `GET /auth/me` works with the token.
- [ ] `AuthController` contains no repository access.
- [ ] `phase0_roles.sql` applied or reported.

### B0 — Frontend foundation (frontend files only; no backend edits)

1. **`src/lib/http.js` (extend only):** on `401` call `authStore.logout()` and redirect to `/login`; keep existing error normalisation.
2. **Route guards:** create `RequireAuth` (not authenticated → `/login`) and `RequireRole` (student routes need `STUDENT`, professor routes need `FACULTY`, wrong role → redirect to that user's home: `/student/home` or `/professor/overview`). Apply in `router.jsx`.
3. **API modules (skeletons with the final function signatures and mock fallbacks):** create the nine modules from section 2.9 with one exported function per endpoint in section 5 (name them after the action, e.g. `createCourse`, `listMyCourses`, `joinCourse`). Bodies call `apiRequest` with the exact paths/methods from this document; mock branch returns data derived from `mockData.js`. No page is changed in this task.
4. **Professor course detail shell:** new route `/professor/courses/:courseId` → `ProfessorCourseDetailPage` with tabs **Students, Resources, Assignments, Quizzes**, each tab a separate stub component file: `features/professor/course-tabs/StudentsTab.jsx`, `ResourcesTab.jsx`, `AssignmentsTab.jsx`, `QuizzesTab.jsx`. Ownership of tab files: Students and Resources → A (A3); Assignments → B (B5); Quizzes → A (A5).
5. **Student course detail split:** refactor `CourseDetailPage` into tab components under `features/student/course-tabs/` (`OverviewTab.jsx`, `AssignmentsTab.jsx`, `QuizzesTab.jsx`, `ResourcesTab.jsx`) with **no visual change**. Ownership: Overview and Resources → A (A3); Assignments → B (B5); Quizzes → A (A5).
6. Link each professor course card in `ProfessorCoursesPage` to `/professor/courses/:courseId` (minimal edit; A3 later replaces its data source).

**Done when**
- [ ] `npm run build` passes; the app looks and behaves identically in mock mode.
- [ ] Visiting a protected route logged-out redirects to `/login`; a student cannot open `/professor/*` and vice versa.
- [ ] All nine API modules export the functions for the endpoints in section 5.

---

## 8. Phase 1

### A1 — Courses & enrollment

**SQL `Backend/openlms/db/phase1_courses.sql`:**
```sql
ALTER TABLE courses
  ADD COLUMN description TEXT NULL,
  ADD COLUMN section VARCHAR(50) NOT NULL DEFAULT 'Section 01';
```
Remove `@Transient` from `Course.description` and `Course.section` (keep default "Section 01").

**Class code generation:** `course_code` is the join code. 6 characters from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (no look-alike chars), generated with `SecureRandom`, retried up to 10 times on collision; then 500. Case-insensitive on join (store uppercase).

**Response shape `CourseResponse` (used by C1–C4):**
```json
{ "courseId": 1, "courseName": "Data Structures", "courseCode": "K7M2QX", "description": "...",
  "section": "Section 01", "professorId": 3, "professorName": "Dr. Priya Sharma", "enrollmentCount": 42 }
```
`CourseListItem` (C2) has the same fields.

**C1 — `POST /courses`** (FACULTY) → `201`
- Request: `{ "courseName": "...", "description": "...", "section": "..." }`. `courseName` required 2–150; `description` optional ≤ 2000; `section` optional, default "Section 01", ≤ 50.
- Logic: professor = caller; generate code; save.

**C2 — `GET /courses/my`** (any) → `200` array
- FACULTY: courses where `professor_id` = caller (`findByProfessorUserId`). STUDENT: courses from the caller's enrollments (`findByStudentUserId`). Each item includes `enrollmentCount` (`countByCourseCourseId`). Sorted by `courseName`.

**C3 — `GET /courses/{courseId}`** (member) → `200` `CourseResponse`. Uses `requireMemberOrOwner`.

**C4 — `PUT /courses/{courseId}`** (owner) → `200` `CourseResponse`
- Same fields as C1. `courseCode` is **not** editable.

**C5 — `POST /courses/join`** (STUDENT) → `201` `CourseResponse`
- Request `{ "courseCode": "K7M2QX" }`. Trim + uppercase. Unknown code → 404 "Invalid class code". Already enrolled → 409 "Already enrolled". Otherwise create `Enrollment`.

**C6 — `GET /courses/{courseId}/students`** (owner) → `200`
- `[ { "userId": 8, "name": "...", "email": "..." } ]` sorted by name.

**C7 — `DELETE /courses/{courseId}/students/{studentId}`** (owner) → `204`. Student not enrolled → 404.

**C8 — `DELETE /courses/{courseId}/enrollment`** (STUDENT) → `204`. Not enrolled → 404.

**Done when**
- [ ] A faculty creates a course and receives a 6-char code; a student joins with it (also with lowercase input); joining twice → 409; a wrong code → 404.
- [ ] A student cannot read a course they have not joined (404); a faculty cannot edit another faculty's course (404).
- [ ] `GET /courses/my` differs correctly by role; counts are right.
- [ ] SQL applied or reported; no `@Transient` remains on the two fields.

### B1 — Assignments

**SQL `Backend/openlms/db/phase1_assignments.sql`:**
```sql
ALTER TABLE assignments
  ADD COLUMN description TEXT NULL,
  ADD COLUMN attachment_url VARCHAR(500) NULL;
```
Remove `@Transient` on `Assignment.description`; add `attachmentUrl`.

**Response shape `AssignmentResponse`:**
```json
{
  "assignmentId": 5, "courseId": 1, "courseName": "Data Structures",
  "title": "Assignment 1", "description": "...", "dueDate": "2026-11-05T23:59:00",
  "maxMarks": 100, "attachmentUrl": null,
  "createdById": 3, "createdByName": "Dr. Priya Sharma",
  "submissionCount": 12,
  "myStatus": "PENDING",
  "mySubmission": { "submissionId": 9, "status": "SUBMITTED", "marksObtained": null, "isLate": false }
}
```
- For FACULTY: `submissionCount` is filled, `myStatus` and `mySubmission` are `null`.
- For STUDENT: `submissionCount` is `null`; `myStatus` is the computed state from section 4.2; `mySubmission` is the student's submission or `null`. (The `Submission` entity/repo already exist; use `SubmissionRepository.findByAssignmentAssignmentId`/`findByStudentUserId`, or add a finder in B's own repo. The submission **columns** added in B2 are not needed for this task: only `status` and `marksObtained` are read; set `isLate` to `false` until B2 adds `submitted_at`.)

**AS1 — `POST /courses/{courseId}/assignments`** (owner) → `201`
- Request `{ "title", "description", "dueDate", "maxMarks", "attachmentUrl" }`. `title` 2–150 required; `dueDate` required and **in the future**; `maxMarks` 1–1000 required; `attachmentUrl` optional ≤ 500, must be `http(s)` if present.
- `createdBy` = caller.

**AS2 — `GET /courses/{courseId}/assignments`** (member) → `200` array, sorted by `dueDate` ascending. Uses `requireMemberOrOwner`.

**AS3 — `GET /assignments/my`** (STUDENT) → `200` array across **all enrolled courses**, sorted by `dueDate`. Add `AssignmentRepository.findByCourseCourseIdIn(List<Long>)`. Used by the Assignments page and the calendar.

**AS4 — `GET /assignments/{assignmentId}`** (member) → `200`. Resolve the course from the assignment then `requireMemberOrOwner`.

**AS5 — `PUT /assignments/{assignmentId}`** (owner) → `200`. Same validation as AS1 **except** `dueDate` may be in the past when unchanged. Lowering `maxMarks` below an existing graded mark → 409.

**AS6 — `DELETE /assignments/{assignmentId}`** (owner) → `204`. If any submission exists → 409 "Assignment has submissions".

**Done when**
- [ ] Owner CRUD works; non-owner faculty gets 404; student cannot POST/PUT/DELETE (403).
- [ ] Student list shows `PENDING`/`OVERDUE` correctly for assignments with no submission.
- [ ] `GET /assignments/my` returns only enrolled courses' assignments.
- [ ] SQL applied or reported.

---

## 9. Phase 2

### A2 — Resources

**SQL `Backend/openlms/db/phase2_resources.sql`:**
```sql
ALTER TABLE resources
  ADD COLUMN description TEXT NULL,
  ADD COLUMN uploaded_at DATETIME NULL;
```
Add the fields to `Resource`. (`file_url` already exists. Until A6 the client supplies a plain URL; after A6 it supplies a Cloudinary URL. **The endpoint contract does not change.**)

**Response `ResourceResponse`:**
```json
{ "resourceId": 4, "courseId": 1, "title": "Unit 1 Notes", "description": "...",
  "fileUrl": "https://...", "uploadedById": 3, "uploadedByName": "Dr. Priya Sharma", "uploadedAt": "2026-10-23T10:00:00" }
```

**R1 — `POST /courses/{courseId}/resources`** (owner) → `201`. Request `{ "title", "description", "fileUrl" }`; `title` 2–150 required, `fileUrl` required ≤ 500 and `http(s)`. Sets `uploadedAt = now`, `uploadedBy` = caller.

**R2 — `GET /courses/{courseId}/resources`** (member) → `200` array, newest first.

**R3 — `DELETE /resources/{resourceId}`** (owner of the resource's course) → `204`. (Deleting the DB row only; Cloudinary cleanup is out of scope.)

**Done when**
- [ ] Owner creates/deletes; enrolled student reads; non-enrolled student gets 404.
- [ ] SQL applied or reported.

### B2 — Submissions & grading

**SQL `Backend/openlms/db/phase2_submissions.sql`:**
```sql
ALTER TABLE submissions
  ADD COLUMN submission_text TEXT NULL,
  ADD COLUMN file_url VARCHAR(500) NULL,
  ADD COLUMN feedback TEXT NULL,
  ADD COLUMN submitted_at DATETIME NULL,
  ADD COLUMN graded_at DATETIME NULL;
ALTER TABLE submissions ALTER COLUMN status SET DEFAULT 'SUBMITTED';
UPDATE submissions SET status = 'SUBMITTED' WHERE status = 'Submitted';
```
Entity: remove `@Transient` on `submissionText`; add `fileUrl`, `feedback`, `submittedAt`, `gradedAt`; default status `SUBMITTED`. Update B1's `AssignmentResponse.mySubmission.isLate` to now be `submittedAt > dueDate` (B1's service, same agent).

**Response `SubmissionResponse`:**
```json
{
  "submissionId": 9, "assignmentId": 5, "assignmentTitle": "Assignment 1",
  "courseId": 1, "courseName": "Data Structures",
  "studentId": 8, "studentName": "Rahul Sharma", "studentEmail": "rahul@geu.edu",
  "submissionText": "...", "fileUrl": null,
  "status": "SUBMITTED", "marksObtained": null, "maxMarks": 100,
  "feedback": null, "submittedAt": "2026-11-04T20:10:00", "gradedAt": null, "isLate": false
}
```

**S1 — `POST /assignments/{assignmentId}/submissions`** (STUDENT) → `201` first time, `200` on resubmit
- Request `{ "submissionText": "...", "fileUrl": "https://..." }`. **At least one** of the two must be non-blank, else 400. `submissionText` ≤ 10000; `fileUrl` ≤ 500 and `http(s)`.
- Logic: `requireStudentEnrolled` for the assignment's course. Late submissions are **allowed** and flagged (`isLate`). If a submission exists: status `APPROVED` → 409 "Already approved"; status `SUBMITTED` or `REJECTED` → overwrite text/file, set status `SUBMITTED`, clear `marksObtained`/`feedback`/`gradedAt`, update `submittedAt`. Otherwise create (unique constraint assignment+student already exists).

**S2 — `GET /assignments/{assignmentId}/submissions/me`** (STUDENT) → `200` own submission, or 404 if none.

**S3 — `GET /assignments/{assignmentId}/submissions`** (owner) → `200` array of `SubmissionResponse`, newest first.

**S4 — `GET /submissions/my`** (STUDENT) → `200` all of the caller's submissions (`findByStudentUserId`).

**S5 — `GET /submissions`** (FACULTY) → `200` — grading queue across the caller's courses.
- Query params (all optional): `status` (`SUBMITTED|APPROVED|REJECTED`), `courseId`, `assignmentId`. Only courses owned by the caller. Oldest `submittedAt` first. Add repository query joining `assignment.course.professor.userId`.

**S6 — `PATCH /submissions/{submissionId}/grade`** (owner) → `200` `SubmissionResponse`
- Request `{ "status": "APPROVED" | "REJECTED", "marksObtained": 85, "feedback": "..." }`.
- `APPROVED`: `marksObtained` required, `0 ≤ marksObtained ≤ assignment.maxMarks`, else 400.
- `REJECTED`: `marksObtained` ignored/cleared; `feedback` **required** (explain why).
- Sets `gradedAt = now`. Re-grading an already graded submission is allowed.

**Done when**
- [ ] Student submits, edits, and (after rejection) resubmits; approved → 409 on resubmit.
- [ ] Non-enrolled student → 404; faculty not owning the course cannot see or grade (404).
- [ ] Marks above `maxMarks` → 400; reject without feedback → 400.
- [ ] `GET /submissions?status=SUBMITTED` returns only the caller's courses.
- [ ] SQL applied or reported.

---

## 10. Phase 3

### A3 — Frontend wiring: auth, courses, resources

Edits allowed: `authStore.js`, `LoginPage`, `StudentSignupPage`, `StudentClassesPage`, `ProfessorCoursesPage`, `CourseDetailPage` Overview/Resources tabs, `ProfessorCourseDetailPage` Students/Resources tabs, `authApi.js`, `coursesApi.js`, `resourcesApi.js`.

1. **Auth:** `login` must call `/auth/login`, store the **JWT** and use the **role returned by the server** (not the role chosen on the form). Persist via `authStorage`. On app load, if a token exists call `GET /auth/me` to restore the user; on failure, logout. Signup sends `roleName: "STUDENT" | "FACULTY"` according to the path (`/signup/student` vs `/signup/professor`). The optional "class code" in the student signup step 2: after registering and logging in, if a code is present call `POST /courses/join`; a failure must not block signup (show a non-blocking message).
2. **Student:** `StudentClassesPage` uses `GET /courses/my`; add a **"Join class"** modal (class code input → `POST /courses/join`); a "Leave class" action calls C8. `CourseDetailPage` Overview uses `GET /courses/{id}`; Resources tab uses `GET /courses/{id}/resources`.
3. **Professor:** `ProfessorCoursesPage` uses `GET /courses/my` and gets a **"Create class" modal** (name, description, section → `POST /courses`; show the generated code prominently with a copy button). `ProfessorCourseDetailPage` → **Students tab** (C6 list + remove C7) and **Resources tab** (R2 list, add via R1 with a title + URL field, delete via R3). Edit-class action uses C4.
4. Show server error messages from the 2.4 format in the UI.

**Done when**
- [ ] With `VITE_USE_MOCKS=false`: register → login → role-correct landing page; refresh keeps the session; logout works.
- [ ] A professor creates a class, copies the code; a student joins; both see it; professor adds a resource and the student sees it.
- [ ] `npm run build` passes; `VITE_USE_MOCKS=true` still works.

### B3 — Quizzes & attempts

**SQL `Backend/openlms/db/phase3_quizzes.sql`:**
```sql
ALTER TABLE quizzes ADD COLUMN duration_minutes INT NULL;
ALTER TABLE quiz_attempts
  ADD COLUMN started_at DATETIME NULL,
  ADD COLUMN submitted_at DATETIME NULL;
```
Add `durationMinutes` to `Quiz`; `startedAt`, `submittedAt` to `QuizAttempt`. Remember section 2.6 (lazy collections).

**DTOs (extend `QuizDto`):**
- `QuizResponse`: `{ quizId, courseId, title, totalMarks, durationMinutes, questionCount, createdById, myAttempt: { attemptId, status, score } | null, questions: [...] | null }`.
- Faculty question view: `{ questionId, questionText, marks, options: [ { optionId, optionText, isCorrect } ] }`.
- **Student question view: options contain `{ optionId, optionText }` only — never `isCorrect`.** Leaking correct answers to a student before they submit is a defect.

**Q1 — `POST /courses/{courseId}/quizzes`** (owner) → `201`
- Request:
```json
{ "title": "Quiz 1", "durationMinutes": 20,
  "questions": [ { "questionText": "...", "marks": 2,
                   "options": [ { "optionText": "A", "isCorrect": false }, { "optionText": "B", "isCorrect": true } ] } ] }
```
- Rules: title 2–150; `durationMinutes` optional, 1–300 (null = untimed); ≥ 1 question; each question `marks` ≥ 1, 2–6 options, **exactly one** `isCorrect`; `totalMarks` is **computed server-side** as the sum of question marks (ignore any client value). Persist via cascade. Returns the faculty view with questions.

**Q2 — `GET /courses/{courseId}/quizzes`** (member) → `200` array of `QuizResponse` **without** `questions`; students get `myAttempt`, faculty `null`. Sorted by newest `quizId` first.

**Q3 — `GET /quizzes/{quizId}`** (member) → `200` `QuizResponse` with `questions`. FACULTY (owner) gets the faculty view; STUDENT (enrolled) gets the student view (no `isCorrect`).

**Q4 — `DELETE /quizzes/{quizId}`** (owner) → `204`. Any attempt exists → 409 "Quiz has attempts".

**Q5 — `POST /quizzes/{quizId}/attempts/start`** (STUDENT, enrolled) → `200`
- Response `{ "attemptId", "quizId", "status": "IN_PROGRESS", "startedAt", "durationMinutes", "endsAt" }` (`endsAt` null when untimed).
- No attempt yet → create `IN_PROGRESS`, `startedAt = now`. `IN_PROGRESS` exists → return it unchanged (resume; do not reset the timer). `SUBMITTED` exists → 409 "Quiz already attempted".

**Q6 — `POST /quizzes/{quizId}/attempts/submit`** (STUDENT) → `200` result (same shape as Q7)
- Request `{ "answers": [ { "questionId": 11, "selectedOptionId": 41 } ] }`.
- Requires an `IN_PROGRESS` attempt (else 409 "No active attempt"). If timed and `now > startedAt + duration + 60s grace` → 409 "Time expired" (the frontend auto-submits at expiry, so a legitimate client is never late).
- Validation: each `questionId` belongs to the quiz; each `selectedOptionId` belongs to **that question**; no duplicate `questionId`; unanswered questions are allowed (score 0 for them).
- Grading: for each answered question, if the selected option is correct add that question's `marks`. `score` = sum. Persist `QuizAnswer` rows, set status `SUBMITTED`, `submittedAt = now`. Single transaction.

**Q7 — `GET /quizzes/{quizId}/attempts/me`** (STUDENT) → `200`
```json
{ "attemptId": 2, "quizId": 1, "status": "SUBMITTED", "score": 6, "totalMarks": 10,
  "startedAt": "...", "submittedAt": "...",
  "answers": [ { "questionId": 11, "questionText": "...", "marks": 2, "selectedOptionId": 41, "correctOptionId": 42, "isCorrect": false } ] }
```
`correctOptionId` and `answers` are included **only when status is `SUBMITTED`**; otherwise `answers` is omitted. No attempt → 404.

**Q8 — `GET /quizzes/{quizId}/attempts`** (owner) → `200` `[ { attemptId, studentId, studentName, studentEmail, status, score, totalMarks, submittedAt } ]`.

**Done when**
- [ ] Create a quiz with validation failures covered (no correct option, two correct options, zero questions → 400).
- [ ] Student view of Q3 never contains `isCorrect`; Q7 reveals correct answers only after submission.
- [ ] Start twice returns the same attempt with an unchanged `startedAt`; submit scores correctly; second submit → 409.
- [ ] Option from a different question is rejected with 400.
- [ ] No `LazyInitializationException` on any endpoint.
- [ ] SQL applied or reported.

---

## 11. Phase 4

### A4 — Dashboards (backend + frontend)

Both endpoints are **read-only aggregations**. Compute them in `DashboardService` using the existing repositories/services of A and B (read-only calls; do not modify B's repositories — if a query is missing, build it with an existing finder plus in-memory aggregation, which is acceptable at PBL scale). Wire `StudentDashboardPage` and `ProfessorDashboardPage`.

**D1 — `GET /dashboard/student`** (STUDENT) → `200`
```json
{
  "stats": { "enrolledCourses": 4, "dueThisWeek": 2, "pendingAssignments": 3, "averageGradePercent": 82.5 },
  "courses": [ { "courseId": 1, "courseName": "...", "courseCode": "...", "professorName": "...",
                 "totalAssignments": 5, "completedAssignments": 3, "progressPercent": 60 } ],
  "upcomingDeadlines": [ { "assignmentId": 5, "title": "...", "courseId": 1, "courseName": "...",
                           "dueDate": "...", "status": "PENDING" } ]
}
```
- `completedAssignments` = assignments with any submission. `progressPercent` = completed / total × 100 (0 when total is 0).
- `pendingAssignments` = assignments in enrolled courses with no submission and not yet overdue. `dueThisWeek` = those due within 7 days.
- `averageGradePercent` = (sum of `marksObtained` over `APPROVED` submissions + quiz scores of `SUBMITTED` attempts) / (sum of their max marks / quiz total marks) × 100, rounded to 1 decimal; `null` if nothing graded.
- `upcomingDeadlines`: not-yet-submitted assignments due within 14 days, soonest first, max 10.
- The dashboard's streak and "AI study plan" widgets stay as mock/placeholder — do not invent endpoints for them.

**D2 — `GET /dashboard/professor`** (FACULTY) → `200`
```json
{
  "stats": { "courses": 3, "totalStudents": 120, "pendingSubmissions": 14, "averageGradePercent": 76.0 },
  "courses": [ { "courseId": 1, "courseName": "...", "courseCode": "...", "enrollmentCount": 42, "assignmentCount": 5, "pendingCount": 6 } ],
  "submissionQueue": [ /* up to 10 SubmissionResponse, status SUBMITTED, oldest first */ ]
}
```
- `totalStudents` = distinct students across owned courses. `pendingSubmissions` = count of `SUBMITTED`. `averageGradePercent` = average of `marksObtained/maxMarks` over `APPROVED` submissions in owned courses.

**Done when**
- [ ] Numbers match a hand-check against rows created through the real endpoints.
- [ ] Both dashboards render real data with `VITE_USE_MOCKS=false`; mock mode unchanged.
- [ ] Empty states (no courses, nothing graded) return zeros/nulls, not errors.

### B4 — Gradebook & grades

**G1 — `GET /courses/{courseId}/gradebook`** (owner) → `200`
```json
{
  "courseId": 1,
  "assignments": [ { "assignmentId": 5, "title": "Assignment 1", "maxMarks": 100 } ],
  "quizzes": [ { "quizId": 1, "title": "Quiz 1", "totalMarks": 10 } ],
  "rows": [ {
    "studentId": 8, "studentName": "...", "studentEmail": "...",
    "assignmentMarks": { "5": 85 },
    "quizScores": { "1": 6 },
    "totalObtained": 91, "totalMax": 110, "percentage": 82.7
  } ]
}
```
- One row per enrolled student; use a **null** value (or omit the key) where the student has no graded result. Assignment marks count only `APPROVED` submissions; quiz scores only `SUBMITTED` attempts.
- `totalObtained`/`totalMax` sum **only items that have a result** for that student; `percentage` = obtained / max × 100 to 1 decimal, `null` when no results.
- Avoid N+1: load submissions for the course once (`findByAssignmentCourseCourseId`) and attempts per quiz once, then assemble in memory.

**G2 — `GET /courses/{courseId}/grades/me`** (STUDENT, enrolled) → `200`
```json
{ "courseId": 1,
  "assignments": [ { "assignmentId": 5, "title": "...", "maxMarks": 100, "status": "APPROVED", "marksObtained": 85, "feedback": "..." } ],
  "quizzes": [ { "quizId": 1, "title": "...", "totalMarks": 10, "score": 6, "status": "SUBMITTED" } ],
  "totalObtained": 91, "totalMax": 110, "percentage": 82.7 }
```
Assignments with no submission appear with `status` = the computed state (`PENDING`/`OVERDUE`) and `marksObtained` null. Quizzes not attempted appear with `score` null and `status` `null`.

**Done when**
- [ ] Gradebook matches hand-calculated values for a course with 2 students, 2 assignments, 1 quiz.
- [ ] Non-owner faculty → 404; student calling G1 → 403.

---

## 12. Phase 5

### A5 — Frontend wiring: quizzes

Files: `QuizTakingPage`, student `QuizzesTab`, professor `QuizzesTab`, `quizzesApi.js`.

- **Student:** quizzes tab lists Q2 with `myAttempt`; "Start" calls Q5 then opens `QuizTakingPage` (fullscreen, existing UI) loading Q3. The timer is driven by the server's `endsAt`/`startedAt` (not a client-only countdown); on expiry auto-submit via Q6. Submit-confirmation dialog stays. After submission show the Q7 result (score, per-question review).
- **Professor:** `QuizzesTab` lists Q2, shows attempts (Q8) per quiz, deletes (Q4), and has a **"Create quiz" form** (title, duration, dynamic questions with options and a single correct option radio) calling Q1. Mirror the server validation rules client-side with clear messages.

**Done when**
- [ ] Full path works end to end: professor creates quiz → student starts, answers, submits → both see the score; reloading mid-quiz resumes without resetting the timer.
- [ ] The student network responses never contain `isCorrect` before submission (check in dev tools).
- [ ] `npm run build` passes.

### B5 — Frontend wiring: assignments, submissions, grading, gradebook

Files: `StudentAssignmentsPage`, `StudentCalendarPage` (data from `GET /assignments/my`), student/professor Assignments tabs, `SubmissionsGradingPage`, `ProfessorGradebookPage`, `assignmentsApi.js`, `submissionsApi.js`, `gradesApi.js`.

- **Professor Assignments tab:** list (AS2), **create/edit modal** (AS1/AS5; title, description, due date, max marks; attachment URL field), delete (AS6), link to that assignment's submissions (S3).
- **Student Assignments (page + course tab):** list with the computed `myStatus` badges (pending / overdue / submitted / approved / rejected); **submit/resubmit form** (text + optional URL → S1); show marks and feedback after grading (S2).
- **`SubmissionsGradingPage`:** list from S5 (filters: status, course); grading panel calls S6 (approve with marks + feedback, or reject with feedback).
- **`ProfessorGradebookPage`:** G1 with a course selector; **student grades view** uses G2 where the existing UI shows a student's grades.
- Calendar uses assignment due dates from AS3 only.

**Done when**
- [ ] Professor creates an assignment → student sees it, submits → professor grades → student sees marks/feedback; a rejected submission can be resubmitted.
- [ ] Gradebook totals match the grading actions.
- [ ] `npm run build` passes; mock mode unchanged.

---

## 13. Phase 6

### A6 — Cloudinary upload

**Dependency:** `com.cloudinary:cloudinary-http5` (use the current release; verify at build time). **Config via environment only** — never commit secrets:
```
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
```
`application.properties`: `cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME:}` (same for key/secret), `spring.servlet.multipart.max-file-size=10MB`, `spring.servlet.multipart.max-request-size=10MB`. Add `Backend/openlms/.env.example` with the three variable names (no values). Missing credentials → the endpoint returns 503 "File storage not configured"; the app must still boot.

**F1 — `POST /files/upload`** (any authenticated) → `201`
- `multipart/form-data`: `file` (required), `folder` (required: `resources` | `assignments` | `submissions`).
- Validation: non-empty; ≤ 10 MB; extension whitelist `pdf, doc, docx, ppt, pptx, xls, xlsx, txt, csv, png, jpg, jpeg, zip`; check both extension and content-type; reject others with 400. Sanitise the original filename.
- Upload to Cloudinary under `open-lms/<folder>/` with `resource_type: "auto"` and a unique public id (no overwriting); return:
```json
{ "url": "https://res.cloudinary.com/...", "publicId": "open-lms/submissions/...", "originalName": "report.pdf", "size": 183204, "resourceType": "image" }
```
- Role rules: `folder=resources` and `folder=assignments` → FACULTY only (403 otherwise); `folder=submissions` → STUDENT only.
- Note for testing: new Cloudinary accounts may block delivery of PDF/ZIP files until "Allow delivery of PDF and ZIP files" is enabled in the Cloudinary console security settings. If PDFs return 401 when opened, tell Mayank to enable it.

**Frontend:** build a reusable `components/ui/FileUploader.jsx` (button + selected file name + progress/spinner + error; props `folder`, `onUploaded(url, meta)`; calls `filesApi.uploadFile`). Wire it into the **Resources tab** (professor) so the URL field is filled by uploading, with the manual URL field kept as a fallback.

**Done when**
- [ ] A real upload returns a working `secure_url`; the resource created with it opens for an enrolled student.
- [ ] Oversize file, wrong type, wrong role each fail with the right status/message.
- [ ] No secret is committed (`git grep` for the key/secret strings is clean).

### B6 — Seed, docs, smoke checklist

1. **`Backend/openlms/db/seed_demo.sql`:** idempotent demo data usable by a live demo: roles, 1 faculty, 2 students (BCrypt hash for a documented demo password — generate the hash with the app's `BCryptPasswordEncoder`, strength 10), 1 course with a fixed code, 2 assignments, 1 quiz with questions/options, 1 resource. Use `INSERT IGNORE`/`ON DUPLICATE KEY` so it can be re-run.
2. **`Backend/openlms/db/README.md`:** the ordered list of SQL files to run on a fresh database (`phase0_roles`, `phase1_courses`, `phase1_assignments`, `phase2_resources`, `phase2_submissions`, `phase3_quizzes`, then `seed_demo`), plus how to run the backend and frontend and the required env vars.
3. **`docs/SMOKE_TEST.md`:** a numbered manual checklist covering every endpoint group (steps, expected result), runnable by a human in about 15 minutes.
4. Update `what_done_so_far.md` and `readme.md` to the real state (remove the "not done" items that are now done; keep honest the ones that are not).

**Done when**
- [ ] On an empty `open_lms` schema, running the documented SQL files in order yields a working app with the demo accounts.
- [ ] Docs match what is actually in the repo.

---

## 14. Phase 7

### B7 — Wire the uploader into assignments and submissions

Use `FileUploader` (from A6) in: professor assignment create/edit modal (`folder=assignments` → `attachmentUrl`) and the student submit form (`folder=submissions` → `fileUrl`). Show attachment/submission file links where the data is displayed (assignment cards, grading panel). No backend change.

**Done when**
- [ ] Professor attaches a PDF to an assignment; student opens it; student uploads a submission file; professor opens it in the grading panel.

### A7 — End-to-end QA

Run `docs/SMOKE_TEST.md` against the full app with `VITE_USE_MOCKS=false`. Fix defects in **A-owned** code. For defects in B-owned code, list them for Mayank with exact endpoint/step and observed vs expected behaviour; do not edit those files.

**Done when**
- [ ] Every smoke-test step passes, or each failure is fixed (A-owned) or reported (B-owned).

---

## 15. Final acceptance (Mayank)

- [ ] Fresh DB + seed → login as faculty and student → complete the flow: create class → join → resource → assignment → submission → grading → quiz → gradebook → dashboards.
- [ ] Every endpoint in section 5 exists and matches this document.
- [ ] No endpoint besides register/login is reachable without a JWT; no student can read another class's data or any quiz answer key.
- [ ] `./mvnw -q -DskipTests compile` and `npm run build` both pass on `master`.

---

## Appendix — Start prompts for the agents

**Agent A**
> You are Agent A on the Open LMS project. Work in your own git worktree `../open-lms-agent-a` on branch `agent-a`. Read `api_implementation_plan.md` fully, then execute **only the tasks labelled A** (A0 through A7), in order, respecting the phase gates in section 6 and the git protocol in section 3. Treat the document as the contract: do not change API paths, JSON shapes, status codes or file ownership. If anything is ambiguous or requires editing a file you do not own, stop and ask Mayank. After each task, send the completion message from section 3.6.

**Agent B**
> You are Agent B on the Open LMS project. Work in your own git worktree `../open-lms-agent-b` on branch `agent-b`. Read `api_implementation_plan.md` fully, then execute **only the tasks labelled B** (B0 through B7), in order, respecting the phase gates in section 6 and the git protocol in section 3. Treat the document as the contract: do not change API paths, JSON shapes, status codes or file ownership. If anything is ambiguous or requires editing a file you do not own, stop and ask Mayank. After each task, send the completion message from section 3.6.
