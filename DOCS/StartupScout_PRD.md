# StartupScout --- Product Requirements Document (PRD)

**Document version:** 1.0\
**Status:** Draft --- working requirements\
**Project:** StartupScout\
**Product type:** Student-focused job and internship discovery platform\
**Primary audience:** College students and early-career candidates

------------------------------------------------------------------------

## 1. Product overview

StartupScout is a web application intended to help students discover job
and internship opportunities from multiple sources in one place. Instead
of searching across several websites independently, users can browse a
consolidated opportunity feed, search by role or skill, filter by
opportunity type, save interesting listings, and open the original
application link.

The longer-term product direction is to provide student accounts,
profiles, and more relevant opportunity recommendations based on a
user's skills and interests.

### 1.1 Problem statement

Students often need to search across multiple websites to find
internships and entry-level jobs. Listings may be scattered across
sources, and keeping track of interesting opportunities can be
inconvenient.

StartupScout aims to make discovery and tracking easier through a
single, searchable interface.

### 1.2 Product vision

Build a simple, reliable platform where students can discover relevant
opportunities, keep track of saved listings, and eventually receive
recommendations aligned with their skills and career interests.

------------------------------------------------------------------------

## 2. Goals and success criteria

### 2.1 Product goals

1.  Aggregate job and internship listings from supported external
    sources.
2.  Present opportunities in a clear, consistent card-based interface.
3.  Allow users to search listings by title, company, and skills.
4.  Allow users to filter listings by type, such as internships and
    jobs.
5.  Allow users to save and revisit opportunities.
6.  Provide a foundation for secure student accounts and profiles.
7.  Prepare the application for future cloud database hosting and
    deployment.

### 2.2 Initial success criteria

The initial release can be considered functional when:

-   The frontend loads without a runtime error.
-   The backend starts successfully.
-   The opportunities API returns valid JSON.
-   The frontend displays the opportunities returned by the backend.
-   Search and category filters return the expected results.
-   A user can save and unsave an opportunity.
-   Saved opportunities remain available after a page refresh in the
    same browser.
-   Each listing's application link opens its source page.
-   Loading, empty, and API-error states are displayed clearly.

Authentication, cloud hosting, and AI-based matching are later
milestones and should not be represented as complete until implemented
and tested.

------------------------------------------------------------------------

## 3. Target users

### Primary user: Student / early-career candidate

A college student or recent graduate looking for internships,
entry-level jobs, or opportunities related to their skills.

**Needs** - Find opportunities without searching many websites
separately. - Search using skills, role names, or company names. -
Separate internships from jobs. - Save listings to review or apply
later. - Open the original application page.

### Future user: Registered student

A student with an account and profile containing skills and interests.

**Potential future needs** - Maintain a personal profile. - Access saved
opportunities across devices. - Receive recommendations based on profile
information.

### Future user: Administrator

A person responsible for managing platform content and reviewing
reported or invalid listings.

**Potential future needs** - Review and manage opportunity records. -
Monitor data quality and source availability. - Manage user-related
issues.

------------------------------------------------------------------------

## 4. Scope

### 4.1 Current MVP scope

The current MVP is focused on opportunity discovery:

-   React-based frontend.
-   Node.js and Express backend.
-   Opportunities API exposed at `/api/opportunities`.
-   External opportunity data integration; the project has used the
    Arbeitnow API.
-   Opportunity cards showing role, company, type, location, skills,
    source, and application link where supplied by the API.
-   Search across title, company, and skills.
-   Category filters for All, Internship, and Job.
-   Saved opportunities stored in browser `localStorage`.
-   Loading, error, and no-results states.

### 4.2 Planned scope --- not yet confirmed as implemented

-   Student signup and login.
-   Secure password hashing and token-based authentication.
-   MySQL persistence for users and saved opportunities.
-   Student profile and skill management.
-   Personalized opportunity matching.
-   Admin dashboard.
-   Azure-hosted database and application deployment.

### 4.3 Out of scope for the initial MVP

-   Applying to jobs on behalf of users.
-   Guaranteeing that a listing is still open or that an employer will
    respond.
-   Hosting employers' application forms.
-   Charging users or processing payments.
-   Automatically scraping websites without checking their terms and
    access rules.

------------------------------------------------------------------------

## 5. Functional requirements

Priority definitions:

