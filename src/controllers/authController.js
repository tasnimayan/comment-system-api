const authService = require('../services/authService');
const { asyncHandler } = require('../middleware/errorHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const profile = await authService.getUserProfile(req.user.userId);

  res.status(200).json({
    success: true,
    data: profile,
  });
});

module.exports = {
  register,
  login,
  getProfile,
};
