var express = require('express');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'
var config = require('./server/config/environments')[env];
var app = express();

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');

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