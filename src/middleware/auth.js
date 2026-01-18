const { verifyToken, extractTokenFromHeader } = require('../utils/jwtUtils');
const { AuthenticationError } = require('../utils/errors');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new AuthenticationError('No authentication token provided');
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw new AuthenticationError('User account not found or inactive');
    }

    req.user = {
      userId: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return next(error);
    }
    next(new AuthenticationError(error.message));
  }
};

module.exports = authenticate;
