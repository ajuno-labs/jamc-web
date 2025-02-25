# JAMC Q&A Platform

JAMC is a Q&A platform designed for educational environments, bringing together students and educators in a collaborative learning community. The platform focuses on knowledge sharing, structured discussions, and seamless integration with learning management systems.

## Project Overview

JAMC combines a robust Q&A system with basic LMS integration to create an efficient knowledge-sharing environment:

- **Question & Answer System**: Post, edit, and categorize questions with support for accepted and official answers
- **User Management**: Separate roles for students and teachers with appropriate permissions
- **Engagement Features**: Voting, reputation system, badges, and leaderboards
- **Search & Filtering**: Full-text search with filtering by tags, courses, or teachers
- **LMS Integration**: Questions can be associated with specific courses/modules
- **AI-powered Enhancements**: Auto-suggest similar questions, AI-generated answers, and content moderation

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm
- Docker (for production deployment only)

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/jamc.git
cd jamc
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit the `.env.local` file with your configuration values.

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production Deployment with Docker

For production deployment, you can use Docker:

1. Build the Docker image:

```bash
docker build -t jamc-app .
```

2. Run the container:

```bash
docker run -p 3000:3000 -e DATABASE_URL=your_database_url jamc-app
```

For orchestrating multiple services:

```bash
docker-compose up -d
```

This will start the application and any required services (database, etc.) defined in the docker-compose.yml file.

## Learn More

This project uses:

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - ORM for database access
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Auth.js](https://authjs.dev/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## License

[MIT](LICENSE)
