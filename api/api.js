
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Placeholder for a generic SQL database connection
// In a real application, you would configure your specific database (e.g., PostgreSQL, MySQL)
// For this example, we'll simulate database operations with in-memory arrays.
const meals = [];
const groceryItems = [];
const householdTasks = [];

// Helper to generate unique IDs
let nextMealId = 1;
let nextGroceryItemId = 1;
let nextTaskId = 1;

// --- MEALS CRUD ---

// Create a meal
app.post('/meals', (req, res) => {
    const { date, meal_name } = req.body;
    if (!date || !meal_name) {
        return res.status(400).send('Date and meal_name are required.');
    }
    const newMeal = { id: nextMealId++, date, meal_name };
    meals.push(newMeal);
    res.status(201).json(newMeal);
});

// Get all meals
app.get('/meals', (req, res) => {
    res.json(meals);
});

// Get a single meal by ID
app.get('/meals/:id', (req, res) => {
    const meal = meals.find(m => m.id === parseInt(req.params.id));
    if (!meal) {
        return res.status(404).send('Meal not found.');
    }
    res.json(meal);
});

// Update a meal
app.put('/meals/:id', (req, res) => {
    const meal = meals.find(m => m.id === parseInt(req.params.id));
    if (!meal) {
        return res.status(404).send('Meal not found.');
    }
    const { date, meal_name } = req.body;
    if (date) meal.date = date;
    if (meal_name) meal.meal_name = meal_name;
    res.json(meal);
});

// Delete a meal
app.delete('/meals/:id', (req, res) => {
    const index = meals.findIndex(m => m.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).send('Meal not found.');
    }
    meals.splice(index, 1);
    res.status(204).send();
});

// --- GROCERY ITEMS CRUD ---

// Create a grocery item
app.post('/grocery-items', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send('Name is required.');
    }
    if (groceryItems.some(item => item.name === name)) {
        return res.status(409).send('Grocery item with this name already exists.');
    }
    const newItem = { id: nextGroceryItemId++, name, is_active: true };
    groceryItems.push(newItem);
    res.status(201).json(newItem);
});

// Get all grocery items
app.get('/grocery-items', (req, res) => {
    res.json(groceryItems);
});

// Get a single grocery item by ID
app.get('/grocery-items/:id', (req, res) => {
    const item = groceryItems.find(i => i.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).send('Grocery item not found.');
    }
    res.json(item);
});

// Update a grocery item
app.put('/grocery-items/:id', (req, res) => {
    const item = groceryItems.find(i => i.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).send('Grocery item not found.');
    }
    const { name, is_active } = req.body;
    if (name) item.name = name;
    if (typeof is_active === 'boolean') item.is_active = is_active;
    res.json(item);
});

// Delete a grocery item
app.delete('/grocery-items/:id', (req, res) => {
    const index = groceryItems.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).send('Grocery item not found.');
    }
    groceryItems.splice(index, 1);
    res.status(204).send();
});

// --- HOUSEHOLD TASKS CRUD ---

// Create a household task
app.post('/household-tasks', (req, res) => {
    const { task_name, due_date } = req.body;
    if (!task_name || !due_date) {
        return res.status(400).send('Task name and due date are required.');
    }
    const newTask = { id: nextTaskId++, task_name, due_date, is_completed: false };
    householdTasks.push(newTask);
    res.status(201).json(newTask);
});

// Get all household tasks
app.get('/household-tasks', (req, res) => {
    res.json(householdTasks);
});

// Get a single household task by ID
app.get('/household-tasks/:id', (req, res) => {
    const task = householdTasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).send('Household task not found.');
    }
    res.json(task);
});

// Update a household task
app.put('/household-tasks/:id', (req, res) => {
    const task = householdTasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).send('Household task not found.');
    }
    const { task_name, due_date, is_completed } = req.body;
    if (task_name) task.task_name = task_name;
    if (due_date) task.due_date = due_date;
    if (typeof is_completed === 'boolean') task.is_completed = is_completed;
    res.json(task);
});

// Delete a household task
app.delete('/household-tasks/:id', (req, res) => {
    const index = householdTasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).send('Household task not found.');
    }
    householdTasks.splice(index, 1);
    res.status(204).send();
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
