var express = require('express');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'
var config = require('./server/config/environments')[env];
var app = express();

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
app.use(passport.initialize());
app.use(passport.session());

require('./server/config/passport')(passport); 

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/votes', 
  failureRedirect : '/index',
  failureFlash : true
}));

app.get('/signup', function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

app.get('/', function(req, res) {
  // Display the Login page with any flash message, if any
  res.render('index', { message: req.flash('message') });
});

/* Handle Login POST */
app.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash : true 
}));

/* GET Registration Page */
app.get('/signup', function(req, res){
  res.render('index',{message: req.flash('message')});
});

/* Handle Registration POST */
app.post('/signup', passport.authenticate('signup', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash : true 
}));

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