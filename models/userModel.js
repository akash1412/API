const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
    minlength: [],
    maxlength: [],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: [true, 'user with this email already exists'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],

    // 👇 this only runs on create and save method
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords do not match',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  // only run if the password is changed
  if (!this.isModified('password')) {
    return next();
  }

  // hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the password
  this.passwordConfirm = undefined; // <-- doing this passwordConfirm will not be persisted in the DB
  next();
});

userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew()) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.methods.comparePasswords = async function (
  candiatePassword,
  userPassword
) {
  return await bcrypt.compare(candiatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;
    console.log(JWTTimeStamp < changedTimeStamp);
    return JWTTimeStamp < changedTimeStamp; //--> means password has changed after token has generated.
  }

  // false --> means password not changed.
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  console.log(crypto.randomBytes(32));

  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
