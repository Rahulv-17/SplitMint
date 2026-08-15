const express = require('express');
const router = express.Router();
const { getBudgets, createBudget, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getBudgets)
  .post(protect, createBudget);

router.route('/:id')
  .delete(protect, deleteBudget);

module.exports = router;
