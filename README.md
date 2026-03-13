# MyShelf

A web application to track, rate and review movies and TV shows to browse trending content, manage your watchlist, and share your opinions.

## Features

- **Authentication** — email/password registration and Google OAuth
- **Movies & TV Shows** — trending, popular, latest releases, browse by genre
- **Search** — search movies and TV shows powered by TMDB
- **Watchlist** — add content to watch later or mark as watched
- **Reviews** — rate, comment and reply to other users' reviews
- **History** — track everything you've watched
- **Profile** — manage your account, lists, and personal data

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4 |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + Google OAuth |
| External API | TMDB (The Movie Database) |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- TMDB API key → [themoviedb.org](https://www.themoviedb.org/settings/api)
- Google OAuth credentials → Google Cloud Console

### 1. Clone the repository

```bash
git clone <repo-url>
cd my_rncp-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env.local` file inside `my_rncp-project/`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/myshelf"

JWT_SECRET="your_jwt_secret"

TMDB_API_KEY="your_tmdb_api_key"
NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_REDIRECT_URL="http://localhost:3000/api/auth/google/callback"
```

### 4. Set up the database

```bash
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
my_rncp-project/
├── app/
│   ├── api/         # API routes (auth, reviews, watchlist, tmdb, views)
│   ├── auth/        # Login & register pages
│   ├── movies/      # Movie pages (detail, popular, latest, genre)
│   ├── tvshows/     # TV show pages
│   ├── me/          # Profile, watchlist, reviews, history, settings
│   └── search/      # Search page
├── components/      # Reusable UI components
├── lib/             # Services (auth, TMDB, Prisma, Google OAuth)
└── prisma/          # Database schema
```

## Author

Julie — RNCP Project 2025
