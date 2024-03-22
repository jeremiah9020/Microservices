const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

const deleteRouter = require('./routes/delete');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const registerRouter = require('./routes/register');
const roleRouter = require('./routes/role');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/delete/', deleteRouter);
app.use('/login/', loginRouter);
app.use('/logout/', logoutRouter);
app.use('/register/', registerRouter);
app.use('/role/', roleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
