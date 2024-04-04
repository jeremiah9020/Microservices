const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

const indexRouter = require('./routes/index');
const metadataRouter = require('./routes/metadata');
const referenceRouter = require('./routes/reference');
const feedRouter = require('./routes/feed');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/metadata/', metadataRouter);
app.use('/reference/', referenceRouter);
app.use('/feed/', feedRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
