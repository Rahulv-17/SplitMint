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

    // Generate last 6 months trend data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trendData = [];
    const cashflowData = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthLabel = monthNames[d.getMonth()];
      
      const monthExpenses = expenses.filter(e => {
        const ed = new Date(e.date);
        return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
      });
      const monthTotal = monthExpenses.reduce((sum, curr) => sum + curr.amount, 0);
      
      trendData.push({ name: monthLabel, total: monthTotal });
      // Since there is no real income tracking for the MVP, default income to 0
      cashflowData.push({ name: monthLabel, income: 0, expense: monthTotal });
    }

    const income = 0; // Removing the fake 42000
    const savingsRate = 0; // Savings rate is 0 since income is 0
    
    // Average daily: total outflow / number of days user has been active, or approx 30 for this month
    const avgDaily = totalOutflow > 0 ? (totalOutflow / 30) : 0; 

    res.json({
      totalOutflow,
      income,
      savingsRate: savingsRate.toFixed(1),
      avgDaily: avgDaily.toFixed(2),
      categoryBreakdown,
      trendData,
      cashflowData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics
};
