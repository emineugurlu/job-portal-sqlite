const jwt = require('jsonwebtoken');
module.exports = function authenticateToken(req, res, next) {
  const auth = req.headers['authorization']?.split(' ');
  if (!auth || auth[0] !== 'Bearer') return res.sendStatus(401);
  jwt.verify(auth[1], process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = { id: payload.id, role: payload.role };
    next();
  });
};
