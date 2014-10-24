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


app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: '/'}));

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/sendtoken',
  function(req, res, next) {
      // TODO: Input validation
      console.log('no validations currently')
      next()
    },
  // Turn the email address into a user ID
  passwordless.requestToken(
    function(user, delivery, callback) {
      // E.g. if you have a User model:
      console.log(user)
      User.findOne({name: new RegExp('^'+user+'$', "i")}, function(error, user) {
        if (error) {
          console.log('error')
          callback(error.toString());
        } else if(user) {
          console.log('user')
            // return the user ID to Passwordless
          callback(null, user.id);
        } else {
          // If the user couldn’t be found: Create it!
          // You can also implement a dedicated route
          // to e.g. capture more user details
          var newUser = new User({
            email: user
          })
          console.log('reached here')
          newUser.save(function(error, user) {
            console.log(error)
              if(error) {
                callback(error.toString());
              } else {
                callback(null, user.id);
              }
            })
        }
      })
    }),
  function(req, res) {
      // Success! Tell your users that their token is on its way
      res.render('sent');
    }
);

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