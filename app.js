const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const tourController = require('./controllers/tourController')

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//* SERVING STATIC FILES
// app.use(express.static(`${__dirname}/public`));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from middleware 😷');
  next();
});



app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use('/api/v1/search', tourController.search)

module.exports = app;

//xkglt0zzKaEIwe2j
