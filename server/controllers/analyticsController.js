const Expense = require('../models/Expense');

// @desc    Get user analytics
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all user expenses (paid by them)
    const expenses = await Expense.find({ paidBy: userId });

    const totalOutflow = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    // Group by category
    const categoryBreakdown = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    // Mock income and savings (in a real app this would come from a transactions/income model)
    const income = 42000;
    const savingsRate = income > 0 ? ((income - totalOutflow) / income) * 100 : 0;
    const avgDaily = totalOutflow / 30; // Approximation for the month

    res.json({
      totalOutflow,
      income,
      savingsRate: savingsRate.toFixed(1),
      avgDaily: avgDaily.toFixed(2),
      categoryBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics
};
