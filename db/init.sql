-- Initialize database schema for Tareas Casa

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    color VARCHAR(50) DEFAULT 'gray',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Meals table (supports lunch/snack/dinner)
CREATE TABLE IF NOT EXISTS meals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    meal_type ENUM('almuerzo', 'merienda', 'cena') NOT NULL DEFAULT 'almuerzo',
    meal_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date_type (date, meal_type)
);

-- Grocery items table
CREATE TABLE IF NOT EXISTS grocery_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Household tasks table
CREATE TABLE IF NOT EXISTS household_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Schedules table (horarios)
CREATE TABLE IF NOT EXISTS schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    day_of_week ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NULL,
    schedule_date DATE NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_recurring BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Schedule-Users junction table (many-to-many)
CREATE TABLE IF NOT EXISTS schedule_users (
    schedule_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (schedule_id, user_id),
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for common queries
CREATE INDEX idx_meals_date ON meals(date);
CREATE INDEX idx_tasks_due_date ON household_tasks(due_date);
CREATE INDEX idx_tasks_completed ON household_tasks(is_completed);

-- Insert default users with password 'changeme' (bcrypt hash)
-- You should change these passwords after first login!
INSERT INTO users (username, password_hash, color) VALUES 
('usuario1', '$2b$10$kDFQCAYYSZiO.l1NVl.YnuXvPcdoSYvvm9nD8QkS3l5/J8VGkc9tq', 'purple'),
('usuario2', '$2b$10$kDFQCAYYSZiO.l1NVl.YnuXvPcdoSYvvm9nD8QkS3l5/J8VGkc9tq', 'yellow'),
('usuario3', '$2b$10$kDFQCAYYSZiO.l1NVl.YnuXvPcdoSYvvm9nD8QkS3l5/J8VGkc9tq', 'pink')
ON DUPLICATE KEY UPDATE username=username;
