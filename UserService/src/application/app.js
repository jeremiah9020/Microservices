const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();

const indexRouter = require('./routes/index');
const cookbooksRouter = require('./routes/cookbooks');
const deleteRouter = require('./routes/delete');
const followingRouter = require('./routes/following');
const recipesRouter = require('./routes/recipes');
const feedRouter = require('./routes/feed');

app.use(cors( {
  origin: true,
  credentials: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/cookbooks/', cookbooksRouter);
app.use('/delete/', deleteRouter);
app.use('/following', followingRouter);
app.use('/recipes', recipesRouter);
app.use('/feed', feedRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
