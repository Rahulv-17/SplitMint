const User = require('../models/User');

// @desc    Search users by name or email
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const regex = new RegExp(q, 'i');
    
    // Search for users matching the query in name or email
    // Exclude the currently logged in user from results
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user.id } },
        {
          $or: [
            { name: { $regex: regex } },
            { email: { $regex: regex } }
          ]
        }
      ]
    }).select('_id name email avatar').limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchUsers
};
