const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    countryCode: {
        type: String,
        required: [true, 'Country code is required']
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required']
    },
    state: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
