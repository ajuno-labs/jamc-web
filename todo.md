# TODO

## Current

- [ ] Lesson page
    - [x] Create lesson
        - [ ] feat: save draft
        - [x] feat: file limit 1MB handling
    - [ ] feat: enhance lesson content display
        - [x] Just refer to the uploaded files and students can download them.
        - [x] LaTeX support for lesson summary section
        - [ ] Mark as read button for student
    - [ ] metadata handling: tags, reading time, etc.
- [ ] Course management
    - [x] Use new models for chapters and modules
        - [x] update seed data 
        - [x] update the whole course page structure
            - [x] remove lib/course-structure.ts
    - [ ] Add a button to edit lessons
- [ ] Question categorization (tags and topics)
- [x] Bug: MathJax can't display fraction
- [ ] Fix: landing page doesn't display logged in user without refreshing
- [ ] Course Management
    - [ ] Course/lesson progress bar in dashboard (Paused - awaiting LMS tracking support)
    - [ ] Define requirements and content for course-specific questions page
    - [ ] Define requirements and content for teacher-specific students page (student stats)
    - [ ] Active student
- [ ] Student activity log
    - [ ] Active student
        - Within a week: viewed lessons, asked/answered questions
    - [ ] Test lesson viewed toggle
- [ ] progress bar (server handling?) in course content
- [ ] Testing: Duplicate question filtering
- [ ] Update course content accordingly to the new lesson schema
- [ ] feat: Create new course button somewhere
- [ ] refactor: reduce size and duplicate code of create course form
- [ ] feat: new approach for sbert: precompute embeddings
    - Currently trying to compute each new question on the fly but that's gonna be too slow
- [ ] Enrollment flow
- [ ] feat: ux error handling in empty titles of nodes in course structure

## Finished

- [x] Redirect to new course after creation.
- [x] Hide 'add' button inside the lesson node in course structure
- [x] style: update create course form button position and spacing
- [x] Fix: flow of sign in should be directly to the qa page, not landing page.
    - Now handled gracefully by middleware with callback url
- [x] ux: wrong email or password alert
- [x] Implement callback url handling in middleware
- [x] Duplicate question filtering
- [x] Link between teacher and their courses aren't clear
    - [x] In course page, the teacher account still displays the enroll button
- [x] Refactor code: Duplicate lib folder
- [x] LaTeX support for questions and answers
- [x] Related questions feature
- [x] Add course linkage in questions
- [x] Upvote/downvote functionality

## Low prio

- [ ] Bring app to docker compose
- [ ] Update README.md
- [ ] Miscellaneous
    - [ ] Generate seed data for testing
    - [ ] Update Next.js version
- [ ] Authentication & User Management
    - [ ] Credentials
        - [ ] Bcrypt hashing (cost factor ≥12)
        - [ ] Rate limiting (e.g., 5 attempts/hour)
        - [ ] Breached password checks (HaveIBeenPwned API)
        - [ ] CSRF token implementation
    - [ ] OAuth
        - Currently no plan for other OAuth providers than Google
    - [ ] Role-based access control (RBAC)
        - [ ] Teacher role permissions
        - [ ] Student role permissions
    - [ ] Profile management
        - [x] Basic user profile
        - [ ] Bug: not changing the header after rename
        - [ ] Activity history
    - [ ] Auth testing
    - [x] Bug: first click doesn't sign in, but second click does
    - [ ] Remember me functionality
    - [ ] Refresh and access token implementation
    - [ ] View all asked (profile) questions

- [ ] Course Management (LMS)
    - [ ] Course creation and editing interface for teachers
    - [ ] Module structure implementation
    - [ ] LaTeX support for mathematical formulas
    - [ ] Text and link content management
    - [ ] Bookmarking important content
    - [ ] Course feedback system
    - [ ] Teacher encouragement: Starter questions to normalize asking

- [ ] Q&A System
    - [ ] Answer submission with LaTeX support
    - [ ] Official answer marking by teachers
    - [ ] Question categorization (tags and topics)
    - [ ] Question subscription
    - [ ] Related questions
    - [ ] Ask question button in question details page
    - [ ] Anonymous Q&A mode (optional)
    - [ ] Choose courses in a question should be selectable from courses the user has enrolled in

- [ ] Integration Features
    - [ ] Linking Q&A to course content
    - [ ] Displaying related discussions on course pages
    - [ ] Navigation between LMS and Q&A sections

- [ ] Search & Filtering
    - [ ] Full-text search implementation
    - [ ] Filtering by topics, teachers, and tags
    - [ ] Search results page optimization
    - [ ] Enhance related questions similarity algorithm (full-text/TF-IDF)

- [ ] Notification System
    - [ ] New answer notifications
    - [ ] Content update notifications
    - [ ] Following/subscription management

- [ ] Gamification
    - [ ] Reputation points system
    - [ ] Badges implementation
    - [ ] Leaderboards
    - [ ] Learning challenges (daily/weekly tasks)

- [ ] Moderation
    - [ ] Content reporting system
    - [ ] Teacher moderation tools
    - [ ] Inappropriate content filtering

- [ ] UI/UX Enhancements
    - [ ] LaTeX rendering optimization
    - [ ] Responsive design for all pages
    - [ ] Accessibility improvements
    - [ ] Dark mode support

- [ ] Future Enhancements
    - [ ] AI-generated answer suggestions
    - [ ] Sentiment analysis for content moderation
    - [ ] RAG model suggested by lecturer
    - [ ] AI nudges & suggestions
    - [ ] Database-level validation with ZenStack