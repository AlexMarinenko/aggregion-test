var mongoose = require('mongoose');
var sha1 = require('sha1');

var userSchema = mongoose.Schema({
    username: String,
    password: String
});

var User = mongoose.model('User', userSchema);

exports.authenticate = function(username, password, cb){
	User.findOne( { username: username, password: sha1(password) }, function (err, user) {
		cb && cb(err, user);
	});
}

exports.register = function (username, password, cb){
	var user = new User( { username: username, password: sha1(password) } );
	user.save(function (err, user){
		cb && cb(err, user);
	});
}

exports.checkUsername = function (username, cb){
	User.findOne( {username: username}, function (err, user){
		cb && cb(err, user != null);		
	});
}