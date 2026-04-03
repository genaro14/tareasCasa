-- Seed data for Tareas Casa
-- This file contains example data - edit as needed!

-- =============================================
-- MEALS - Weekly menu (almuerzo y cena)
-- =============================================
-- Days: 0=Monday, 1=Tuesday, etc.

INSERT INTO meals (date, meal_type, meal_name) VALUES
-- Lunes
(DATE_ADD(CURDATE(), INTERVAL (0 - WEEKDAY(CURDATE())) DAY), 'almuerzo', 'Carne o pollo con verduras'),
(DATE_ADD(CURDATE(), INTERVAL (0 - WEEKDAY(CURDATE())) DAY), 'cena', 'Papas'),
-- Martes
(DATE_ADD(CURDATE(), INTERVAL (1 - WEEKDAY(CURDATE())) DAY), 'almuerzo', 'Milanesas c/ tomatito'),
(DATE_ADD(CURDATE(), INTERVAL (1 - WEEKDAY(CURDATE())) DAY), 'cena', 'Sandwich pollo c/ palta'),
-- Miércoles (libre)
(DATE_ADD(CURDATE(), INTERVAL (2 - WEEKDAY(CURDATE())) DAY), 'almuerzo', 'Libre'),
(DATE_ADD(CURDATE(), INTERVAL (2 - WEEKDAY(CURDATE())) DAY), 'cena', 'Libre'),
-- Jueves
(DATE_ADD(CURDATE(), INTERVAL (3 - WEEKDAY(CURDATE())) DAY), 'almuerzo', 'Ravioles o ñoquis'),
(DATE_ADD(CURDATE(), INTERVAL (3 - WEEKDAY(CURDATE())) DAY), 'cena', 'Empanadas'),
-- Viernes
(DATE_ADD(CURDATE(), INTERVAL (4 - WEEKDAY(CURDATE())) DAY), 'almuerzo', 'Milanesas c/ puré'),
(DATE_ADD(CURDATE(), INTERVAL (4 - WEEKDAY(CURDATE())) DAY), 'cena', 'Pizza'),
-- Sábado (libre)
(DATE_ADD(CURDATE(), INTERVAL (5 - WEEKDAY(CURDATE())) DAY), 'almuerzo', 'Libre'),
(DATE_ADD(CURDATE(), INTERVAL (5 - WEEKDAY(CURDATE())) DAY), 'cena', 'Libre'),
-- Domingo (libre)
(DATE_ADD(CURDATE(), INTERVAL (6 - WEEKDAY(CURDATE())) DAY), 'almuerzo', 'Libre'),
(DATE_ADD(CURDATE(), INTERVAL (6 - WEEKDAY(CURDATE())) DAY), 'cena', 'Libre')
ON DUPLICATE KEY UPDATE meal_name = VALUES(meal_name);

-- =============================================
-- GROCERY ITEMS - Shopping list
-- =============================================

INSERT INTO grocery_items (name, is_active) VALUES
-- Limpieza
('Servilletas', TRUE),
('Desinfectante', TRUE),
('Esponja cocina', TRUE),
('Suavizante', TRUE),
-- Congelados/Preparados
('Tapas empanadas', TRUE),
('Milanesas', TRUE),
('Pascualina', TRUE),
('Ñoquis', TRUE),
('Ravioles', TRUE),
-- Frutas y Verduras
('Limón', TRUE),
('Bananas', TRUE),
('Verduras de estación', TRUE),
('Palta', TRUE),
('Pimiento', TRUE),
('Cebolla', TRUE),
('Brócoli', TRUE),
-- Almacén
('Yerba (Alianza)', TRUE),
('Semillitas', TRUE),
('Chips chocolate', TRUE),
('Puré de tomate', TRUE),
('Aceite', TRUE),
('Harina', TRUE),
('Fósforos', TRUE),
-- Lácteos
('Casancrem', TRUE),
('Huevos', TRUE),
('Leche', TRUE),
-- Higiene
('Pasta de dientes', TRUE)
ON DUPLICATE KEY UPDATE is_active = VALUES(is_active);

-- =============================================
-- HOUSEHOLD TASKS - Chores examples
-- =============================================

INSERT INTO household_tasks (task_name, due_date, is_completed) VALUES
('Limpiar el baño', DATE_ADD(CURDATE(), INTERVAL (0 - WEEKDAY(CURDATE())) DAY), FALSE),
('Pasar la aspiradora', DATE_ADD(CURDATE(), INTERVAL (1 - WEEKDAY(CURDATE())) DAY), FALSE),
('Lavar la ropa', DATE_ADD(CURDATE(), INTERVAL (2 - WEEKDAY(CURDATE())) DAY), FALSE),
('Planchar', DATE_ADD(CURDATE(), INTERVAL (3 - WEEKDAY(CURDATE())) DAY), FALSE),
('Sacar la basura', DATE_ADD(CURDATE(), INTERVAL (4 - WEEKDAY(CURDATE())) DAY), FALSE),
('Limpiar la cocina', DATE_ADD(CURDATE(), INTERVAL (5 - WEEKDAY(CURDATE())) DAY), FALSE),
('Regar las plantas', DATE_ADD(CURDATE(), INTERVAL (6 - WEEKDAY(CURDATE())) DAY), FALSE);
