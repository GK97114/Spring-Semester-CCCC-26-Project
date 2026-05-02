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

### Phase 3: Build Backend API Endpoints ⚠️ ~80% COMPLETE
- [x] Create `routes/users.js` - UUID generation, cookie-based auth
- [x] Create `routes/meals.js` - CRUD endpoints
- [x] Create `routes/recommendations.js` - recommendation algorithm
- [x] Create auth middleware
- [x] Set up `.env` with DATABASE_URL
- [ ] **Register meals.js and recommendations.js routes in `server/index.js`**
- [ ] **Convert recommendations.js from CommonJS to ES modules**

### Phase 4: Frontend API Integration & UI (🔄 IN PROGRESS)
- [ ] Expand `services/api.js` with real API functions
- [ ] Update MealForm component with state + API integration
- [ ] Update MealList component with real data fetching
- [ ] Update RecommendDisplay component with dynamic recommendations
- [ ] Update App.jsx to bootstrap user session on mount
- [ ] Test end-to-end: add meal → view → recommend

### Phase 5: Render Deployment Configuration (⏳ TODO)
- [ ] Create `render.yaml` deployment config
- [ ] Update scripts in `package.json` for production
- [ ] Configure environment variables on Render
- [ ] Deploy and verify

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

## Next Immediate Steps (Priority Order)

1. **Fix Phase 3 blockers** (15 min):
   - Register `mealsRoutes` and `recommendationsRoutes` in `server/index.js`
   - Convert `recommendations.js` to ES modules (change `require()` to `import`)

2. **Complete Phase 4** (2-3 hours):
   - Update `services/api.js` with real API functions
   - Implement state management in components
   - Bootstrap user session in App.jsx
   - Test end-to-end flow

3. **Defer Phase 5** until MVP is working:
   - Render deployment configuration
   - Environment variable setup for production

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

