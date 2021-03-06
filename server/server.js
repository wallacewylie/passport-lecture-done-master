var express = require('express');
var passport = require('passport');
var session = require('express-session');
var pg = require('pg');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var localStrategy = require('passport-local').Strategy;

var app = express();

var connectionString = 'postgres://localhost:5432/newdb';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//[][][][][][][][][][][][][][][][][][][][][][][][][][]
//                  PASSPORT THINGS
//[][][][][][][][][][][][][][][][][][][][][][][][][][]

app.use(passport.initialize());
app.use(passport.session());

app.use(session({
	secret: 'secret',
	key: 'user',
	resave: true,
	saveUninitialized: false,
	cookie: {maxAge: 60000, secure: false}
}));

app.use('/', index);


passport.serializeUser(function(user, done){
    console.log('serializeUser', user);
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
    console.log('deserializeUser', id);
	pg.connect(connectionString, function(err, client){
		var user = {};

		var query = client.query('SELECT * FROM users WHERE id = $1', [id]);

		query.on('row', function(row){
			user = row;
			console.log('User object', user);
			done(null, user);
		});
	});
});

passport.use('local', new localStrategy({
	passReqToCallback: true,
	usernameField: 'username'
}, function(req, username, password, done){

    //using postgres begins

	pg.connect(connectionString, function(err, client) {
        var user = {};

        var query = client.query('SELECT * FROM users WHERE username = $1', [username]);

        query.on('row', function (row) {
            user = row;
        });

        query.on('end', function () {
            console.log('User object', user);
            if (user && user.password === password) {
                done(null, user);
            } else {
                done(null, false, {message: 'Wrong somethin\' yo'});
            }
        });
    });
	//does the password match?

}));

var server = app.listen(3000, function(){
	var port = server.address().port;
	console.log('Address', server.address());
	console.log('Listening on port', port);
});