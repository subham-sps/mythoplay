const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, requireUser, requireNatkhatGannuMember } = require('../middleware/auth');
const { quizSubmissionLimiter } = require('../middleware/rateLimiter');
const { body, validationResult } = require('express-validator');

// Get all available quizzes (filtered by user's age group)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, ageGroup } = req.query;
    const userAgeGroup = ageGroup || req.user.ageGroup;
    const isNatkhatMember = req.user.isNatkhatGannuMember;

    let query = `
      SELECT id, title, description, category, age_group, quiz_type, time_limit_seconds, is_exclusive,
             (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = quizzes.id) as question_count
      FROM quizzes 
      WHERE is_active = true AND age_group = $1
    `;
    const params = [userAgeGroup];
    let paramIndex = 2;

    // Filter exclusive quizzes for non-members
    if (!isNatkhatMember) {
      query += ` AND is_exclusive = false`;
    }

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await db.query(query, params);

    res.json({
      quizzes: result.rows,
      userAgeGroup,
      isNatkhatGannuMember: isNatkhatMember,
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get quiz by ID with questions
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const quizResult = await db.query('SELECT * FROM quizzes WHERE id = $1 AND is_active = true', [id]);
    
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quiz = quizResult.rows[0];

    // Check exclusive access
    if (quiz.is_exclusive && !req.user.isNatkhatGannuMember) {
      return res.status(403).json({
        error: 'This quiz is exclusive to Natkhat Gannu community members',
        code: 'NATKHAT_GANNU_REQUIRED',
      });
    }

    const questionsResult = await db.query(
      `SELECT id, question_text, question_image, option_a, option_b, option_c, option_d, points, order_index
       FROM quiz_questions WHERE quiz_id = $1 ORDER BY order_index`,
      [id]
    );

    res.json({
      quiz: {
        ...quiz,
        questions: questionsResult.rows,
      },
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Submit quiz answers
router.post('/:id/submit', authenticateToken, requireUser, quizSubmissionLimiter, [
  body('answers').isArray(),
  body('timeTaken').optional().isInt({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user.id;

    // Get quiz questions with correct answers
    const questionsResult = await db.query(
      'SELECT id, correct_option, points FROM quiz_questions WHERE quiz_id = $1 ORDER BY order_index',
      [id]
    );

    const questions = questionsResult.rows;
    let score = 0;
    let correctAnswers = 0;

    // Calculate score
    questions.forEach((question, index) => {
      if (answers[index] && answers[index].toUpperCase() === question.correct_option) {
        score += question.points;
        correctAnswers++;
      }
    });

    // Save score
    await db.query(
      `INSERT INTO quiz_scores (user_id, quiz_id, score, total_questions, correct_answers, time_taken_seconds)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, id, score, questions.length, correctAnswers, timeTaken || null]
    );

    // Update user's total score
    await db.query(
      'UPDATE users SET total_score = total_score + $1 WHERE id = $2',
      [score, userId]
    );

    res.json({
      success: true,
      score,
      totalQuestions: questions.length,
      correctAnswers,
      percentage: Math.round((correctAnswers / questions.length) * 100),
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Get user's quiz history
router.get('/history/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT qs.*, q.title, q.category, q.age_group
       FROM quiz_scores qs
       JOIN quizzes q ON qs.quiz_id = q.id
       WHERE qs.user_id = $1
       ORDER BY qs.completed_at DESC
       LIMIT 50`,
      [req.user.id]
    );

    res.json({ history: result.rows });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz history' });
  }
});

module.exports = router;

