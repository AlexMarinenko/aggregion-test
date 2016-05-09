var config = require('config');
var app = require('../app.js');
var mongoose = require('mongoose');

var server;

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

describe("Integration tests", function () {

    before(function () {
        mongoose.connect(config.dbURI, function () {
            /* Drop the DB */
            mongoose.connection.db.dropDatabase();

        });
        server = app.listen(config.port);
    });

    require('./api/authTests.js');
    require('./api/commentTests.js');


    after(function () {
        server.close();
    });
});

