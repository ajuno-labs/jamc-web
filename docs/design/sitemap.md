## Website Design Overview

This project combines a **math-focused Q&A platform** with a **basic LMS** to create an educational tool specifically for mathematics education. The platform features LaTeX support for displaying mathematical formulas throughout both systems. The LMS provides structure (courses, modules, and text-based content), while the Q&A system drives interaction and knowledge sharing between teachers and students.

Given the project scope, the design prioritizes:
1. **Essential Pages**: Core functionality for user management, LMS structure, and Q&A system with LaTeX support.
2. **Integration**: Seamless links between LMS courses/modules and Q&A discussions.
3. **Gamification**: Features to encourage participation and recognize contributions.
4. **Mathematics Support**: LaTeX rendering throughout the platform.

## Sitemap

### Essential Pages (Must-Have)
- **Home** (`/`)
- **Register** (`/register`)
- **Login** (`/login`)
- **Profile** (`/profile`)
- **Courses** (`/courses`)
  - **Course Detail** (`/courses/[courseId]`)
  - **Course Q&A** (`/courses/[courseId]/questions`)
- **Q&A Hub** (`/questions`)
- **Ask Question** (`/questions/ask`)
- **Question Detail** (`/questions/[questionId]`)
- **Search Results** (`/search`)
- **Leaderboards** (`/leaderboards`)

### Additional Pages (Nice-to-Have)
- **Moderation Dashboard** (`/moderation`)
- **About/Help** (`/about`)
- **Learning Challenges** (`/challenges`)

---

## Detailed Page Descriptions

### Essential Pages

#### Home (`/`)
- **Purpose**: Entry point to the platform, welcoming users and providing quick access to key features.
- **Contents**:
  - **Header**: Logo (links to Home), global search bar, navigation links (Courses, Q&A, Profile).
  - **Hero Section**: Brief introduction with calls-to-action (e.g., "Learn Mathematics", "Ask a Question").
  - **Featured Content**: Recent or popular math questions, top courses.
  - **LaTeX Example**: Showcase of mathematical formula rendering capabilities.
- **Why Essential**: Sets the tone and provides immediate access to LMS and Q&A.

#### Register (`/register`)
- **Purpose**: Allows new users to sign up.
- **Contents**:
  - **Form**: Fields for username, email, password, role (student/teacher).
  - **Social Login**: Integration with Auth.js for Google login.
- **Why Essential**: Core user management requirement.

#### Login (`/login`)
- **Purpose**: Authenticates existing users.
- **Contents**:
  - **Form**: Email and password fields.
  - **Forgot Password**: Link to reset password.
  - **Social Login**: Google login option.
- **Why Essential**: Required for secure access.

#### Profile (`/profile`)
- **Purpose**: Displays and manages user information and activity.
- **Contents**:
  - **User Info**: Username, role, reputation points.
  - **Activity**: List of questions asked, answers given.
  - **Badges**: Earned badges for achievements.
  - **Notifications**: List of recent notifications (e.g., replies, updates).
  - **Subscriptions**: List of followed questions/topics.
  - **Edit Profile**: Button to update details (e.g., email, password).
- **Why Essential**: Central hub for user engagement and reputation tracking.

#### Courses (`/courses`)
- **Purpose**: Lists all available mathematics courses in the LMS.
- **Contents**:
  - **Course Cards**: Title, short description, number of modules, number of questions.
  - **Filters**: Filters by math topics or teacher.
- **Why Essential**: Provides the LMS backbone for organizing content.

#### Course Detail (`/courses/[courseId]`)
- **Purpose**: Displays a specific course's structure and content, integrating with Q&A.
- **Contents**:
  - **Course Info**: Title, description.
  - **Modules**: List of modules, each with:
    - **Title**: Module name.
    - **Notes**: Text content with LaTeX support for mathematical formulas.
    - **Links**: External resources or references.
    - **Q&A Link**: Button/link to course-specific questions.
  - **Feedback Section**: Rating and comment form for students to provide feedback.
  - **Bookmark Feature**: Option to bookmark important content for easy navigation.
  - **Teacher Controls**: Edit buttons for content (visible only to teachers).
- **Why Essential**: Links LMS content to Q&A and supports teacher content management.

#### Course Q&A (`/courses/[courseId]/questions`)
- **Purpose**: Shows all Q&A discussions related to a specific course.
- **Contents**:
  - **Question List**: Filtered to show only questions linked to this course.
  - **Filters**: By module, tags, or status (e.g., answered, pinned).
  - **Search Bar**: Course-specific search.
  - **Ask Button**: Link to `/questions/ask` with course pre-selected.
- **Why Essential**: Ensures seamless LMS-Q&A integration.

#### Q&A Hub (`/questions`)
- **Purpose**: Central page for browsing all mathematics questions across the platform.
- **Contents**:
  - **Question List**: Displays all questions with title, tags, votes, and answer count.
  - **Filters**: By course, module, tags, or teacher.
  - **Sort Options**: Newest, most votes, unanswered.
  - **Search Bar**: Filters questions dynamically.
  - **Ask Button**: Prominent link to `/questions/ask`.
