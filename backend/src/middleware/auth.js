const jwt = require('jsonwebtoken');

// Verify JWT token for authenticated users
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

// Verify admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Verify user role (regular users from Google OAuth)
const requireUser = (req, res, next) => {
  if (!req.user || req.user.role !== 'user') {
    return res.status(403).json({ error: 'User access required' });
  }
  next();
};

// Verify Natkhat Gannu membership for exclusive content
const requireNatkhatGannuMember = (req, res, next) => {
  if (!req.user || !req.user.isNatkhatGannuMember) {
    return res.status(403).json({ 
      error: 'This content is exclusive to Natkhat Gannu community members',
      code: 'NATKHAT_GANNU_REQUIRED'
    });
  }
  next();
};

// Generate JWT token for users
const generateUserToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'user',
      ageGroup: user.age_group,
      isNatkhatGannuMember: user.is_natkhat_gannu_member,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Generate JWT token for admins
const generateAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: 'admin',
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireUser,
  requireNatkhatGannuMember,
  generateUserToken,
  generateAdminToken,
};

