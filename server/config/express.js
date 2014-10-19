var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

module.exports = function(app, config){

  app.set('port', process.env.PORT || 3000);

  // view engine setup
  app.set('views', path.join(config.rootPath, '/views'));
  app.set('view engine', 'ejs')

  // favicon in /public
  //app.use(favicon(config.rootPath + '/public/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(config.rootPath, 'public')));
  app.use('/bower_components',  express.static(__dirname + '/bower_components'));
}