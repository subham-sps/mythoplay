-- MythoPlay Database Schema
-- PostgreSQL Schema for Kids Gaming and Learning Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (kids/parents via Google OAuth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    google_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar VARCHAR(500),
    age_group VARCHAR(10) CHECK (age_group IN ('5-7', '8-10', '11-14')),
    is_natkhat_gannu_member BOOLEAN DEFAULT FALSE,
    is_eligible_for_gifts BOOLEAN DEFAULT FALSE,
    total_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admins table (email + password login)
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes table
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('ramayana', 'mahabharata', 'krishna_leela', 'ganesha_stories', 'indian_festivals')),
    age_group VARCHAR(10) NOT NULL CHECK (age_group IN ('5-7', '8-10', '11-14')),
    quiz_type VARCHAR(50) NOT NULL CHECK (quiz_type IN ('multiple_choice', 'image_based', 'timed')),
    time_limit_seconds INTEGER DEFAULT NULL,
    is_exclusive BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Questions table
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_image VARCHAR(500),
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    points INTEGER DEFAULT 10,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Scores table
CREATE TABLE quiz_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_taken_seconds INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_age_group ON users(age_group);
CREATE INDEX idx_users_natkhat_member ON users(is_natkhat_gannu_member);
CREATE INDEX idx_quizzes_category ON quizzes(category);
CREATE INDEX idx_quizzes_age_group ON quizzes(age_group);
CREATE INDEX idx_quiz_scores_user_id ON quiz_scores(user_id);
CREATE INDEX idx_quiz_scores_quiz_id ON quiz_scores(quiz_id);
CREATE INDEX idx_quiz_scores_completed_at ON quiz_scores(completed_at);
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);

-- Leaderboard views for efficient queries
CREATE OR REPLACE VIEW leaderboard_weekly AS
SELECT 
    u.id,
    u.name,
    u.avatar,
    u.age_group,
    SUM(qs.score) as total_score,
    COUNT(qs.id) as quizzes_completed,
    q.category
FROM users u
JOIN quiz_scores qs ON u.id = qs.user_id
JOIN quizzes q ON qs.quiz_id = q.id
WHERE qs.completed_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY u.id, u.name, u.avatar, u.age_group, q.category
ORDER BY total_score DESC;

CREATE OR REPLACE VIEW leaderboard_monthly AS
SELECT 
    u.id,
    u.name,
    u.avatar,
    u.age_group,
    SUM(qs.score) as total_score,
    COUNT(qs.id) as quizzes_completed,
    q.category
FROM users u
JOIN quiz_scores qs ON u.id = qs.user_id
JOIN quizzes q ON qs.quiz_id = q.id
WHERE qs.completed_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.id, u.name, u.avatar, u.age_group, q.category
ORDER BY total_score DESC;

-- Trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON quiz_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