-   **P0:** Required for the discovery MVP.
-   **P1:** Planned next-stage capability.
-   **P2:** Later enhancement.

### FR-01 --- View opportunities (P0)

The system shall display opportunity records returned by the backend
API.

Each opportunity card should display available fields such as: -
Opportunity title. - Company name. - Opportunity type. - Location. -
Skills. - Source. - Original application URL.

If an optional field is missing, the interface should remain usable and
display a sensible fallback rather than crashing.

**Acceptance criteria** - The page requests data from the backend. -
Valid records appear as cards. - An empty response displays a no-results
message. - A failed request displays an understandable error message.

### FR-02 --- Search opportunities (P0)

The system shall let users enter a search term.

The MVP search shall match the term against: - Opportunity title. -
Company name. - Skills supplied with the opportunity.

**Acceptance criteria** - Matching records are displayed. - Non-matching
records are excluded. - Clearing the search restores the unsearched
results.

### FR-03 --- Filter by opportunity type (P0)

The system shall provide the following filters: - All. - Internship. -
Job.

**Acceptance criteria** - Selecting a filter displays only records of
the selected type. - Selecting All restores all types. - The result
count reflects the filtered list.

### FR-04 --- Save and unsave opportunities (P0)

Users shall be able to save or remove an opportunity using its bookmark
control.

For the current MVP, saved IDs shall be stored in browser `localStorage`
under the key `startupscout_saved`.

**Acceptance criteria** - Clicking the bookmark saves an unsaved
opportunity. - Clicking it again removes the opportunity from saved
items. - The saved count updates correctly. - Saved items remain saved
after a page refresh in the same browser. - The Saved view displays
saved opportunities.

**MVP limitation:** Browser-local saved data is not synchronized between
devices or user accounts.

### FR-05 --- Open the original application page (P0)

Each opportunity card shall provide an Apply Now link to the
source-provided URL.

**Acceptance criteria** - The link opens the supplied URL in a new
browser tab. - The application does not claim that an application has
been submitted.

### FR-06 --- Refresh opportunity data (P0)

The interface shall provide a way to reload opportunity data from the
backend.

**Acceptance criteria** - Refresh triggers a new data load. - Loading
feedback is shown while the request is in progress. - API errors are
communicated to the user.

### FR-07 --- Student registration and login (P1)

The system is planned to support student account creation and login.

Expected capabilities: - Register with a name, email address, and
password. - Validate required fields. - Prevent duplicate accounts for
the same normalized email address. - Store a password hash, never a
plaintext password. - Authenticate users and issue a session/token using
a secure implementation. - Allow users to log out.

**Acceptance criteria** - Valid registration creates an account. -
Invalid input produces a useful validation message. - Incorrect login
credentials are rejected. - Passwords are not returned by API responses
or stored as plaintext.

**Status:** Planned. Do not mark complete until the API, database
persistence, and end-to-end tests work.

### FR-08 --- Student profile (P1)

Registered students are planned to be able to maintain profile
information such as: - Name. - Email address. - Skills. - Areas of
interest.

The exact profile fields and edit permissions must be finalized before
implementation.

### FR-09 --- Persistent saved opportunities (P1)

After authentication is implemented, saved opportunities may be
associated with a student account in MySQL so they can be accessed
across devices.

This will replace or extend the current browser-only saved list.
Migration and conflict behavior for existing `localStorage` data must be
decided.

### FR-10 --- Personalized opportunity matching (P2)

The product may recommend opportunities based on a student's profile,
skills, and interests.

The first version should use explainable matching rules or a clearly
documented scoring method. A displayed match percentage must not imply a
validated prediction unless the scoring method supports that claim.

### FR-11 --- Administration (P2)

A future admin interface may allow authorized administrators to: -
Review opportunity records. - Remove invalid or duplicate records. -
Monitor source/API failures. - Review user reports.

Admin permissions and audit requirements must be defined before this
feature is built.

------------------------------------------------------------------------

## 6. User journeys

### 6.1 Discover and apply

1.  User opens StartupScout.
2.  The frontend requests opportunities from the backend.
3.  The user browses the opportunity cards.
4.  The user searches by a role, company, or skill.
5.  The user optionally filters by Internship or Job.
6.  The user opens Apply Now.
7.  The original source website handles the application.

### 6.2 Save an opportunity

