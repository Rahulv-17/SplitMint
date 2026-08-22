const Group = require('../models/Group');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');

// @desc    Get user's groups
// @route   GET /api/groups
// @access  Private
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id })
      .populate('members', 'name email')
      .populate('createdBy', 'name email');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
const createGroup = async (req, res) => {
  try {
    const { name, description, memberEmails } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    let memberIds = [req.user.id];

    if (memberEmails && memberEmails.length > 0) {
      const users = await User.find({ email: { $in: memberEmails } });
      const newMemberIds = users.map(user => user._id.toString());
      memberIds = [...new Set([...memberIds, ...newMemberIds])];
    }

    const group = await Group.create({
      name,
      description,
      createdBy: req.user.id,
      members: memberIds
    });

    const populatedGroup = await Group.findById(group._id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');
    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get group details including expenses
// @route   GET /api/groups/:id
// @access  Private
const getGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Fix P2: Use .toString() comparison for ObjectId safety
    const isMember = group.members.some(member => member._id.toString() === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this group' });
    }

    const expenses = await Expense.find({ group: group._id })
      .populate('paidBy', 'name email')
      .sort({ date: -1 });

    const settlements = await Settlement.find({ group: group._id, status: 'completed' })
      .populate('payer', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });

    res.json({ group, expenses, settlements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add member to group
// @route   POST /api/groups/:id/members
// @access  Private
const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) return res.status(404).json({ message: 'Group not found' });

    // Check requester is a member
    if (!group.members.some(m => m.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Case-insensitive search for email
    const userToAdd = await User.findOne({ email: new RegExp('^' + email.trim() + '$', 'i') });
    if (!userToAdd) return res.status(404).json({ message: 'User not found with that email' });

    if (group.members.some(m => m.toString() === userToAdd._id.toString())) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    group.members.push(userToAdd._id);
    await group.save();

    const populatedGroup = await Group.findById(group._id).populate('members', 'name email');
    res.json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGroups,
  createGroup,
  getGroupDetails,
  addMember
};
