const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// ==================== QUIZ MANAGEMENT ====================

// Get all quizzes (admin view)
router.get('/quizzes', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT q.*, 
             (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as question_count,
             a.name as created_by_name
      FROM quizzes q
      LEFT JOIN admins a ON q.created_by = a.id
      ORDER BY q.created_at DESC
    `);
    res.json({ quizzes: result.rows });
  } catch (error) {
    console.error('Admin get quizzes error:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Create quiz
router.post('/quizzes', [
  body('title').trim().notEmpty(),
  body('category').isIn(['ramayana', 'mahabharata', 'krishna_leela', 'ganesha_stories', 'indian_festivals']),
  body('ageGroup').isIn(['5-7', '8-10', '11-14']),
  body('quizType').isIn(['multiple_choice', 'image_based', 'timed']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, ageGroup, quizType, timeLimitSeconds, isExclusive } = req.body;

    const result = await db.query(`
      INSERT INTO quizzes (title, description, category, age_group, quiz_type, time_limit_seconds, is_exclusive, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [title, description, category, ageGroup, quizType, timeLimitSeconds || null, isExclusive || false, req.user.id]);

    res.status(201).json({ quiz: result.rows[0] });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Update quiz
router.put('/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, ageGroup, quizType, timeLimitSeconds, isExclusive, isActive } = req.body;

    const result = await db.query(`
      UPDATE quizzes 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          category = COALESCE($3, category),
          age_group = COALESCE($4, age_group),
          quiz_type = COALESCE($5, quiz_type),
          time_limit_seconds = COALESCE($6, time_limit_seconds),
          is_exclusive = COALESCE($7, is_exclusive),
          is_active = COALESCE($8, is_active)
      WHERE id = $9
      RETURNING *
    `, [title, description, category, ageGroup, quizType, timeLimitSeconds, isExclusive, isActive, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ quiz: result.rows[0] });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

// Delete quiz
router.delete('/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM quizzes WHERE id = $1', [id]);
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

// ==================== QUESTION MANAGEMENT ====================

// Get questions for a quiz
router.get('/quizzes/:quizId/questions', async (req, res) => {
  try {
    const { quizId } = req.params;
    const result = await db.query(
      'SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY order_index',
      [quizId]
    );
    res.json({ questions: result.rows });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Add question to quiz
router.post('/quizzes/:quizId/questions', [
  body('questionText').trim().notEmpty(),
  body('optionA').trim().notEmpty(),
  body('optionB').trim().notEmpty(),
  body('optionC').trim().notEmpty(),
  body('optionD').trim().notEmpty(),
  body('correctOption').isIn(['A', 'B', 'C', 'D']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quizId } = req.params;
    const { questionText, questionImage, optionA, optionB, optionC, optionD, correctOption, points } = req.body;

    // Get next order index
    const orderResult = await db.query(
      'SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM quiz_questions WHERE quiz_id = $1',
      [quizId]
    );

    const result = await db.query(`
      INSERT INTO quiz_questions (quiz_id, question_text, question_image, option_a, option_b, option_c, option_d, correct_option, points, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [quizId, questionText, questionImage, optionA, optionB, optionC, optionD, correctOption, points || 10, orderResult.rows[0].next_order]);

    res.status(201).json({ question: result.rows[0] });
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

module.exports = router;

