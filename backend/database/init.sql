-- Drop tables if they exist to start fresh (for dev environment)
DROP TABLE IF EXISTS generations;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Generations Table (History)
CREATE TABLE generations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for faster pagination and sorting on timestamp
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX idx_generations_user_id ON generations(user_id);

-- Seed Data: Create a Default User (so the app works immediately)
INSERT INTO users (username, email) VALUES ('demo_dev', 'dev@example.com');

-- Seed Data: Sample History
INSERT INTO generations (user_id, prompt, language, code) 
VALUES (1, 'Print hello world', 'python', 'print("Hello World")');