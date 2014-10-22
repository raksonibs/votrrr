var express = require('express');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'
var config = require('./server/config/environments')[env];
var app = express();

// Express config
require('./server/config/express')(app, config);

// MongoDB
var mongoose = require('mongoose');
mongoose.connect(config.database);
require('./server/models/Votes');

//passwordless
var passwordless = require('passwordless')
var MongoStore = require('passwordless-mongostore')
var email = require('emailjs')

var smtpServer = email.server.connect({
  user: '',
  password: '',
  host: 'smtp.gmail.com',
  ssl: true
})

var pathToMongoDb = config.database

passwordless.addDelivery(
  function(tokenToSend, uidToSend, recipient, callback) {
    var host = 'localhost:3000';
    smtpServer.send({
      text:    'Hello!\nAccess your account here: http://'
      + host + '?token=' + tokenToSend + '&amp;uid='
      + encodeURIComponent(uidToSend),
      from:    yourEmail,
      to:      recipient,
      subject: 'Token for ' + host
    }, function(err, message) {
      if(err) {
          console.log(err);
      }
      callback(err);
    });
});

// Routes
var routes = require('./server/config/routes')(app);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

var io = require('socket.io').listen(server)

io.sockets.on('connection', function(socket) {
  socket.on('cast:vote', function(data) {
    socket.broadcast.emit('casted:vote', data)
  })
})