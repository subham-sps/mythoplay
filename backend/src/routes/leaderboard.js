const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get leaderboard with filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { period = 'weekly', category, ageGroup, limit = 20 } = req.query;

    let query = `
      SELECT 
        u.id,
        u.name,
        u.avatar,
        u.age_group,
        u.is_natkhat_gannu_member,
        SUM(qs.score) as total_score,
        COUNT(qs.id) as quizzes_completed,
        MAX(qs.completed_at) as last_activity
      FROM users u
      JOIN quiz_scores qs ON u.id = qs.user_id
      JOIN quizzes q ON qs.quiz_id = q.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    // Period filter
    if (period === 'weekly') {
      query += ` AND qs.completed_at >= CURRENT_DATE - INTERVAL '7 days'`;
    } else if (period === 'monthly') {
      query += ` AND qs.completed_at >= CURRENT_DATE - INTERVAL '30 days'`;
    }

    // Category filter
    if (category) {
      query += ` AND q.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // Age group filter
    if (ageGroup) {
      query += ` AND u.age_group = $${paramIndex}`;
      params.push(ageGroup);
      paramIndex++;
    }

    query += `
      GROUP BY u.id, u.name, u.avatar, u.age_group, u.is_natkhat_gannu_member
      ORDER BY total_score DESC
      LIMIT $${paramIndex}
    `;
    params.push(parseInt(limit));

    const result = await db.query(query, params);

    // Add rank to each entry
    const leaderboard = result.rows.map((entry, index) => ({
      rank: index + 1,
      ...entry,
      isTopThree: index < 3,
    }));

    // Get current user's rank if not in top list
    const currentUserInList = leaderboard.find(entry => entry.id === req.user.id);
    let currentUserRank = null;

    if (!currentUserInList && req.user.role === 'user') {
      const userRankQuery = `
        WITH ranked_users AS (
          SELECT 
            u.id,
            SUM(qs.score) as total_score,
            RANK() OVER (ORDER BY SUM(qs.score) DESC) as rank
          FROM users u
          JOIN quiz_scores qs ON u.id = qs.user_id
          JOIN quizzes q ON qs.quiz_id = q.id
          WHERE qs.completed_at >= CURRENT_DATE - INTERVAL '${period === 'weekly' ? '7' : '30'} days'
          ${category ? `AND q.category = '${category}'` : ''}
          ${ageGroup ? `AND u.age_group = '${ageGroup}'` : ''}
          GROUP BY u.id
        )
        SELECT rank, total_score FROM ranked_users WHERE id = $1
      `;
      
      const userRankResult = await db.query(userRankQuery, [req.user.id]);
      if (userRankResult.rows.length > 0) {
        currentUserRank = userRankResult.rows[0];
      }
    }

    res.json({
      leaderboard,
      period,
      category: category || 'all',
      ageGroup: ageGroup || 'all',
      currentUserRank,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get available categories for filtering
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { value: 'ramayana', label: 'Ramayana', emoji: '🏹' },
      { value: 'mahabharata', label: 'Mahabharata', emoji: '⚔️' },
      { value: 'krishna_leela', label: 'Krishna Leela', emoji: '🦚' },
      { value: 'ganesha_stories', label: 'Ganesha Stories', emoji: '🐘' },
      { value: 'indian_festivals', label: 'Indian Festivals', emoji: '🪔' },
    ];

    const ageGroups = [
      { value: '5-7', label: 'Little Stars (5-7)', emoji: '⭐' },
      { value: '8-10', label: 'Rising Champs (8-10)', emoji: '🌟' },
      { value: '11-14', label: 'Quiz Masters (11-14)', emoji: '🏆' },
    ];

    res.json({ categories, ageGroups });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get personal stats
router.get('/my-stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total_quizzes,
        SUM(score) as total_score,
        SUM(correct_answers) as total_correct,
        AVG(score) as avg_score,
        MAX(score) as best_score
      FROM quiz_scores
      WHERE user_id = $1
    `, [userId]);

    const categoryStatsResult = await db.query(`
      SELECT 
        q.category,
        COUNT(*) as quizzes_completed,
        SUM(qs.score) as category_score
      FROM quiz_scores qs
      JOIN quizzes q ON qs.quiz_id = q.id
      WHERE qs.user_id = $1
      GROUP BY q.category
    `, [userId]);

    res.json({
      overall: statsResult.rows[0],
      byCategory: categoryStatsResult.rows,
    });
  } catch (error) {
    console.error('Get my stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;

