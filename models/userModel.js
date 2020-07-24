const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
        trim: true,
        minlength: [],
        maxlength: []
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: [true, 'user with this email already exists'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],

        // 👇 this only runs on create and save method
        validate: {
            validator: function (el) {
                return el === this.password
            }
            ,
            message: 'passwords do not match'
        }
    }

});

userSchema.pre('save', async function (next) {
    // only run if the password is changed
    if (!this.isModified('password')) {
        return next()
    }

    // hash the password with the cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete the password
    this.passwordConfirm = undefined  // <-- doing this passwordConfirm will not be persisted in the DB 
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User