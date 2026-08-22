const RecurringExpense = require('../models/RecurringExpense');

// @desc    Get all recurring expenses for a user
// @route   GET /api/recurring
// @access  Private
const getRecurringExpenses = async (req, res) => {
  try {
    const expenses = await RecurringExpense.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a recurring expense
// @route   POST /api/recurring
// @access  Private
const addRecurringExpense = async (req, res) => {
  try {
    const { description, amount, category, frequency, nextPaymentDate } = req.body;
    
    if (!description || !amount || !category || !nextPaymentDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const expense = await RecurringExpense.create({
      user: req.user.id,
      description,
      amount,
      category,
      frequency: frequency || 'monthly',
      nextPaymentDate,
      isActive: true
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a recurring expense status (e.g. pause/resume)
// @route   PUT /api/recurring/:id
// @access  Private
const updateRecurringExpense = async (req, res) => {
  try {
    const expense = await RecurringExpense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    if (expense.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    expense.isActive = req.body.isActive !== undefined ? req.body.isActive : expense.isActive;
    await expense.save();

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecurringExpenses,
  addRecurringExpense,
  updateRecurringExpense
};
