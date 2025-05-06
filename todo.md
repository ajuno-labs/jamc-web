# TODO

## Current

- [ ] Enhance course content
    - [ ] Allow pasting files, like images, pdfs, etc. for lesson summary that can quickly help students upon reviewing the lesson and go for questions.
- [ ] Question categorization (tags and topics)
- [ ] Bug: MathJax can't display fractions
- [ ] Fix: landing page doesn't display logged in user without refreshing
- [ ] Fix: flow of sign in should be directly to the qa page, not landing page.
- [ ] Using enhanced prisma gracefully (for teacher dashboard)
- [ ] Course Management
    - [ ] Course/lesson progress bar in dashboard (Paused - awaiting LMS tracking support)
    - [ ] Define requirements and content for course-specific questions page
    - [ ] Define requirements and content for teacher-specific students page (student stats)
    - [ ] Active student
- [ ] Student activity log
    - [ ] Active student
        - Within a week: viewed lessons, asked/answered questions
    - [ ] Test lesson viewed toggle
- [ ] Remove 'add' button inside the lesson node in course structure
- [ ] Redirect to new course after creation.
- [ ] progress bar (server handling?) in course content
- [ ] Testing: Duplicate question filtering
- [ ] Update course content accordingly to the new lesson schema.

## Finished

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
    - [ ] Question creation with LaTeX support
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
    - [ ] AI-suggested similar questions
    - [ ] AI-generated answer suggestions
    - [ ] Sentiment analysis for content moderation
    - [ ] RAG model suggested by lecturer
    - [ ] AI nudges & suggestions
    - [ ] Database-level validation with ZenStack