-- Schedules seed data (example data)
-- Run after db/init.sql and users are created

-- Get user IDs
SET @user1_id = (SELECT id FROM users WHERE LOWER(username) = 'usuario1');
SET @user2_id = (SELECT id FROM users WHERE LOWER(username) = 'usuario2');
SET @user3_id = (SELECT id FROM users WHERE LOWER(username) = 'usuario3');

-- =====================
-- USUARIO1 - Clases online
-- =====================

-- Miércoles 19:00-21:00 Clase virtual
INSERT INTO schedules (title, day_of_week, start_time, end_time) 
VALUES ('Clase online', 'miercoles', '19:00:00', '21:00:00');
INSERT INTO schedule_users (schedule_id, user_id) VALUES (LAST_INSERT_ID(), @user1_id);

-- Viernes 17:00-20:00 Clase presencial
INSERT INTO schedules (title, day_of_week, start_time, end_time) 
VALUES ('Clase presencial', 'viernes', '17:00:00', '20:00:00');
INSERT INTO schedule_users (schedule_id, user_id) VALUES (LAST_INSERT_ID(), @user1_id);

-- =====================
-- USUARIO3 - Actividades
-- =====================

-- Lunes a Viernes 14:00-18:00
INSERT INTO schedules (title, day_of_week, start_time, end_time) 
VALUES ('Actividad diaria', 'lunes', '14:00:00', '18:00:00');
INSERT INTO schedule_users (schedule_id, user_id) VALUES (LAST_INSERT_ID(), @user3_id);

INSERT INTO schedules (title, day_of_week, start_time, end_time) 
VALUES ('Actividad diaria', 'martes', '14:00:00', '18:00:00');
INSERT INTO schedule_users (schedule_id, user_id) VALUES (LAST_INSERT_ID(), @user3_id);

INSERT INTO schedules (title, day_of_week, start_time, end_time) 
VALUES ('Actividad diaria', 'miercoles', '14:00:00', '18:00:00');
INSERT INTO schedule_users (schedule_id, user_id) VALUES (LAST_INSERT_ID(), @user3_id);

INSERT INTO schedules (title, day_of_week, start_time, end_time) 
VALUES ('Actividad diaria', 'jueves', '14:00:00', '18:00:00');
INSERT INTO schedule_users (schedule_id, user_id) VALUES (LAST_INSERT_ID(), @user3_id);

INSERT INTO schedules (title, day_of_week, start_time, end_time) 
VALUES ('Actividad diaria', 'viernes', '14:00:00', '18:00:00');
INSERT INTO schedule_users (schedule_id, user_id) VALUES (LAST_INSERT_ID(), @user3_id);

-- =====================
-- USUARIO2 - Cursos
-- =====================

-- Lunes 18:00-21:00
INSERT INTO schedules (title, day_of_week, start_time, end_time) 
VALUES ('Curso nocturno', 'lunes', '18:00:00', '21:00:00');
INSERT INTO schedule_users (schedule_id, user_id) VALUES (LAST_INSERT_ID(), @user2_id);

-- Martes 10:00-12:00
INSERT INTO schedules (title, day_of_week, start_time, end_time) 
VALUES ('Taller mañana', 'martes', '10:00:00', '12:00:00');
INSERT INTO schedule_users (schedule_id, user_id) VALUES (LAST_INSERT_ID(), @user2_id);

-- Miércoles 15:00-17:00
INSERT INTO schedules (title, day_of_week, start_time, end_time) 
VALUES ('Práctica', 'miercoles', '15:00:00', '17:00:00');
INSERT INTO schedule_users (schedule_id, user_id) VALUES (LAST_INSERT_ID(), @user2_id);

-- Jueves 10:00-13:00
INSERT INTO schedules (title, day_of_week, start_time, end_time) 
VALUES ('Seminario', 'jueves', '10:00:00', '13:00:00');
INSERT INTO schedule_users (schedule_id, user_id) VALUES (LAST_INSERT_ID(), @user2_id);

-- Viernes 16:00-19:00
INSERT INTO schedules (title, day_of_week, start_time, end_time) 
VALUES ('Reunión semanal', 'viernes', '16:00:00', '19:00:00');
INSERT INTO schedule_users (schedule_id, user_id) VALUES (LAST_INSERT_ID(), @user2_id);

SELECT 'Schedules seed complete!' as status;
