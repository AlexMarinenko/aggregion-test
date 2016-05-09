var express = require('express');
var authApi = require('./routes/api/auth.js');
var commentApi = require('./routes/api/comment.js');
var app = express();
var tokenService = require('./services/token');

app.use('/v1/api', authApi);
app.use('/v1/api/comment', commentApi);
app.use(tokenService.getExpressJWT({ path: [ '/v1/api/login', '/v1/api/register' ] }));

module.exports = app;