# What's For Dinner? - MVP Project

A meal tracking and cuisine recommendation app to help users decide what to eat by analyzing their recent meals and suggesting cuisines they haven't eaten recently.

## Project Status

### Phase 1: Fix Critical Frontend Bugs ✅ COMPLETE
- [x] Add missing `useEffect` import
- [x] Fix malformed JSX syntax
- [x] Remove unused state
- [x] Create stub components (MealForm, MealList, RecommendDisplay)

### Phase 2: Set Up Database ✅ COMPLETE
- [x] Provision Supabase PostgreSQL instance
- [x] Get DATABASE_URL connection string
- [x] Create `migrations/init.sql` with schema
- [x] Create `scripts/init-db.js` initialization script
- [x] Run migrations to Supabase

### Phase 3: Build Backend API Endpoints ✅ COMPLETE
- [x] Create `routes/users.js` - UUID generation, cookie-based auth
- [x] Create `routes/meals.js` - CRUD endpoints
- [x] Create `routes/recommendations.js` - recommendation algorithm
- [x] Create auth middleware
- [x] Set up `.env` with DATABASE_URL
- [x] Register meals.js and recommendations.js routes in `server/index.js`
- [x] Convert recommendations.js from CommonJS to ES modules

### Phase 4: Frontend API Integration & UI ✅ COMPLETE
- [x] Expand `services/api.js` with real API functions
- [x] Update MealForm component with state + API integration
- [x] Update MealList component with real data fetching
- [x] Update RecommendDisplay component with dynamic recommendations
- [x] Update App.jsx to bootstrap user session on mount
- [x] Test end-to-end: add meal → view → recommend

### Phase 5: Render Deployment Configuration ✅ COMPLETE
- [x] Create `render.yaml` deployment config
- [x] Update scripts in `package.json` for production
- [x] Configure environment variables on Render
- [x] Deploy and verify

### Phase 6: Testing & CI/CD Pipeline (⏳ TODO)

#### Backend Unit & Integration Tests
- [x] Install Vitest + Supertest in `server/`
- [x] Create `server/tests/` directory
- [x] Write tests for `POST /api/meals` — valid input, missing fields, invalid cuisine
- [x] Write tests for `GET /api/meals` — returns only user's meals, respects 14 day window
- [x] Write tests for `DELETE /api/meals/:id` — success, 404 on missing meal
- [x] Write tests for `PUT /api/meals/:id` — success, 404 on missing meal
- [x] Write tests for `GET /api/users` — new user creation, existing session reuse
- [x] Write tests for `GET /api/recommendations` — notEnoughMeals path, uniqueCuisines path, weighted scoring path
- [x] Mock database pool for unit tests (no real DB calls in CI)

#### Frontend Component Tests
- [x] Install Vitest + React Testing Library in `client/Whats4Dinner/`
- [x] Create `client/Whats4Dinner/src/tests/` directory
- [ ] Write tests for `MealForm` — renders correctly, submits valid input, blocks empty submission
- [ ] Write tests for `MealList` — renders meal list, handles empty state, delete triggers correctly
- [ ] Write tests for `RecommendDisplay` — renders recommendations, handles loading state, handles empty recommendations
- [ ] Mock `services/api.js` for all frontend tests (no real API calls in CI)

#### GitHub Actions CI Pipeline
- [ ] Create `.github/workflows/ci.yml`
- [ ] Trigger on push to all branches and on pull requests to `main`
- [ ] Add backend test job — install dependencies, run Vitest
- [ ] Add frontend test job — install dependencies, run Vitest
- [ ] Block merges to `main` if any tests fail
- [ ] Add Node.js version matrix (test against Node 18 and 20)

#### GitHub Actions CD Pipeline
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Trigger on push to `main` only
- [ ] Add deploy step — call Render deploy hook for backend web service
- [ ] Add deploy step — call Render deploy hook for frontend static site
- [ ] Store Render deploy hook URLs as GitHub Actions secrets
- [ ] Verify deploy succeeds before marking workflow complete

#### Housekeeping
- [x] Add test scripts to `server/package.json` — `"test": "vitest run"`
- [x] Add test scripts to `client/Whats4Dinner/package.json` — `"test": "vitest run"`
- [ ] Add `.github/` to `.gitignore` exceptions (it must be committed)
- [ ] Update README with how to run tests locally
- [ ] Document how to get Render deploy hook URLs for new contributors

---

## Setup Instructions

### Prerequisites
- Node.js 16+
- Supabase account with PostgreSQL instance
- Environment variable: `DATABASE_URL`

### Backend Setup
```bash
cd server
npm install
npm run init-db  # Initialize database schema
npm run dev      # Start dev server on port 5000
```

### Frontend Setup
```bash
cd client/Whats4Dinner
npm install
npm run dev      # Start dev server on port 3000
```

### Database
- **Type**: PostgreSQL (hosted on Supabase)
- **Connection**: Session pooler
- **Tables**: users, meals, restaurants, favorite_restaurants
- **Status**: Schema initialized, indexes created

---

## API Endpoints

### Users
- `GET /api/users` - Create/fetch user (sets UUID cookie)

### Meals
- `GET /api/meals` - Fetch recent meals (past 14 days)
- `POST /api/meals` - Add new meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

### Recommendations
- `GET /api/recommendations` - Get cuisine recommendations based on history

---

## Current Architecture

**Frontend**: React 19 + Vite
**Backend**: Express 5 + Node.js
**Database**: PostgreSQL (Supabase)
**Auth**: UUID cookie-based (simple, no login required for MVP)

---

## Development Notes

- Cookie is set for 30 days (max age)
- Meals stored for 14 days (query filter in GET /api/meals)
- Recommendation algorithm excludes cuisines eaten in past 14 days
- Input validation on meal name and cuisine
- Error handling via try-catch + HTTP status codes

---

## Deferred Features (Phase 2+)

- User login/accounts (currently anonymous UUID only)
- Restaurant favorites
- Google Maps API integration
- Habit analysis
- Advanced recommendation scoring
- React Query for state management
- Comprehensive test suite

---

## Troubleshooting

**Database connection fails**: Verify DATABASE_URL in `.env` is from Supabase session pooler
**Module not found errors**: Ensure `package.json` has `"type": "module"`
**Routes not found (404)**: Check that routes are imported and registered in `server/index.js`

