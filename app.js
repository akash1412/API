const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const tourController = require('./controllers/tourController')

const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/appError')

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//* SERVING STATIC FILES
// app.use(express.static(`${__dirname}/public`));

app.use(express.json());

console.log(process.env.NODE_ENV.trim())

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use('/api/v1/search', tourController.search)

app.all('*', (req, res, next) => {

  // res.status(404).json({
  //   status: 'fail',
  //   message: `can't find ${req.originalUrl} on this server!`
  // });

  // const err = new Error(`can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';

  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404))

})



app.use(globalErrorHandler)

module.exports = app;

//xkglt0zzKaEIwe2j
