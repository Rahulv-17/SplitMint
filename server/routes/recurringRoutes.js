const express = require('express');
const router = express.Router();
const { getRecurringExpenses, addRecurringExpense, updateRecurringExpense } = require('../controllers/recurringController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getRecurringExpenses)
  .post(protect, addRecurringExpense);

router.route('/:id')
  .put(protect, updateRecurringExpense);

module.exports = router;