1.  User finds an interesting opportunity.
2.  User clicks its bookmark icon.
3.  The opportunity ID is stored in `localStorage`.
4.  The saved count updates.
5.  User opens Saved to revisit the listing.
6.  User can remove the saved item by clicking the bookmark again.

### 6.3 Future account journey

1.  Student opens signup.
2.  Student enters the required registration details.
3.  Backend validates the request and stores the account securely.
4.  Student logs in.
5.  Student manages their profile and saved opportunities.

This journey is a planned capability, not part of the confirmed working
MVP.

------------------------------------------------------------------------

## 7. Technical requirements and proposed architecture

### 7.1 Technology stack

  -----------------------------------------------------------------------
  Layer                   Technology              Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                React                   User interface

  Frontend tooling        Vite                    Development and build
                                                  tooling

  Styling                 CSS                     Layout and visual
                                                  design

  Icons                   lucide-react            Interface icons

  Backend                 Node.js                 Server runtime

  API framework           Express.js              HTTP API

  Opportunity data        Arbeitnow API           External opportunity
                          (previously integrated) source

  Database                MySQL (local            Persistent application
                          development             data
                          planned/under           
                          verification)           

  Version control         Git and GitHub          Source-code management

  Cloud target            Microsoft Azure         Future hosting/database
                          (planned)               deployment
  -----------------------------------------------------------------------

### 7.2 High-level architecture

``` text
                 Student / Browser
                         |
                         v
               React + Vite Frontend
                         |
                         | HTTP request
                         v
                Node.js + Express API
                         |
             +-----------+-----------+
             |                       |
             v                       v
       External job API         MySQL Database
        (Arbeitnow)             (planned integration)
```

The current frontend calls:

``` text
http://localhost:5000/api/opportunities
```

The backend should retrieve or serve opportunity data in a consistent
JSON structure. The exact caching, refresh, and external API failure
behavior should be documented during implementation.

### 7.3 Suggested project structure

The actual repository structure should be checked before files are moved
or renamed.

``` text
StartupScout/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── db.js
│   │   └── test-db.js
│   ├── .env                 # local only; never commit
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
├── .gitignore
└── README.md
```

------------------------------------------------------------------------

## 8. API requirements

### 8.1 Existing opportunity endpoint

**Method:** `GET`\
**Path:** `/api/opportunities`

**Purpose:** Return opportunity records for the frontend.

The frontend currently expects a response containing a `data` array:

``` json
{
  "data": [
    {
      "id": "example-id",
      "title": "Example Developer Intern",
      "company": "Example Company",
      "type": "Internship",
      "location": "Remote",
      "skills": ["JavaScript", "React"],
      "source": "Example Source",
      "url": "https://example.com/apply"
    }
  ]
}
```

The example above illustrates the expected shape; it is not a claim that
these exact values exist in the live API response.

### 8.2 Planned authentication endpoints

These routes are proposed and should be implemented only after the
database schema and validation rules are agreed.

  -----------------------------------------------------------------------
  Method                  Proposed path           Purpose
  ----------------------- ----------------------- -----------------------
  POST                    `/api/auth/register`    Create a student
                                                  account

  POST                    `/api/auth/login`       Authenticate a student

  GET                     `/api/auth/me`          Return the
                                                  authenticated user's
                                                  profile

  POST                    `/api/auth/logout`      End the user's session,
                                                  if server-managed
                                                  sessions are used
  -----------------------------------------------------------------------

### 8.3 API conventions

-   Use appropriate HTTP status codes.
-   Validate request bodies on the server.
-   Return consistent JSON error structures.
-   Do not expose database credentials, password hashes, or internal
    stack traces.
-   Use environment variables for secrets and environment-specific
    settings.
-   Configure CORS for the actual frontend origin rather than allowing
    unnecessary origins in production.

------------------------------------------------------------------------

## 9. Data requirements and proposed database model

The database design must be verified against the actual MySQL schema
before implementation. The following is a proposed logical model, not a
statement that all tables currently exist.

### 9.1 Proposed entities

  -----------------------------------------------------------------------
  Entity                  Purpose                 Example fields
  ----------------------- ----------------------- -----------------------
  Users                   Student account         id, name, email,
                                                  password_hash,
                                                  created_at

  Opportunities           Job/internship listing  id, title, company_id,
                                                  type, location, source,
                                                  url

  Companies               Employer information    id, name

  Skills                  Reusable skill names    id, name

  OpportunitySkills       Many-to-many link       opportunity_id,
                          between opportunities   skill_id
                          and skills              

  UserSkills              Student skills          user_id, skill_id

  SavedOpportunities      Student bookmarks       user_id,
                                                  opportunity_id,
                                                  created_at
  -----------------------------------------------------------------------

