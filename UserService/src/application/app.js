const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

const indexRouter = require('./routes/index');
const cookbooksRouter = require('./routes/cookbooks');
const followingRouter = require('./routes/following');
const recipesRouter = require('./routes/recipes');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/cookbooks/', cookbooksRouter);
app.use('/following', followingRouter);
app.use('/recipes', recipesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
