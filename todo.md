# TODO

## Current focus

- [ ] Related questions feature
- [ ] Question categorization (tags and topics)
- [ ] Duplicate question filtering

## Finished

- [x] LaTeX support for questions and answers
- [x] Add course linkage in questions

## Low prio

- [ ] Refactor code
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
    - [x] Upvote/downvote functionality
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