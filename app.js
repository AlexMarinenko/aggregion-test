var express = require('express');
var authApi = require('./routes/api/auth.js');
var commentApi = require('./routes/api/comment.js');
var userApi = require('./routes/api/user.js');
var app = express();
var tokenService = require('./services/token');

app.use('/v1/api', authApi);
app.use('/v1/api/comment', commentApi);
app.use('/v1/api/user', userApi);
app.use(tokenService.getExpressJWT({path: ['/v1/api/login', '/v1/api/register']}));

module.exports = app;