const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

async function initializeDatabase() {
  const client = await pool.connect();

  try {
    console.log('🔧 Initializing MythoPlay database...');

    // Read and execute schema
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📝 Creating tables...');
    await client.query(schema);

    // Create default admin with hashed password
    console.log('👤 Creating default admin...');
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    await client.query(`
      INSERT INTO admins (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['Super Admin', 'admin@mythoplay.com', passwordHash, 'admin']);

    // Read and execute seed data
    const seedPath = path.join(__dirname, '../../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('🌱 Seeding sample data...');
      // We'll manually insert seed data since the SQL has the old hash
      
      // Sample Quizzes
      const quizzes = [
        { title: 'Ramayana Basics', description: 'Learn the basic story of Ramayana', category: 'ramayana', ageGroup: '5-7', quizType: 'multiple_choice' },
        { title: 'Ramayana Adventures', description: 'Test your knowledge of Ramayana characters', category: 'ramayana', ageGroup: '8-10', quizType: 'multiple_choice' },
        { title: 'Ramayana Master Quiz', description: 'Advanced Ramayana quiz with timer', category: 'ramayana', ageGroup: '11-14', quizType: 'timed', timeLimit: 300 },
        { title: 'Krishna the Butter Thief', description: 'Fun stories about baby Krishna', category: 'krishna_leela', ageGroup: '5-7', quizType: 'image_based' },
        { title: 'Mahabharata Heroes', description: 'Meet the heroes of Mahabharata', category: 'mahabharata', ageGroup: '8-10', quizType: 'multiple_choice' },
        { title: 'Ganesha Stories', description: 'Learn about Lord Ganesha', category: 'ganesha_stories', ageGroup: '5-7', quizType: 'image_based' },
        { title: 'Festival Fun', description: 'Know your Indian festivals', category: 'indian_festivals', ageGroup: '8-10', quizType: 'multiple_choice' },
      ];

      for (const quiz of quizzes) {
        await client.query(`
          INSERT INTO quizzes (title, description, category, age_group, quiz_type, time_limit_seconds)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, [quiz.title, quiz.description, quiz.category, quiz.ageGroup, quiz.quizType, quiz.timeLimit || null]);
      }

      // Add questions for Ramayana Basics
      const ramaQuiz = await client.query("SELECT id FROM quizzes WHERE title = 'Ramayana Basics' LIMIT 1");
      if (ramaQuiz.rows.length > 0) {
        const quizId = ramaQuiz.rows[0].id;
        const questions = [
          { text: 'Who is the main hero of Ramayana?', a: 'Lord Rama', b: 'Lord Krishna', c: 'Lord Ganesha', d: 'Lord Shiva', correct: 'A', order: 1 },
          { text: "Who is Lord Rama's wife?", a: 'Radha', b: 'Sita', c: 'Parvati', d: 'Lakshmi', correct: 'B', order: 2 },
          { text: "Who is Rama's loyal brother?", a: 'Bharat', b: 'Lakshmana', c: 'Shatrughan', d: 'All of them', correct: 'D', order: 3 },
          { text: 'Who is the monkey god who helped Rama?', a: 'Sugriva', b: 'Hanuman', c: 'Angad', d: 'Jambavan', correct: 'B', order: 4 },
          { text: 'What color is Lord Rama usually shown in?', a: 'Yellow', b: 'Blue', c: 'Green', d: 'Red', correct: 'B', order: 5 },
        ];

        for (const q of questions) {
          await client.query(`
            INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 10, $8)
            ON CONFLICT DO NOTHING
          `, [quizId, q.text, q.a, q.b, q.c, q.d, q.correct, q.order]);
        }
      }

      // Add questions for Ganesha Stories
      const ganeshaQuiz = await client.query("SELECT id FROM quizzes WHERE title = 'Ganesha Stories' LIMIT 1");
      if (ganeshaQuiz.rows.length > 0) {
        const quizId = ganeshaQuiz.rows[0].id;
        const questions = [
          { text: 'What animal head does Lord Ganesha have?', a: 'Lion', b: 'Elephant', c: 'Tiger', d: 'Monkey', correct: 'B', order: 1 },
          { text: "What is Ganesha's favorite sweet?", a: 'Ladoo', b: 'Modak', c: 'Jalebi', d: 'Gulab Jamun', correct: 'B', order: 2 },
          { text: "What is Ganesha's vehicle (vahana)?", a: 'Lion', b: 'Peacock', c: 'Mouse', d: 'Bull', correct: 'C', order: 3 },
        ];

        for (const q of questions) {
          await client.query(`
            INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, order_index)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 10, $8)
            ON CONFLICT DO NOTHING
          `, [quizId, q.text, q.a, q.b, q.c, q.d, q.correct, q.order]);
        }
      }
    }

    console.log('✅ Database initialization complete!');
    console.log('📧 Default admin: admin@mythoplay.com / admin123');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

initializeDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

