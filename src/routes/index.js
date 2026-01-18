const express = require('express');
const authRoutes = require('./authRoutes');
const commentRoutes = require('./commentRoutes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/comments', commentRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

