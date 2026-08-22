const express = require('express');
const router = express.Router();
const { getOptimizedSettlements, createSettlement, sendReminder } = require('../controllers/settlementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/group/:groupId', protect, getOptimizedSettlements);
router.post('/', protect, createSettlement);
router.post('/remind', protect, sendReminder);

module.exports = router;
