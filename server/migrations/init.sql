CREATE TABLE users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE meals (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    location TEXT,
    meal_name TEXT NOT NULL,
    cuisine TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eaten_on DATE DEFAULT CURRENT_DATE
);

-- Stretch goal: allow users to add restaurants, and link meals to those restaurants
CREATE TABLE restaurants (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    cuisine TEXT,
    google_place_id TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stretch goal: allow users to mark restaurants as favorites, and track when they were added to favorites
CREATE TABLE favorite_restaurants (
    user_id UUID NOT NULL,
    restaurant_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, restaurant_id)
);

-- Index to optimize queries that filter meals by user_id, which is a common pattern for fetching meals for a specific user
CREATE INDEX IF NOT EXISTS meals_user_id_idx ON public.meals(user_id);

-- Indexes to optimize queries that filter meals by created_at and user_id + created_at, which are common patterns for fetching recent meals for a user
CREATE INDEX IF NOT EXISTS meals_created_at_idx ON public.meals(created_at);
CREATE INDEX IF NOT EXISTS meals_user_created_idx ON public.meals(user_id, created_at);