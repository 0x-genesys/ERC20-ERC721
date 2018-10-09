var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var erc20Router = require('./erc20_apis/index');
var erc721Router = require('./erc721_apis/index');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/erc20', erc20Router);
app.use('/erc721', erc721Router)

module.exports = app;
