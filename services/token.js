var config = require('config');
var jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');

exports.getExpressJWT = function ( unless ){
	return expressJWT({ secret: config.secretKey }).unless(unless);
}

exports.getToken = function (user){
	return jwt.sign( { username: user.username, userid: user._id }, config.secretKey );
}

exports.extractUserFromRequest = function (request, cb){

	if (!request.headers['authorization']){
		throw new Error('authorization header is not found');
	}

	var token = request.headers['authorization'].replace('Bearer', '').trim();

	jwt.verify(token, config.secretKey, function(err, decoded) {
  		cb && cb(err, decoded);
	});	
}