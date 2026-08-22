const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Group = require('../models/Group');
const Settlement = require('../models/Settlement');

// @desc    Get dashboard summary
// @route   GET /api/dashboard
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    // Fix P1: use req.user.id (string getter) not req.user._id (ObjectId)
    const userId = req.user.id;

    // --- Personal Expenses ---
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const allUserExpenses = await Expense.find({ paidBy: userId }).sort({ date: -1 });
    const thisMonthExpenses = allUserExpenses.filter(e => new Date(e.date) >= startOfMonth);
    const totalExpenses = thisMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const allTimeExpenses = allUserExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    // --- Recent Expenses (last 5) ---
    const recentExpenses = allUserExpenses.slice(0, 5);

    // --- Budgets ---
    const budgets = await Budget.find({ user: userId });
    const populatedBudgets = await Promise.all(budgets.slice(0, 3).map(async (budget) => {
      const expenses = await Expense.find({
        paidBy: userId,
        category: budget.category,
        date: { $gte: startOfMonth }
      });
      const spent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
      return {
        category: budget.category,
        limit: budget.limit,
        spent,
        percentage: budget.limit > 0 ? Math.min(Math.round((spent / budget.limit) * 100), 100) : 0,
      };
    }));

    // --- Group Balances ---
    const userGroups = await Group.find({ members: userId }).populate('members', 'name');
    let youAreOwed = 0;
    let youOwe = 0;
    const groupSummaries = [];

    for (const group of userGroups.slice(0, 3)) {
      const groupExpenses = await Expense.find({ group: group._id });
      const groupSettlements = await Settlement.find({ group: group._id, status: 'completed' });

      let netBalance = 0;
      groupExpenses.forEach(expense => {
        if (expense.paidBy.toString() === userId) {
          netBalance += expense.amount;
        }
        expense.splits.forEach(split => {
          if (split.user.toString() === userId) {
            netBalance -= split.amount;
          }
        });
      });
      groupSettlements.forEach(s => {
        if (s.payer.toString() === userId) netBalance += s.amount;
        if (s.receiver.toString() === userId) netBalance -= s.amount;
      });

      if (netBalance > 0) youAreOwed += netBalance;
      else youOwe += Math.abs(netBalance);

      groupSummaries.push({
        _id: group._id,
        name: group.name,
        memberCount: group.members.length,
        netBalance: Math.round(netBalance * 100) / 100,
      });
    }

    // --- Weekly spending data for chart ---
    const weeklyData = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - i * 7);
      weekEnd.setHours(23, 59, 59, 999);

      const weekExpenses = allUserExpenses.filter(e => {
        const d = new Date(e.date);
        return d >= weekStart && d <= weekEnd;
      });
      const total = weekExpenses.reduce((acc, curr) => acc + curr.amount, 0);
      weeklyData.push({ name: `Week ${4 - i}`, total: Math.round(total) });
    }

    // --- Recent Activities (Expenses & Settlements) ---
    const recentSettlements = await Settlement.find({
      $or: [{ payer: userId }, { receiver: userId }],
      status: 'completed'
    }).populate('payer receiver').sort({ createdAt: -1 }).limit(5);

    const activities = [];
    
    // Add expenses to activities
    allUserExpenses.slice(0, 5).forEach(e => {
      activities.push({
        id: `exp_${e._id}`,
        user: 'You',
        action: 'added an expense',
        target: '',
        detail: e.description,
        time: new Date(e.date).toLocaleDateString(),
        date: new Date(e.date),
        amount: e.amount,
        tag: e.category,
        icon: 'add_circle',
        colorClass: 'text-primary',
        bgClass: 'bg-primary/10 border-primary/20'
      });
    });

    // Add settlements to activities
    recentSettlements.forEach(s => {
      const isPayer = s.payer._id.toString() === userId;
      activities.push({
        id: `set_${s._id}`,
        user: isPayer ? 'You' : s.payer.name.split(' ')[0],
        action: isPayer ? `settled up with ${s.receiver.name.split(' ')[0]}` : 'settled up with you',
        target: '',
        detail: 'Settlement',
        time: new Date(s.createdAt).toLocaleDateString(),
        date: new Date(s.createdAt),
        amount: s.amount,
        tag: 'Settlement',
        icon: 'handshake',
        colorClass: 'text-secondary-container',
        bgClass: 'bg-secondary-container/10 border-secondary-container/20',
        amountColor: 'text-secondary-container'
      });
    });

    // Sort by date descending and take top 10
    activities.sort((a, b) => b.date - a.date);
    const recentActivities = activities.slice(0, 10);

    res.json({
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      allTimeExpenses: Math.round(allTimeExpenses * 100) / 100,
      youAreOwed: Math.round(youAreOwed * 100) / 100,
      youOwe: Math.round(youOwe * 100) / 100,
      budgets: populatedBudgets,
      recentExpenses,
      groups: groupSummaries,
      weeklyData,
      activities: recentActivities
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardSummary
};
