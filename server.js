var express = require('express');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'
var config = require('./server/config/environments')[env];
var app = express();

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');

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

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}

var createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, email, password, done) { 
    // check in mongo if a user with email exists or not
    User.findOne({ 'email' :  email }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with email '+email);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        // User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, 
              req.flash('message', 'Invalid Password'));
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
}));

passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, email, password, done) {
    findOrCreateUser = function(){
      // find a user in Mongo with provided email
      User.findOne({'email':email},function(err, user) {
        // In case of any error return
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false, 
             req.flash('message','User Already Exists'));
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.email = email;
          newUser.password = createHash(password);
 
          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
            }
            console.log('User Registration succesful');    
            return done(null, newUser);
          });
        }
      });
    };
     
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  });
);

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