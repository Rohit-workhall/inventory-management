const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Validation Schema
const signUpSchema = Joi.object({
    name: Joi.string().min(3).required(),
    phone_number: Joi.string().length(10).pattern(/^\d+$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
        .required()
        .messages({
            "string.pattern.base": "Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character."
        }),
});

router.post('/', async (req, res) => {
    // Validate input
    const { error } = signUpSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(err => err.message);
        return res.status(400).json({ message: errors });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return res.status(400).json({ message: ['Email already in use'] });

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user
        const user = new User({
            name: req.body.name,
            phone_number: req.body.phone_number,
            email: req.body.email,
            password: hashedPassword
        });

        // Save the user to the database
        await user.save();
        res.status(201).json({ message: ['User created successfully'] });
    } catch (err) {
        console.error('Error during sign-up:', err);
        res.status(500).json({ message: ['Server error. Please try again.'] });
    }
});

module.exports = router;
