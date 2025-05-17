const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // “Bearer <token>” formatında
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token bulunamadı' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Geçersiz token' });
    req.user = user;  // payload içindeki { id: userId }
    next();
  });
}

module.exports = authenticateToken;
