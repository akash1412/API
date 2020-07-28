
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
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
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
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1)Get token and check if it's there

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in,Please login to get access', 401))
    }

    // 2) Verification Token (verify token)

    // TODO const decoded = await promisify(Jwt.verify)(token,process.env.JWT_SECRET_KEY)

    const decoded = await Jwt.verify(token, process.env.JWT_SECRET_KEY)


    // 3) Check if user still exists

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError('The user belonging to this token,no longer exist', 401));
    }

    // 4) check if the user has changed password after the token was issued



    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please login again.', 401))
    }


    req.user = currentUser;

    //GRANT ACCESS TO THE PROTECTED ROUTES
    next();
});


exports.restrictTo = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403))
        }

        next();
    }
};


exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) GET USER withPOST requet details 

    // 2) Genrate token

    //3) send token to the email address
})


exports.resetPassword = catchAsync(async (req, res, next) => {

})