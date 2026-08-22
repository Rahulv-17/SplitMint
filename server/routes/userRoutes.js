const express = require('express');
const router = express.Router();
const { searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/search').get(protect, searchUsers);

module.exports = router;
