var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

  passport.use('local-signup', new LocalStrategy({
        
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
      },
      function(req, email, password, done) {
        process.nextTick(function() {

    User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
              return done(err);
            if (user) {
              return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                var newUser            = new User();
                console.log(newUser)
                newUser.email    = email;
                newUser.password = newUser.generateHash(password);
        newUser.save(function(err) {
          if (err)
            throw err;
          return done(null, newUser);
        });
      }
    });    
  });
}));
};
