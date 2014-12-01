/*************************************
//
// transient app
//
**************************************/

// express magic
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var device = require('express-device');

var runningPortNumber = process.env.PORT;
var models = require("./models");

var restful   = require('sequelize-restful');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');


app.configure(function() {
    // I need to access everything in '/public' directly
    app.use(express.static(__dirname + '/public'));

    //set the view engine
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');

    app.use(device.capture());

    app.use(passport.initialize());
    app.use(express.cookieParser());
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.session({ secret: 'Cheeeeeeeeeeen!' }));
    app.use(passport.session());
    app.use(flash());
    app.use(restful(models.sequelize, { /* options */ }));


});

app.use(function(req, res, next){
  res.locals.session = req.session;
  models.User.find(req.session.userId).success(function(user){


    if(user){
      console.log('Found User: ' + user.email);
    } else {
      console.log("No Session User Found");
    }
    res.locals.user = user;
    next();
  });
  console.log('res.locals.user: ' + res.locals.user);

});

// logs every request
app.use(function(req, res, next) {
    // output every request in the array
    console.log({
        method: req.method,
        url: req.url,
        device: req.device,
        params: req.body
    });

    // goes onto the next function in line
    next();
});

app.get("/", function(req, res) {
    res.render('index', {});
});

app.get('/user', function(req, res) {
    res.render('user', {});
});


/*
app.post('/user/register', function(req, res) {
console.log(req.query);
var un = req.query.email;
var pw = req.query.password;
console.log("" + un + " " + pw);
models.User.create({username: req.query.email, first_name: req.query.first_name, last_name: req.query.last_name, password: req.query.password}).success(function(user){
console.log("New User Registered: " + user.values);
res.render('index', {});
}).error(function(){
console.log("Failed User Registeration");
res.render('register', {});
});
});
*/

app.post('/register', function(req, res){
  models.User.create(req.body).success(function(user){
    console.log("New User Registered: " + user.values);
    res.render('index', {});
  }).error(function(){
    console.log("Failed User Registeration");
    res.render('register', {});
  });
});


app.get('/register', function(req, res) {
  res.render('register', {});
});



app.post('/login', function(req, res){
  var un = req.body.email;
  var pw = req.body.password;
  models.User.find({where: {email: un, password: pw}}).success(function(user){
    if(user === null){
      console.log("Failed log in: " + un);
      res.redirect('/');
    } else {
      // user exists, enter the session
      req.session.userId = user.id;
      console.log("User Logged in: " + user.email);
      //redirect
      res.redirect('/');
    }
  });
});


server.listen(runningPortNumber);
