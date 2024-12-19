const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const User = require('../models/User'); 
const { check, validationResult } = require('express-validator');

// Login route
router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const messages = errors.array().map(err => err.msg);
            return res.status(400).json({ message: messages });
        }

        const { email, password } = req.body;

        try {
            // Check if user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: ['Invalid User'] });
            }

            // Validate password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: ['Incorrect Password'] });
            }

            // User authentication successful
            res.status(200).json({ message: ['Login successful'], user: { id: user._id, name: user.name, email: user.email, role:user.role } });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: ['Server error'] });
        }
    }
);

module.exports = router;