const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync')

exports.getAllUser = catchAsync(async (req, res) => {

  const users = await User.find()

  res.status(200).json({
    status: 'success',
    data: {
      users
    }
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
  })
});
