const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/env');

const {
  errorHandler,
  notFoundHandler,
} = require('./middleware/errorHandler');
const { limiter } = require('./config/rateLimit');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: config.cors.allowedOrigins,
    credentials: true,
  })
);

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use('/api/', limiter);

app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;
