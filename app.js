const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const XSS = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const tourController = require('./controllers/tourController');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP,Please try again in an hour.',
});

// Set security Http headers
app.use(helmet());

//limit requests from the same IP
app.use('/api', limiter); //👈 fights against Brute force attacks

// Request logger for development Mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Parses Incoming JSON requests
app.use(express.json({ limit: '20kb' }));

// DATA Sanitization against NoSql query Injection
app.use(mongoSanitize()); //👈 this prevents hacker to query data by injecting mallecious code in req.body

//DATA Sanitization against XSS attacks [XSS] <--Cross side scripting
app.use(XSS()); //👈 This prevents from injecting any kind of html element with a script.

// preventing parameter polluiton
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//* SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

console.log(process.env.NODE_ENV.trim());

// tour middleware
app.use('/api/v1/tours', tourRouter);

// user middleware
app.use('/api/v1/users', userRouter);

app.use('/api/v1/reviews', reviewRouter);

app.use('/api/v1/search', tourController.search);

app.all('*', (req, res, next) => {
  // const err = new Error(`can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';

  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