- **Why Essential**: Core of the Q&A system, enabling discovery and interaction.

#### Ask Question (`/questions/ask`)
- **Purpose**: Allows users to post new mathematics questions with LaTeX support.
- **Contents**:
  - **Form**: Fields for title, description (with LaTeX editor), tags, and course/module selection.
  - **LaTeX Preview**: Real-time preview of mathematical formulas.
  - **Suggestions**: Similar questions to reduce duplicates.
- **Why Essential**: Enables the primary Q&A functionality with mathematics support.

#### Question Detail (`/questions/[questionId]`)
- **Purpose**: Displays a specific question and its answers, supporting engagement and moderation.
- **Contents**:
  - **Question**: Title, description (with rendered LaTeX), tags, associated course/module.
  - **Answers**: List with text (with rendered LaTeX), upvotes/downvotes.
  - **Engagement**: Buttons to upvote/downvote answers; mark as official (teacher).
  - **Answer Form**: Text area with LaTeX editor to submit a new answer.
  - **Teacher Controls**: Edit, delete, pin options (visible only to teachers).
- **Why Essential**: Heart of the Q&A interaction, integrating voting and moderation.

#### Search Results (`/search`)
- **Purpose**: Displays results from the global search functionality.
- **Contents**:
  - **Results List**: Questions, answers, and courses matching the query.
  - **Filters**: Narrow by type (question, course), course, or tags.
- **Why Essential**: Supports the search system for finding content across LMS and Q&A.

#### Leaderboards (`/leaderboards`)
- **Purpose**: Showcases top contributors to boost engagement.
- **Contents**:
  - **Rankings**: Users ranked by reputation points.
  - **Categories**: Tabs for different achievements (e.g., "Top Answerers," "Most Helpful").
  - **Badges**: Display of available badges and how to earn them.
- **Why Essential**: Core component of the gamification system to encourage participation.

---

### Additional Pages (Nice-to-Have)

#### Moderation Dashboard (`/moderation`)
- **Purpose**: Centralized tool for teachers to manage content.
- **Contents**:
  - **Reported Content**: List of flagged questions/answers.
  - **Actions**: Approve, reject, edit, delete, or pin content.
  - **Analytics**: Basic stats on Q&A activity (e.g., questions per course).
- **Why Optional**: Moderation can initially be handled within `Question Detail` and `Course Detail` pages.

#### About/Help (`/about`)
- **Purpose**: Provides platform information and user support.
- **Contents**:
  - **Overview**: Explanation of the platform's purpose for mathematics education.
  - **LaTeX Guide**: Instructions for using LaTeX in questions and answers.
  - **FAQ**: Common questions about the platform.
  - **Contact**: Support email or form.
- **Why Optional**: Useful but not required for initial launch.

#### Learning Challenges (`/challenges`)
- **Purpose**: Presents daily/weekly tasks to encourage participation.
- **Contents**:
  - **Current Challenges**: List of active challenges (e.g., "Answer 5 questions this week").
  - **Rewards**: Points or badges earned for completing challenges.
  - **History**: Past challenges and user's completion record.
- **Why Optional**: Can be added after core gamification features are implemented.

---

## Implementation Notes

### Prioritization
To meet the project goals, focus on the **essential pages** first:
1. **User Management**: Register, Login, Profile.
2. **LMS Structure**: Courses, Course Detail with LaTeX support.
3. **Q&A System**: Q&A Hub, Ask Question, Question Detail with LaTeX support.
4. **Integration**: Course Q&A linking from Course Detail.
5. **Search**: Basic search functionality.
6. **Gamification**: Leaderboards and basic reputation system.

Then, if time remains, add **Moderation Dashboard**, **About/Help**, and **Learning Challenges**.

### Navigation
- **Header**: Persistent across all pages with:
  - Logo (links to `/`).
  - Search bar (triggers `/search`).
  - Links: Courses (`/courses`), Q&A (`/questions`), Profile (`/profile`), Leaderboards (`/leaderboards`).
  - Teacher-specific: Moderation link (if separate dashboard is built).
- **Breadcrumbs**: On `Course Detail`, `Course Q&A`, and `Question Detail` for easy back-navigation.

### LaTeX Implementation
- Use a JavaScript library like KaTeX or MathJax for rendering mathematical formulas.
- Implement LaTeX editors in all content creation forms (questions, answers, course materials).
- Provide real-time preview of rendered formulas.
- Include a basic LaTeX guide for users unfamiliar with the syntax.

### Tech Stack Alignment
- **Next.js App Router**: Use dynamic routes for scalability.
- **Auth.js**: Implement role-based access (students vs. teachers).
- **PostgreSQL/Prisma**: Store users, courses, modules, questions, answers, and votes.
- **LaTeX Rendering**: KaTeX or MathJax for formula display.