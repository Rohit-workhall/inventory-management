const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    phone_number: {
        type: String, // Use String for length validation
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // Ensure exactly 10 digits
            },
            message: (props) => `${props.value} is not a valid 10-digit phone number!`
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);

