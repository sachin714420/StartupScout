# StartupScout — Product Requirements Document (PRD)

**Document version:** 2.0  
**Status:** MVP Implemented — Local Development  
**Project:** StartupScout  
**Product type:** Student-focused job and internship discovery platform  
**Primary audience:** College students and early-career candidates  
**Last updated:** 26 November 2026

---

## 1. Product Overview

StartupScout is a student-focused web application that helps students discover jobs and internship opportunities from external sources in one place.

Users can browse opportunities, search by role or skills, filter listings, create accounts, log in, save opportunities, and access their saved listings after logging in again.

The application uses a React frontend, Node.js and Express backend, and MySQL database.

### 1.1 Problem Statement

Students often search multiple websites to find internships and entry-level jobs. Managing these opportunities and remembering interesting listings can be inconvenient.

StartupScout provides a centralized platform to make opportunity discovery and tracking easier.

### 1.2 Product Vision

Build a reliable platform where students can discover career opportunities, manage saved listings, and eventually receive personalized recommendations based on their skills and interests.

---

## 2. Goals and Success Criteria

### 2.1 Product Goals

1. Aggregate job and internship listings from supported external sources.
2. Display opportunities in a consistent interface.
3. Provide search and category filtering.
4. Support student registration and login.
5. Store user accounts securely in MySQL.
6. Allow authenticated users to save and remove opportunities.
7. Maintain saved opportunities across page refreshes and login sessions.
8. Establish a foundation for future cloud deployment and personalized recommendations.

### 2.2 MVP Success Criteria

- Frontend starts successfully using Vite.
- Backend starts successfully using Express.
- Opportunities API returns valid JSON.
- External opportunity data can be synchronized with MySQL.
- Search and category filters work.
- Registration and login work.
- Passwords are stored as hashes rather than plaintext.
- Authenticated users can save and remove opportunities.
- Saved opportunities remain available after refresh.
- Logout removes the local authentication session.
- Protected API endpoints reject unauthenticated requests.
- Application links open the original opportunity source.

---

## 3. Target Users

### Primary User: Student

A college student or recent graduate looking for internships and entry-level jobs.

**Needs:**
- Discover opportunities from multiple sources.
- Search by role, company, or skills.
- Filter jobs and internships.
- Create an account.
- Save opportunities and revisit them later.

### Future User: Administrator

An administrator responsible for managing opportunity records, monitoring data quality, and reviewing platform activity.

Admin dashboard functionality is not yet implemented.

---

## 4. Project Scope

### 4.1 Implemented MVP Scope

- React-based frontend.
- Vite development environment.
- Node.js and Express backend.
- Arbeitnow external opportunity API integration.
- MySQL database integration.
- Opportunity synchronization and storage.
- Search and category filtering.
- Student registration and login.
- Password hashing using bcryptjs.
- JWT-based authentication.
- User-specific saved opportunities.
- Profile dropdown and logout functionality.
- Responsive interface and basic loading/error states.

### 4.2 Planned Features

- Student profile editing.
- Student skills and interest management.
- Personalized opportunity recommendations.
- Admin dashboard.
- Additional permitted opportunity sources.
- Azure cloud deployment.
- Production database hosting.
- Automated testing and monitoring.

### 4.3 Out of Scope

- Applying to jobs automatically.
- Guaranteeing employer responses.
- Processing payments.
- Hosting external employers' application forms.

---

## 5. Functional Requirements

### FR-01 — View Opportunities (P0)

The system shall display opportunities retrieved through the backend.

Available information includes:
- Opportunity title.
- Company.
- Opportunity type.
- Location.
- Skills.
- Source.
- Application URL.

**Status:** Implemented.

### FR-02 — Search Opportunities (P0)

Users can search opportunities using titles, company names, and skills.

**Status:** Implemented.

### FR-03 — Filter Opportunities (P0)

Users can filter opportunities using:
- All
- Internship
- Job

**Status:** Implemented.

### FR-04 — Student Registration (P0)

Students can create an account using:
- Name.
- Email.
- Password.

The backend validates registration requests and stores password hashes.

**Status:** Implemented and registration tested.

### FR-05 — Student Login (P0)

Registered users can log in using their email and password.

The backend verifies credentials and issues a JWT authentication token.

**Status:** Implemented and login tested.

### FR-06 — Logout (P0)

Users can log out using the profile dropdown.

The frontend removes the locally stored authentication token and user information.

**Status:** Implemented and tested.

### FR-07 — Save and Unsave Opportunities (P0)

Authenticated users can save and remove opportunities.

Saved opportunities are associated with the logged-in user's account in MySQL.

**Acceptance criteria:**
- Save an opportunity.
- Remove a saved opportunity.
- Retrieve saved opportunities.
- Maintain saved records after page refresh.
- Keep saved opportunities associated with the correct user.

**Status:** Implemented and tested.

