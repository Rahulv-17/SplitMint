const Expense = require('../models/Expense');
const Group = require('../models/Group');

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ 
      $or: [
        { paidBy: req.user.id },
        { 'splits.user': req.user.id }
      ]
    }).populate('paidBy', 'name email').sort({ date: -1 });
    
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  try {
    const { description, amount, category, group, splits, date } = req.body;

    if (!description || !amount || !category) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const expense = new Expense({
      description,
      amount: Number(amount),
      category,
      date: date ? new Date(date) : new Date(),
      paidBy: req.user.id,
      group: group || null,
      splits: splits || []
    });

    const createdExpense = await expense.save();
    const populated = await Expense.findById(createdExpense._id).populate('paidBy', 'name email');
    
    if (group && req.io) {
      req.io.to(group.toString()).emit('newExpense', populated);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Only the person who paid can delete the expense
    if (expense.paidBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  deleteExpense,
};
