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
            "string.pattern.base": "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
        }),
});

router.post('/', async (req, res) => {
    const { error } = signUpSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(err => err.message);
        return res.status(400).json({ errors });
    }

    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ errors: ["Email already in use"] });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name,
            phone_number: req.body.phone_number,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error('Error during sign-up:', err);
        res.status(500).json({ errors: ["Server error. Please try again later."] });
    }
});

module.exports = router;

