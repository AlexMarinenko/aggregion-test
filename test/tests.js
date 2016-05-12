var config = require('config');
var app = require('../app.js');
var mongoose = require('mongoose');

var server;

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
    require('./api/userTests.js');


    after(function () {
        mongoose.connection.db.dropDatabase(function (){
            server.close();
        });
    });
});

