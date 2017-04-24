var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('./app_server/models/user');
var routes = require('./app_server/routes/index');
var session = require('express-session');
var Profile = require('./app_server/models/profile');
var app = express();

passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

passport.use(new LocalStrategy(
  function(username, password, done) {

    process.nextTick(function () {
	  User.findOne({'admin.username':username},
		function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false); }
			if (user.admin.password != password) { return done(null, false); }
			return done(null, user);
      console.log('user logged ');
		});
    });
  }
));

passport.use(new FacebookStrategy({

        clientID        : "998080960324327",
        clientSecret    : "d1e6005427110c7d7f7148a96e10857a",
        callbackURL     : "http://cityzen.xyz/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'name', 'email', 'picture.type(large)']
    },


    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = (profile.emails[0].value || null).toLowerCase();// facebook can return multiple emails so we'll take the first
                    newUser.facebook.photo = profile.photos[0].value;
                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

function checkAuthentication(req,res,next){
        if(req.isAuthenticated()){
            //if user is looged in, req.isAuthenticated() will return true
            next();
        } else{
            res.redirect("/login");
        }
    };

function checkAuthentication4(req,res,next){
        if(typeof req.user.admin !== undefined){ 
            //if user is looged in, req.isAuthenticated() will return true
            next();
        } else{
            res.redirect("/admin/login");
        }
    };

function checkAuthentication2(req,res,next){
            if(!req.isAuthenticated()){
                //if user is looged in, req.isAuthenticated() will return true
                next();
            } else{
                res.redirect("/dashboard");
            }
        }; 
function checkAuthentication3(req,res,next){
            if(typeof req.user.admin === undefined){
                //if user is looged in, req.isAuthenticated() will return true
                next();
            } else{
                res.redirect("/admin");
            }
        };
function checkIfExists(req,res, next){
    Profile.findOne({id: req.user._id}, function(err, doc){
        if(err) throw err;
        if(!doc){
            next();
        }
        else{
            res.cookie('name', doc.name, { expires: 0, httpOnly: true });
            res.cookie('pin', doc.pin, { expires: 0, httpOnly: true });
            res.cookie('photo', doc.photo, { expires: 0, httpOnly: true });
            res.redirect('/dashboard');
        }
    })
};


// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 3600000 }}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', checkAuthentication2, routes);
app.get('/profile', checkAuthentication, function (req, res) {
  res.json(req.user.google.name);
});
app.get('/profile/create', checkIfExists, routes);
app.get('/admin/login', checkAuthentication3, routes);
app.get('/admin', routes);
app.post('/profile/add', checkIfExists, routes);
app.get('/dashboard', checkAuthentication, routes);
app.get('/dashboard/addressed', checkAuthentication, routes);
app.post('/complains/lodge', checkAuthentication, routes);
app.get('/login', checkAuthentication2, routes);
app.get('/signup', checkAuthentication2, routes);
app.get('/approve/:id', checkAuthentication, routes);
app.get('/address/:id', routes);
app.get('/admin/analysis/01', routes);
app.get('/admin/analysis/02', routes);
app.get('/admin/analysis/04', routes);
app.get('/admin/analysis/05', routes);
app.post('/admin/analysis/03', routes);
app.get('/admin/areas', routes);
app.post('/admin/hareas', routes);
app.get('/auth/facebook', checkAuthentication2, passport.authenticate('facebook', { scope : 'email' }));
app.get('/admin/analysis', routes);
app.get('/about', routes);
app.get('/complains/view/:id', checkAuthentication, routes);
	// handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : "/profile/create",
			failureRedirect : "/"
		}));
app.post('/admin/login/auth', bodyParser.urlencoded({ extended: true }),
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
  }));
	// =====================================
	// LOGOUT ==============================
	// =====================================
app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
