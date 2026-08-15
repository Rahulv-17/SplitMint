const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const populatedBudgets = await Promise.all(budgets.map(async (budget) => {
      const expenses = await Expense.find({
        paidBy: req.user.id,
        category: budget.category,
        date: { $gte: startOfMonth }
      });
      
      const spent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
      
      return {
        ...budget._doc,
        spent: Math.round(spent * 100) / 100,
        percentage: budget.limit > 0 ? Math.min(Math.round((spent / budget.limit) * 100), 100) : 0,
      };
    }));
    
    res.json(populatedBudgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res) => {
  try {
    const { category, limit, month } = req.body;
    
    if (!category || !limit) {
      return res.status(400).json({ message: 'Category and limit are required' });
    }

    if (limit <= 0) {
      return res.status(400).json({ message: 'Budget limit must be greater than 0' });
    }
    
    const budgetMonth = month || new Date().toISOString().slice(0, 7);

    const existingBudget = await Budget.findOne({ user: req.user.id, category, month: budgetMonth });
    if (existingBudget) {
      return res.status(400).json({ message: 'Budget for this category already exists this month' });
    }

    const budget = await Budget.create({
      user: req.user.id,
      category,
      limit: Number(limit),
      month: budgetMonth
    });

    res.status(201).json({ ...budget._doc, spent: 0, percentage: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await budget.deleteOne();
    res.json({ message: 'Budget removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBudgets,
  createBudget,
  deleteBudget,
};
