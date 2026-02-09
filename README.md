# 🎮 MythoPlay - Kids Gaming & Learning Platform

A production-ready web application for children to learn Indian Mythology through fun, interactive quizzes.

## ✨ Features

### For Kids (Ages 5-14)
- 🏹 **Indian Mythology Quizzes**: Ramayana, Mahabharata, Krishna Leela, Ganesha Stories, Indian Festivals
- 🎯 **Multiple Quiz Types**: Multiple choice, Image-based, Timed quizzes
- 🏆 **Leaderboards**: Weekly/Monthly rankings by category and age group
- ⭐ **Natkhat Gannu Community**: Exclusive content for community members
- 🎁 **Rewards System**: Badges, points, and gift eligibility

### For Admins
- 📊 **Dashboard**: Real-time statistics and analytics
- 📝 **Quiz Management**: Create, edit, and manage quizzes and questions
- 👥 **User Management**: View users, manage memberships, approve gift eligibility
- 🔐 **Secure Login**: Email/password authentication with bcrypt hashing

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Google Cloud Console account (for OAuth)

### Setup

1. **Clone and configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values, especially GOOGLE_CLIENT_ID
   ```

2. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized JavaScript origins: `http://localhost:3000`
   - Add authorized redirect URIs: `http://localhost:3000`
   - Copy the Client ID to your `.env` file

3. **Run with Docker Compose**
   ```bash
   docker compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Admin Panel: http://localhost:3000/admin/login

### Default Admin Credentials
- **Email**: admin@mythoplay.com
- **Password**: admin123

⚠️ **Change these credentials in production!**

## 🏗️ Architecture

```
MythoPlay/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Auth & rate limiting
│   │   ├── routes/         # API endpoints
│   │   └── scripts/        # Database initialization
│   ├── database/           # SQL schema & seed data
│   └── Dockerfile
├── frontend/               # Next.js React Application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── lib/           # API client & state management
│   │   ├── pages/         # App routes
│   │   └── styles/        # Tailwind CSS
│   └── Dockerfile
├── docker-compose.yml      # Container orchestration
└── .env.example           # Environment template
```

## 📊 Database Schema

- **users**: Kids/Parents via Google OAuth
- **admins**: Admin accounts with hashed passwords
- **quizzes**: Quiz metadata and settings
- **quiz_questions**: Individual questions with options
- **quiz_scores**: User quiz attempts and scores

## 🔒 Security Features

- COPPA-compliant design
- JWT-based authentication
- Rate limiting on sensitive endpoints
- Password hashing with bcrypt
- Role-based access control
- Minimal personal data storage

## 🛠️ Development

### Run locally without Docker

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Initialize Database
```bash
cd backend
npm run db:init
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user

### Quizzes
- `GET /api/quizzes` - List quizzes
- `GET /api/quizzes/:id` - Get quiz with questions
- `POST /api/quizzes/:id/submit` - Submit quiz answers

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard
- `GET /api/leaderboard/categories` - Get filter options

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `CRUD /api/admin/quizzes` - Quiz management
- `GET/PATCH /api/admin/users` - User management

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, PostgreSQL
- **Auth**: Google OAuth, JWT, bcrypt
- **Containerization**: Docker, Docker Compose

## 📄 License

MIT License - See LICENSE file for details.

---

Built with ❤️ for kids learning Indian Mythology!

