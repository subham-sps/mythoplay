const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.*,
        (SELECT COUNT(*) FROM quiz_scores WHERE user_id = u.id) as quizzes_completed,
        (SELECT COUNT(DISTINCT quiz_id) FROM quiz_scores WHERE user_id = u.id) as unique_quizzes
      FROM users u
      WHERE u.id = $1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get badges based on achievements
    const badges = [];
    if (user.total_score >= 100) badges.push({ name: 'Quiz Beginner', emoji: '🌱' });
    if (user.total_score >= 500) badges.push({ name: 'Quiz Explorer', emoji: '🔍' });
    if (user.total_score >= 1000) badges.push({ name: 'Quiz Champion', emoji: '🏆' });
    if (user.quizzes_completed >= 10) badges.push({ name: 'Quiz Lover', emoji: '❤️' });
    if (user.is_natkhat_gannu_member) badges.push({ name: 'Natkhat Gannu Member', emoji: '⭐' });
    if (user.is_eligible_for_gifts) badges.push({ name: 'Gift Eligible', emoji: '🎁' });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        ageGroup: user.age_group,
        totalScore: user.total_score,
        quizzesCompleted: parseInt(user.quizzes_completed),
        uniqueQuizzes: parseInt(user.unique_quizzes),
        isNatkhatGannuMember: user.is_natkhat_gannu_member,
        isEligibleForGifts: user.is_eligible_for_gifts,
        badges,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user age group
router.patch('/profile/age-group', authenticateToken, requireUser, [
  body('ageGroup').isIn(['5-7', '8-10', '11-14']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ageGroup } = req.body;

    const result = await db.query(`
      UPDATE users 
      SET age_group = $1
      WHERE id = $2
      RETURNING *
    `, [ageGroup, req.user.id]);

    res.json({
      success: true,
      user: result.rows[0],
      message: 'Age group updated successfully',
    });
  } catch (error) {
    console.error('Update age group error:', error);
    res.status(500).json({ error: 'Failed to update age group' });
  }
});

// Get user achievements/progress
router.get('/achievements', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get category-wise progress
    const categoryProgress = await db.query(`
      SELECT 
        q.category,
        COUNT(DISTINCT qs.quiz_id) as quizzes_completed,
        SUM(qs.score) as total_score,
        AVG(qs.score) as avg_score
      FROM quiz_scores qs
      JOIN quizzes q ON qs.quiz_id = q.id
      WHERE qs.user_id = $1
      GROUP BY q.category
    `, [userId]);

    // Get recent activity
    const recentActivity = await db.query(`
      SELECT 
        qs.score,
        qs.correct_answers,
        qs.total_questions,
        qs.completed_at,
        q.title,
        q.category
      FROM quiz_scores qs
      JOIN quizzes q ON qs.quiz_id = q.id
      WHERE qs.user_id = $1
      ORDER BY qs.completed_at DESC
      LIMIT 10
    `, [userId]);

    // Calculate streaks (days with activity)
    const streakData = await db.query(`
      SELECT DATE(completed_at) as activity_date
      FROM quiz_scores
      WHERE user_id = $1
      GROUP BY DATE(completed_at)
      ORDER BY activity_date DESC
      LIMIT 30
    `, [userId]);

    res.json({
      categoryProgress: categoryProgress.rows,
      recentActivity: recentActivity.rows,
      activityDates: streakData.rows.map(r => r.activity_date),
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

module.exports = router;

