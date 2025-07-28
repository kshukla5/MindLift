const jwt = require('jsonwebtoken');

function authorizeRoles(...allowed) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing authorization token' });
      }
      const token = header.slice(7);
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key-that-matches-the-one-in-app.js');
      if (!allowed.includes(payload.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      req.user = payload;
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

module.exports = authorizeRoles;
