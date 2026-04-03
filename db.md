```sql
-- Table for storing meal calendar entries
CREATE TABLE meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    meal_name TEXT NOT NULL
);

-- Table for storing grocery list items
CREATE TABLE grocery_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT 1
);

-- Table for storing household tasks and their completion status
CREATE TABLE household_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_name TEXT NOT NULL,
    due_date DATE NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT 0
);
```