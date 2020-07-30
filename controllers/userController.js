const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { resolveConfig } = require('prettier');

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    } else {
      return;
    }
  });
  console.log(Object.keys(obj));
  console.log(newObj);
  return newObj;
};

exports.getAllUser = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates.Please use /updatePassword',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    runValidators: true,
    new: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'user data updated',
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  // 204:[status]:--> Delete,No content will be displayed.

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not implemented yet',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not implemented yet',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not implemented yet',
  });
};

exports.deleteUser = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
  });
});
