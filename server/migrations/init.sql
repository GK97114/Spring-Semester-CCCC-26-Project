CREATE TABLE users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
)

CREATE TABLE meals (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    location TEXT,
    meal_name TEXT NOT NULL,
    cuisine TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE resturants (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    cuisine TEXT,
    google_place_id TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE favorite_restaurants (
    user_id UUID NOT NULL,
    restaurant_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, restaurant_id)
);