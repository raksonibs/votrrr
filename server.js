var express = require('express');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'
var config = require('./server/config/environments')[env];
var app = express();

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');

var passwordless = require('passwordless');
//var passwordless = require('../../');

var MongoStore = require('passwordless-mongostore');
var email   = require("emailjs");

// Express config
require('./server/config/express')(app, config);

// MongoDB
var mongoose = require('mongoose');
mongoose.connect(config.database);
require('./server/models/Votes');
var User = mongoose.model('User');

var options = {
  host: 'localhost',
  port: app.get('port'),
  db: 2,
  pass: 'RedisPASS'
}

var smtpServer = email.server.connect({
  user: 'jacobzrobin@gmail.com',
  password: '052014230xX!!!',
  host: 'smtp.gmail.com',
  ssl: true
})

var mongoURI = config.database

passwordless.init(new MongoStore(mongoURI));
passwordless.addDelivery(
  function(tokenToSend, uidToSend, recipient, callback) {
    var host = 'localhost:3000';
    smtpServer.send({
      text:    'Hello!\nAccess your account here: http://'
      + host + '?token=' + tokenToSend + '&amp;uid='
      + encodeURIComponent(uidToSend),
      from:    'jacobzrobin@gmail.com',
      to:      recipient,
      subject: 'Token for ' + host
    }, function(err, message) {
      if(err) {
          console.log(err);
      }
      callback(err);
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({secret: '42', saveUninitialized: true, resave: true}))
app.use(function(req, res, next) {
  console.log(req.user)
  if(req.user) {
    User.findById(req.user, function(error, user) {
        res.locals.user = user;
        next();
    });
  } else {
    next();
  }
})

app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: '/'}));

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/sendtoken', 
  passwordless.requestToken(
    // Simply accept every user
    function(user, delivery, callback) {
      callback(null, user);
      // usually you would want something like:
      // User.find({email: user}, callback(ret) {
      //    if(ret)
      //      callback(null, ret.id)
      //    else
      //      callback(null, null)
      // })
    }),
  function(req, res) {
      res.render('sent');
  }
);

app.get('/restricted', passwordless.restricted(),
    function(req, res) {
        res.render('restricted', { user: req.user });
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