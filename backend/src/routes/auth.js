const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { generateUserToken, generateAdminToken, authenticateToken } = require('../middleware/auth');
const { authLimiter, adminLoginLimiter } = require('../middleware/rateLimiter');
const { body, validationResult } = require('express-validator');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth login/signup for users
router.post('/google', authLimiter, async (req, res) => {
  try {
    const { token, ageGroup } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let result = await db.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    let user = result.rows[0];

    if (!user) {
      // Create new user
      const validAgeGroups = ['5-7', '8-10', '11-14'];
      const userAgeGroup = validAgeGroups.includes(ageGroup) ? ageGroup : '8-10';

      result = await db.query(
        `INSERT INTO users (google_id, name, email, avatar, age_group) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [googleId, name, email, picture, userAgeGroup]
      );
      user = result.rows[0];
    }

    const jwtToken = generateUserToken(user);

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        ageGroup: user.age_group,
        isNatkhatGannuMember: user.is_natkhat_gannu_member,
        isEligibleForGifts: user.is_eligible_for_gifts,
        totalScore: user.total_score,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// Admin login with email/password
router.post('/admin/login', adminLoginLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const result = await db.query(
      'SELECT * FROM admins WHERE email = $1 AND is_active = true',
      [email]
    );

    const admin = result.rows[0];

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, admin.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateAdminToken(admin);

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const table = req.user.role === 'admin' ? 'admins' : 'users';
    const result = await db.query(`SELECT * FROM ${table} WHERE id = $1`, [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = result.rows[0];
    delete userData.password_hash;

    res.json({ user: userData, role: req.user.role });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

module.exports = router;

