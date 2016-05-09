var User = require('../models/user');
var sha1 = require('sha1');

exports.authenticate = function (username, password, cb) {
    User.findOne({username: username, password: sha1(password)}, function (err, user) {
        cb && cb(err, user);
    });
}

exports.register = function (username, password, cb) {
    var user = new User({username: username, password: sha1(password)});
    user.save(function (err, user) {
        cb && cb(err, user);
    });
}

exports.checkUsername = function (username, cb) {
    User.findOne({username: username}, function (err, user) {
        cb && cb(err, user != null);
    });
}