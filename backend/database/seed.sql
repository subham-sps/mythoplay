-- Seed data for MythoPlay
-- Insert default admin (password: admin123 - should be changed in production)
INSERT INTO admins (name, email, password_hash, role) VALUES 
('Super Admin', 'admin@mythoplay.com', '$2b$10$rQZ8K7.JX5X5X5X5X5X5XuE7kJ8K9L0M1N2O3P4Q5R6S7T8U9V0W1', 'admin');

-- Sample Quizzes
INSERT INTO quizzes (title, description, category, age_group, quiz_type, time_limit_seconds, is_exclusive, is_active) VALUES
('Ramayana Basics', 'Learn the basic story of Ramayana', 'ramayana', '5-7', 'multiple_choice', NULL, FALSE, TRUE),
('Ramayana Adventures', 'Test your knowledge of Ramayana characters', 'ramayana', '8-10', 'multiple_choice', NULL, FALSE, TRUE),
('Ramayana Master Quiz', 'Advanced Ramayana quiz with timer', 'ramayana', '11-14', 'timed', 300, FALSE, TRUE),
('Krishna the Butter Thief', 'Fun stories about baby Krishna', 'krishna_leela', '5-7', 'image_based', NULL, FALSE, TRUE),
('Mahabharata Heroes', 'Meet the heroes of Mahabharata', 'mahabharata', '8-10', 'multiple_choice', NULL, FALSE, TRUE),
('Ganesha Stories', 'Learn about Lord Ganesha', 'ganesha_stories', '5-7', 'image_based', NULL, FALSE, TRUE),
('Festival Fun', 'Know your Indian festivals', 'indian_festivals', '8-10', 'multiple_choice', NULL, FALSE, TRUE),
('Natkhat Gannu Special Quiz', 'Exclusive quiz for community members', 'krishna_leela', '8-10', 'timed', 240, TRUE, TRUE);

-- Sample Questions for Ramayana Basics (5-7 age group)
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
SELECT id, 'Who is the main hero of Ramayana?', 'Lord Rama', 'Lord Krishna', 'Lord Ganesha', 'Lord Shiva', 'A', 10, 1
FROM quizzes WHERE title = 'Ramayana Basics';

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
SELECT id, 'Who is Lord Rama''s wife?', 'Radha', 'Sita', 'Parvati', 'Lakshmi', 'B', 10, 2
FROM quizzes WHERE title = 'Ramayana Basics';

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
SELECT id, 'Who is Rama''s loyal brother?', 'Bharat', 'Lakshmana', 'Shatrughan', 'All of them', 'D', 10, 3
FROM quizzes WHERE title = 'Ramayana Basics';

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
SELECT id, 'Who is the monkey god who helped Rama?', 'Sugriva', 'Hanuman', 'Angad', 'Jambavan', 'B', 10, 4
FROM quizzes WHERE title = 'Ramayana Basics';

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
SELECT id, 'What color is Lord Rama usually shown in?', 'Yellow', 'Blue', 'Green', 'Red', 'B', 10, 5
FROM quizzes WHERE title = 'Ramayana Basics';

-- Sample Questions for Krishna the Butter Thief
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
SELECT id, 'What did baby Krishna love to steal?', 'Fruits', 'Butter', 'Sweets', 'Milk', 'B', 10, 1
FROM quizzes WHERE title = 'Krishna the Butter Thief';

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
SELECT id, 'Who is Krishna''s mother?', 'Yashoda', 'Devaki', 'Both are his mothers', 'Radha', 'C', 10, 2
FROM quizzes WHERE title = 'Krishna the Butter Thief';

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
SELECT id, 'What instrument does Krishna play?', 'Tabla', 'Sitar', 'Flute', 'Harmonium', 'C', 10, 3
FROM quizzes WHERE title = 'Krishna the Butter Thief';

-- Sample Questions for Ganesha Stories
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
SELECT id, 'What animal head does Lord Ganesha have?', 'Lion', 'Elephant', 'Tiger', 'Monkey', 'B', 10, 1
FROM quizzes WHERE title = 'Ganesha Stories';

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
SELECT id, 'What is Ganesha''s favorite sweet?', 'Ladoo', 'Modak', 'Jalebi', 'Gulab Jamun', 'B', 10, 2
FROM quizzes WHERE title = 'Ganesha Stories';

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
SELECT id, 'What is Ganesha''s vehicle (vahana)?', 'Lion', 'Peacock', 'Mouse', 'Bull', 'C', 10, 3
FROM quizzes WHERE title = 'Ganesha Stories';

-- Sample Questions for Festival Fun
INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
SELECT id, 'Which festival is called the Festival of Lights?', 'Holi', 'Diwali', 'Dussehra', 'Navratri', 'B', 10, 1
FROM quizzes WHERE title = 'Festival Fun';

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
SELECT id, 'Which festival celebrates Lord Rama''s return to Ayodhya?', 'Holi', 'Diwali', 'Janmashtami', 'Raksha Bandhan', 'B', 10, 2
FROM quizzes WHERE title = 'Festival Fun';

INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
SELECT id, 'Holi is the festival of?', 'Lights', 'Colors', 'Sweets', 'Flowers', 'B', 10, 3
FROM quizzes WHERE title = 'Festival Fun';

