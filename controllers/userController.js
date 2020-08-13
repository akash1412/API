const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Factory = require('./handlerFactory');

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

exports.getAllUser = Factory.getAll(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

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

exports.getUser = Factory.getOne(User);

exports.updateUser = Factory.updateOne(User); // <-- Restrict updating password with this route
exports.deleteUser = Factory.deleteOne(User);
