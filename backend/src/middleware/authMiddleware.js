const jwt = require('jsonwebtoken');

function authorizeRoles(...allowed) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing authorization token' });
      }
      const token = header.slice(7);

      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        console.error('JWT_SECRET not configured');
        return res.status(500).json({ error: 'Server configuration error' });
      }

      const payload = jwt.verify(token, JWT_SECRET);

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