### 9.2 Data integrity

-   Use primary keys for records.
-   Enforce a unique constraint on normalized user email addresses.
-   Use foreign keys for relational references.
-   Prevent duplicate saved records for the same user and opportunity.
-   Store timestamps where useful.
-   Decide how external opportunity IDs and duplicate listings are
    handled.

------------------------------------------------------------------------

## 10. Non-functional requirements

### 10.1 Security

-   Never commit `.env` files or credentials to GitHub.
-   Use password hashing for account passwords.
-   Validate and sanitize untrusted input.
-   Use parameterized database queries.
-   Protect private endpoints with authentication and authorization.
-   Use HTTPS in production.
-   Avoid exposing secrets or sensitive details in logs and API
    responses.
-   Apply sensible request limits and security headers before public
    deployment.

### 10.2 Performance

-   Show a loading state while opportunities are fetched.
-   Avoid unnecessary repeated API requests.
-   Keep search and filtering responsive for the expected MVP data
    volume.
-   Consider pagination or incremental loading if the listing volume
    grows.

### 10.3 Reliability

-   Handle external API failures gracefully.
-   Show useful error and empty states.
-   Keep the frontend usable when optional listing fields are missing.
-   Verify database availability before relying on database-backed
    features.

### 10.4 Usability and accessibility

-   Use clear labels and understandable actions.
-   Ensure controls can be used with a keyboard.
-   Provide visible focus states.
-   Use readable contrast and responsive layouts.
-   Give buttons and icon-only controls accessible names.

### 10.5 Maintainability

-   Keep frontend, backend, and database responsibilities separated.
-   Keep secrets in environment variables.
-   Document setup and run commands.
-   Use Git commits for meaningful project milestones.
-   Add tests for important API and user flows.

------------------------------------------------------------------------

## 11. Error and edge-case handling

The application should handle at least these cases:

-   Backend is unavailable.
-   Opportunity API returns an error.
-   API returns an empty list.
-   An opportunity is missing optional fields.
-   Search produces no matching results.
-   A saved ID no longer appears in the current feed.
-   An external application URL is missing or invalid.
-   Database credentials are missing or incorrect.
-   Database server is unavailable.
-   Signup email already exists.
-   Login credentials are incorrect.
-   An unauthenticated user tries to access a protected endpoint.

------------------------------------------------------------------------

## 12. Testing and acceptance plan

### 12.1 Backend checks

-   Confirm backend dependencies are installed.
-   Confirm the backend start script works.
-   Confirm the server listens on the configured port.
-   Request `GET /api/opportunities`.
-   Verify status code, JSON shape, and error handling.
-   Test database connectivity independently before enabling
    database-dependent features.

### 12.2 Frontend checks

-   Confirm the Vite development server starts.
-   Confirm the page loads without console errors.
-   Confirm opportunity cards render.
-   Test search with a known title or skill.
-   Test All, Internship, and Job filters.
-   Save an opportunity, refresh the page, and verify it remains saved.
-   Unsave the opportunity and verify the count changes.
-   Test loading, empty, and API-error states.
-   Test the layout at desktop and mobile widths.

### 12.3 Integration checks

-   Confirm the frontend can reach the backend.
-   Confirm the frontend handles a backend outage.
-   After database integration, verify data is persisted and retrieved
    correctly.
-   After authentication is implemented, test signup, login, logout, and
    protected routes.

### 12.4 Release gate

Do not call a feature complete merely because its UI exists. Mark it
complete only after its expected behavior has been tested.

------------------------------------------------------------------------

## 13. Delivery roadmap