### FR-08 — Protected API Access (P0)

The saved opportunities API requires a valid JWT token.

Unauthenticated or invalid requests are rejected.

**Status:** Implemented.

### FR-09 — Student Profile (P1)

The current interface displays a profile button with the user's initial and a dropdown containing the user's name and logout option.

Profile editing and skill management are future enhancements.

**Status:** Basic profile dropdown implemented; profile editing pending.

### FR-10 — Personalized Recommendations (P2)

The platform may recommend opportunities based on student skills and interests.

**Status:** Planned.

### FR-11 — Administration (P2)

A future admin interface may support opportunity management, data-quality checks, and user administration.

**Status:** Planned.

---

## 6. User Journeys

### 6.1 Discover Opportunities

1. User opens StartupScout.
2. Frontend requests opportunities from the backend.
3. Backend retrieves and serves opportunity data.
4. User browses opportunity cards.
5. User searches or applies category filters.
6. User opens the original application link.

### 6.2 Register and Login

1. User opens the registration form.
2. User enters name, email, and password.
3. Backend validates the request.
4. Password is hashed.
5. User account is stored in MySQL.
6. User logs in.
7. Backend verifies credentials and returns an authentication token.
8. Frontend stores the authentication information for the session.

### 6.3 Save an Opportunity

1. User logs in.
2. User clicks the bookmark icon.
3. Frontend sends an authenticated request to the backend.
4. Backend verifies the JWT.
5. Saved opportunity is stored in MySQL against the user's account.
6. User can retrieve saved opportunities later.
7. User can remove a saved opportunity.

### 6.4 Logout

1. User opens the profile dropdown.
2. User clicks Logout.
3. Frontend clears locally stored authentication information.
4. User returns to the unauthenticated state.

---

## 7. Technical Architecture

### 7.1 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React | User interface |
| Frontend tooling | Vite | Development and build |
| Styling | CSS | Interface design |
| Icons | Lucide React | UI icons |
| Backend | Node.js | Server runtime |
| API framework | Express.js | HTTP API |
| Database | MySQL | Persistent storage |
| Database driver | mysql2 | Database connectivity |
| Authentication | JWT | Token-based authentication |
| Password security | bcryptjs | Password hashing |
| External data | Arbeitnow API | Job and internship listings |
| Version control | Git and GitHub | Source-code management |
| Cloud target | Microsoft Azure | Future deployment |

### 7.2 High-Level Architecture

```text
             Student / Browser
                     |
                     v
             React + Vite UI
                     |
                     | HTTP Requests
                     v
             Node.js + Express
                     |
          +----------+-----------+
          |          |           |
          v          v           v
      MySQL DB    JWT Auth   Arbeitnow API
          |
          v
   Users, Opportunities,
   Companies, Skills,
   Saved Jobs
```

### 7.3 Project Structure

```text
StartupScout/
│
├── DOCS/
│   └── StartupScout_PRD.md
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── auth.js
│   │   ├── db.js
│   │   ├── savedJobs.js
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── .gitignore
└── README.md
```

Local `.env` files are used for environment-specific configuration and must never be committed.

---

## 8. API Requirements

### 8.1 Opportunities API

**Method:** GET  
**Path:** `/api/opportunities`

Returns available job and internship records.

Supports search and filtering functionality.

### 8.2 Authentication API

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a student |
| POST | `/api/auth/login` | Authenticate a student |
| GET | `/api/auth/me` | Retrieve authenticated user information |

### 8.3 Saved Jobs API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/saved-jobs` | Retrieve logged-in user's saved jobs |
| POST | `/api/saved-jobs/:id` | Save an opportunity |
| DELETE | `/api/saved-jobs/:id` | Remove a saved opportunity |

### 8.4 API Security Requirements

- Validate incoming request data.
- Use parameterized database queries.
- Protect private endpoints using JWT authentication.
- Never expose password hashes or database credentials.
- Store secrets in environment variables.
- Use appropriate HTTP status codes.
- Configure production CORS restrictions before deployment.

---

## 9. Database Design

MySQL is used for persistent application data.

### 9.1 Implemented Database Tables

| Table | Purpose |
|---|---|
| users | Stores student accounts |
| companies | Stores company information |
| opportunities | Stores job and internship records |
| skills | Stores reusable skill information |
| opportunity_skills | Connects opportunities and skills |
| saved_jobs | Connects users with saved opportunities |

### 9.2 Important Relationships

- One company can have multiple opportunities.
- One opportunity can have multiple skills.
- One skill can be associated with multiple opportunities.
- One user can save multiple opportunities.
- One opportunity can be saved by multiple users.

### 9.3 Data Integrity

- Primary keys identify records.
- Unique constraints help prevent duplicate records.
- Foreign keys maintain relationships.
- Composite keys prevent duplicate user-opportunity saved records.
- Parameterized queries are used for database operations.

