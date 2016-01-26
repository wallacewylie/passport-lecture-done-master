/**
 * Created by joelmiller on 1/25/16.
 */

var express = require('express');
var path = require('path');
var router = express.Router();
var passport = require('passport');

router.get('/', function(request, response){
	response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.get('/fail', function(request, response){
	response.sendFile(path.join(__dirname, '../public/views/fail.html'));
});

router.get('/success', function(request, response){
	console.log('Request user on success route', request.user);
	response.sendFile(path.join(__dirname, '../public/views/success.html'));
});

router.post('/', passport.authenticate('local', {
	successRedirect: '/success',
	failureRedirect: '/fail'
}));

module.exports = router;
