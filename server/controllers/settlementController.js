const Settlement = require('../models/Settlement');
const Group = require('../models/Group');
const Expense = require('../models/Expense');
const User = require('../models/User');
const { optimizeDebts } = require('../services/debtOptimizationService');

// @desc    Get optimized settlements for a group
// @route   GET /api/settlements/group/:groupId
// @access  Private
const getOptimizedSettlements = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    
    const group = await Group.findById(groupId).populate('members', 'name email');
    // Fix P2: use .toString() for ObjectId comparison
    if (!group || !group.members.some(m => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const expenses = await Expense.find({ group: groupId });
    const settlements = await Settlement.find({ group: groupId });

    const optimized = optimizeDebts(expenses, settlements);
    
    // Fix P1: Populate user names for the frontend (raw IDs are useless to display)
    const memberMap = {};
    group.members.forEach(m => { memberMap[m._id.toString()] = m.name; });
    
    const enriched = optimized.map(s => ({
      payer: s.payer,
      payerName: memberMap[s.payer] || 'Unknown',
      receiver: s.receiver,
      receiverName: memberMap[s.receiver] || 'Unknown',
      amount: s.amount,
    }));
    
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a settlement (pay a debt)
// @route   POST /api/settlements
// @access  Private
const createSettlement = async (req, res) => {
  try {
    const { receiver, amount, group } = req.body;

    if (!receiver || !amount) {
      return res.status(400).json({ message: 'Receiver and amount are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Settlement amount must be greater than 0' });
    }

    // Prevent settling your own debt (payer === receiver check)
    if (receiver === req.user.id) {
      return res.status(400).json({ message: 'Cannot settle with yourself' });
    }

    const settlement = await Settlement.create({
      payer: req.user.id,
      receiver,
      amount: Number(amount),
      group: group || null,
      status: 'completed'
    });

    const populatedSettlement = await Settlement.findById(settlement._id)
      .populate('payer', 'name email')
      .populate('receiver', 'name email');

    if (group && req.io) {
      req.io.to(group.toString()).emit('newSettlement', populatedSettlement);
    }

    res.status(201).json(populatedSettlement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOptimizedSettlements,
  createSettlement
};