### 9.4 Database Configuration

Database credentials are loaded from environment variables.

The local database is named:

`startupscout`

Credentials must not be stored in source code or committed to GitHub.

---

## 10. Non-Functional Requirements

### 10.1 Security

- Passwords are hashed using bcryptjs.
- JWT tokens are used for authentication.
- Protected endpoints validate authentication tokens.
- Database operations use parameterized queries.
- Environment variables protect sensitive configuration.
- Production deployment should use HTTPS.
- Additional production hardening, such as security headers and request rate limits, remains necessary.

### 10.2 Performance

- Cache opportunity data where appropriate.
- Avoid unnecessary API requests.
- Keep search and filtering responsive.
- Consider pagination as opportunity volume increases.

### 10.3 Reliability

- Handle external API failures.
- Handle database connectivity problems.
- Display understandable error and empty states.
- Handle expired or invalid authentication tokens.

### 10.4 Usability

- Provide clear buttons and labels.
- Support desktop and mobile layouts.
- Provide visible loading feedback.
- Use accessible labels for interactive controls.

---

## 11. Testing and Verification

The following functionality has been tested during local development:

| Test | Result |
|---|---|
| Frontend startup | Passed |
| Backend startup | Passed |
| MySQL connectivity | Passed |
| Opportunity data synchronization | Passed |
| Opportunity API | Passed |
| Search and category filters | Tested |
| User registration | Passed |
| User login | Passed |
| Logout | Passed |
| Save opportunity | Passed |
| Remove saved opportunity | Passed |
| Saved jobs after refresh | Passed |
| GitHub code push | Passed |

Further testing is recommended for:
- Invalid registration data.
- Duplicate email registration.
- Incorrect login credentials.
- Expired JWT tokens.
- Accessing saved jobs without authentication.
- Database outage handling.
- Mobile responsiveness.
- Production deployment.

---

## 12. Current Project Status

| Component | Status |
|---|---|
| React/Vite frontend | Implemented |
| Express backend | Implemented |
| Arbeitnow integration | Implemented |
| MySQL database | Implemented |
| Opportunity synchronization | Implemented |
| Search and filters | Implemented |
| Registration and login | Implemented |
| Password hashing | Implemented |
| JWT authentication | Implemented |
| Saved Jobs persistence | Implemented |
| Profile dropdown | Implemented |
| Profile editing | Pending |
| AI recommendations | Pending |
| Admin dashboard | Pending |
| Azure deployment | Pending |
| Automated test suite | Pending |

**Important:** The current project has been tested in a local development environment. Successful local testing does not establish production readiness or cloud deployment.

---

## 13. Delivery Roadmap

| Phase | Deliverable | Status |
|---|---|---|
| 1 | Opportunity discovery MVP | Completed |
| 2 | MySQL database integration | Completed |
| 3 | Authentication and authorization | Implemented |
| 4 | Persistent saved opportunities | Implemented |
| 5 | Student profile editing | Planned |
| 6 | Personalized recommendations | Planned |
| 7 | Admin dashboard | Planned |
| 8 | Azure cloud integration and deployment | Planned |
| 9 | Production security and monitoring | Planned |

---

## 14. Risks and Dependencies

| Risk | Impact | Mitigation |
|---|---|---|
| External API unavailable | Opportunity feed may fail | Handle API errors and consider additional sources |
| Inconsistent listing data | Incorrect cards or filters | Normalize opportunity records |
| Database unavailable | Persistence features may fail | Verify database connectivity |
| Token expiration | User may need to log in again | Handle authentication errors |
| Credentials exposed | Security risk | Keep `.env` ignored and rotate exposed secrets |
| Duplicate listings | Poor discovery experience | Use external IDs and database constraints |
| Unverified recommendation scores | Misleading results | Document recommendation methodology |

---

## 15. Future Enhancements

1. Student profile editing.
2. Skills and interests management.
3. Personalized job recommendations.
4. Additional opportunity sources.
5. Admin dashboard.
6. Azure cloud database integration.
7. Cloud application deployment.
8. Automated testing and monitoring.
9. Improved production security.

---

## 16. Definition of Done

A release is considered complete when:

- Required functionality is implemented.
- Relevant acceptance criteria pass.
- Frontend and backend work together.
- Database operations work correctly.
- Authentication and protected endpoints are tested.
- Error states are handled.
- Credentials are not committed.
- Documentation is updated.
- Tested source code is pushed to GitHub.
- Incomplete features are clearly documented.

---

## 17. Document Maintenance

This document is maintained as the project evolves.

Update it whenever:
- A new feature is implemented.
- API contracts change.
- Database relationships change.
- Security requirements change.
- Cloud deployment is completed.
- A planned feature is deferred or removed.

**Document owner:** StartupScout Project Team  
**Document version:** 2.0  
**Last updated:** 26 November 2026
