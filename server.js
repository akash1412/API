const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  const { name, message } = err;
  console.log({ name, message });
  console.log('UNCAUGHT Expcetion 💥, shutting down server ');
});

const app = require('./app');

const port = 3000;

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

// 👇 'Uncaught Expcetion'--> are error which occur in our synchronus code and which
// are not handled anywhere.

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('CONNECTED TO DB'));

const server = app.listen(port, () =>
  console.log(`Server Running on port ${port} 😪`)
);

// 👇  'unhandledRejection' --> this type of erros are asynchronus errors occur outside
// of our express app ,like : 'DB connect error' etc ,which are not handled by
// express error handling.
process.on('unhandledRejection', (err) => {
  const { name, message } = err;
  console.log({ name, message });
  console.log('UNHANDLED REJECTION 💥, shutting down server ');
  server.close(() => {
    process.exit(1);
  });
});
