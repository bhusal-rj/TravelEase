const mongoose = require('mongoose');
const dotenv = require('dotenv');
const checkEnvVars = require('./utils/checkEnv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

checkEnvVars(['DATABASE', 'DATABASE_PASSWORD', 'PORT']);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Successfully connected to DB'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running in ${port} port!!`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection!!');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down !!');
  server.close(() => {
    console.log('Process terminated!!');
  });
});
