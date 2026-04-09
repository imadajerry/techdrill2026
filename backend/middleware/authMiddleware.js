const jwt = require('jsonwebtoken');
const { fail } = require('../utils/responseHelper');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return fail(res, 'No token provided.', 401);
  }

  // Strip "Bearer " prefix
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch (err) {
    return fail(res, 'Invalid or expired token.', 401);
  }
};

module.exports = verifyToken;