The order below is a proposed delivery sequence. Actual completion dates
should be set by the project team.

  -----------------------------------------------------------------------
  Phase                   Deliverable             Completion condition
  ----------------------- ----------------------- -----------------------
  1                       Existing MVP            Frontend, backend, API,
                          verification            search, filters, and
                                                  local saved items pass
                                                  checks

  2                       Database integration    Backend connects
                                                  reliably to the agreed
                                                  MySQL database and
                                                  schema

  3                       Authentication          Signup, login, logout,
                                                  and protected routes
                                                  pass tests

  4                       Student profile         Students can view and
                                                  update agreed profile
                                                  fields

  5                       Persistent bookmarks    Saved opportunities are
                                                  associated with
                                                  authenticated users

  6                       Opportunity matching    Documented matching
                                                  logic returns relevant
                                                  opportunities

  7                       Admin capabilities      Authorized
                                                  administration
                                                  workflows pass tests

  8                       Cloud deployment        Production environment,
                                                  database, secrets, and
                                                  HTTPS are configured
                                                  and verified
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 14. Risks and dependencies

  --------------------------------------------------------------------------
  Risk / dependency          Impact                  Mitigation
  -------------------------- ----------------------- -----------------------
  External job API changes   Opportunity feed may    Handle errors, document
  or becomes unavailable     stop updating           source dependency, and
                                                     consider additional
                                                     permitted sources

  Inconsistent listing       Cards or filters may    Normalize and validate
  fields                     behave incorrectly      opportunity records in
                                                     the backend

  Database                   Account and persistence Verify environment
  connection/configuration   features cannot work    loading and database
  problems                                           connectivity before
                                                     building dependent
                                                     features

  Secrets accidentally       Credential exposure     Keep `.env` ignored,
  committed                                          rotate exposed
                                                     credentials, and review
                                                     commits

  Duplicate or expired       Poor user experience    Define deduplication
  listings                                           and freshness rules

  Unverified AI match score  Misleading              Document scoring logic
                             recommendations         and avoid unsupported
                                                     accuracy claims
  --------------------------------------------------------------------------

------------------------------------------------------------------------

## 15. Assumptions and open questions

The following decisions need confirmation during implementation:

1.  Which opportunity sources are permitted and supported for the first
    release?
2.  Should the app use local MySQL for development and Azure Database
    for MySQL in production?
3.  What exact MySQL database name, tables, and relationships currently
    exist?
4.  Should authentication use JWTs or server-managed sessions? The
    security design must determine secure token storage and logout
    behavior.
5.  Which student profile fields are required?
6.  Should saved opportunities be migrated from browser `localStorage`
    to the user's account after signup?
7.  How should duplicate, expired, or unavailable listings be
    identified?
8.  What matching method should power future recommendations?
9.  Who will have admin access, and what actions should administrators
    be allowed to perform?
10. What are the final hosting, domain, and deployment requirements?

------------------------------------------------------------------------

## 16. Current project status

This section records the status known when this PRD was drafted. It must
be updated after a fresh run and verification of the local project.

  -----------------------------------------------------------------------
  Component                           Known status
  ----------------------------------- -----------------------------------
  React/Vite frontend                 Implemented; needs a fresh runtime
                                      check

  Express backend                     Implemented; startup needs a fresh
                                      runtime check

  Arbeitnow opportunity integration   Previously added; needs live API
                                      verification

  Search and category filters         Present in frontend code; needs
                                      behavior testing

  Saved opportunities                 Present using `localStorage`; needs
                                      persistence testing

  GitHub repository                   Created and initial project push
                                      previously succeeded

  MySQL connection                    Not verified; earlier test
                                      indicated the password was not
                                      being loaded

  Login/signup                        Not implemented as working
                                      authentication

  Student profiles                    Planned

  AI matching                         Planned

  Azure database/deployment           Planned; not yet verified as
                                      integrated
  -----------------------------------------------------------------------

**Important:** Earlier development notes indicate a possible `.env`
parsing issue because the database password began with `#`. If that is
still the case, quote the value in the local `.env` file and verify it
is loaded without printing the secret. Do not put credentials in this
document or commit them to Git.

------------------------------------------------------------------------

## 17. Definition of done

A release is ready only when:

-   Requirements for that release are implemented.
-   The relevant acceptance criteria pass.
-   Frontend and backend work together in the target environment.
-   Error states are handled.
-   No credentials or private configuration are committed.
-   Setup instructions are accurate.
-   The GitHub repository contains the tested code.
-   Any incomplete or deferred requirements are clearly documented.

------------------------------------------------------------------------

## 18. Document maintenance

This PRD is a living project document. Update it when: - Scope or
priorities change. - A proposed feature is implemented and tested. -
Database or API contracts change. - Deployment decisions are
finalized. - A requirement is deferred or removed.

**Document owner:** StartupScout project team\
**Last updated:** 25 November 2026
