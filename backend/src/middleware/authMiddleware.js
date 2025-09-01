const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/jwt');

function authorizeRoles(...allowed) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing authorization token' });
      }
      const token = header.slice(7);

      const payload = jwt.verify(token, getJwtSecret());

      if (!allowed.includes(payload.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      req.user = payload;
      next();
    } catch (err) {
      console.error('Auth middleware error:', err.message);
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

module.exports = authorizeRoles;
