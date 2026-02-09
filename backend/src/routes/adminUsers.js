const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// All routes require admin authentication
router.use(authenticateToken, requireAdmin);

// ==================== USER MANAGEMENT ====================

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { ageGroup, natkhatMember, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT u.*, 
             (SELECT COUNT(*) FROM quiz_scores WHERE user_id = u.id) as quizzes_taken,
             (SELECT SUM(score) FROM quiz_scores WHERE user_id = u.id) as total_earned
      FROM users u
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (ageGroup) {
      query += ` AND u.age_group = $${paramIndex}`;
      params.push(ageGroup);
      paramIndex++;
    }

    if (natkhatMember === 'true') {
      query += ` AND u.is_natkhat_gannu_member = true`;
    }

    query += ` ORDER BY u.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);
    const countResult = await db.query('SELECT COUNT(*) FROM users');

    res.json({
      users: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user details
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const scoresResult = await db.query(`
      SELECT qs.*, q.title, q.category
      FROM quiz_scores qs
      JOIN quizzes q ON qs.quiz_id = q.id
      WHERE qs.user_id = $1
      ORDER BY qs.completed_at DESC
      LIMIT 20
    `, [id]);

    res.json({
      user: userResult.rows[0],
      recentScores: scoresResult.rows,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user Natkhat Gannu membership
router.patch('/users/:id/membership', async (req, res) => {
  try {
    const { id } = req.params;
    const { isNatkhatGannuMember } = req.body;

    const result = await db.query(`
      UPDATE users 
      SET is_natkhat_gannu_member = $1
      WHERE id = $2
      RETURNING *
    `, [isNatkhatGannuMember, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0], message: 'Membership status updated' });
  } catch (error) {
    console.error('Update membership error:', error);
    res.status(500).json({ error: 'Failed to update membership' });
  }
});

// Update user gift eligibility
router.patch('/users/:id/gift-eligibility', async (req, res) => {
  try {
    const { id } = req.params;
    const { isEligibleForGifts } = req.body;

    const result = await db.query(`
      UPDATE users 
      SET is_eligible_for_gifts = $1
      WHERE id = $2
      RETURNING *
    `, [isEligibleForGifts, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0], message: 'Gift eligibility updated' });
  } catch (error) {
    console.error('Update gift eligibility error:', error);
    res.status(500).json({ error: 'Failed to update gift eligibility' });
  }
});

// ==================== ADMIN MANAGEMENT ====================

// Create new admin (super admin only)
router.post('/admins', [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const existingAdmin = await db.query('SELECT id FROM admins WHERE email = $1', [email]);
    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(`
      INSERT INTO admins (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, role, created_at
    `, [name, email, passwordHash]);

    res.status(201).json({ admin: result.rows[0] });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

// Get dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE is_natkhat_gannu_member = true) as natkhat_members,
        (SELECT COUNT(*) FROM quizzes WHERE is_active = true) as active_quizzes,
        (SELECT COUNT(*) FROM quiz_scores) as total_attempts,
        (SELECT COUNT(*) FROM quiz_scores WHERE completed_at >= CURRENT_DATE) as today_attempts
    `);

    res.json({ stats: stats.rows[0] });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;

