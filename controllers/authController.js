const Jwt = require('jsonwebtoken')
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
    return Jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})
    ;

exports.login = catchAsync(async (req, res, next) => {
    // receive email && password from client,if not send eror.
    // check if user exists,if not send eror
    // check if the password is correct,if not send eror
    // send token, as response to client

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please enter email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');


    if (!user || !(await user.comparePasswords(password, user.password))) {
        //  401 :- UnAuthorized
        return next(new AppError('Incorrect Email or Password', 401));
    }

    let token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    })
})