const express = require('express');
const router = express.Router();
const { getOptimizedSettlements, createSettlement } = require('../controllers/settlementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/group/:groupId', protect, getOptimizedSettlements);
router.post('/', protect, createSettlement);

module.exports = router;
