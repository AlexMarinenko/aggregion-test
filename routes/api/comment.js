var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var commentRepository = require('../../repositories/commentRepository');
var tokenService = require('../../services/token');

var router = express.Router();

router.use(bodyParser.json());

router.post('/add', function (request, response) {

    if (!request.body.txt) {
        response.status(500).json({message: 'txt required'});
        return;
    }

    tokenService.extractUserFromRequest(request, function (err, user) {
        commentRepository.add(user.userid, request.body.txt, request.body.parentCommentId, function (err, comment) {
            if (!err) {
                response.status(200).json(comment);
                return;
            }
            response.status(500).json({result: false, message: err});
        });
    });

});

module.exports = router;

//curl -X POST --data '{ "comment": "comment1", "parentCommentId": "123" }' -H 'Content-type: application/json' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIyIiwidXNlcmlkIjoiNTcyZmU2MTNkYzE5YmNjMzY5YjJhZjE0IiwiaWF0IjoxNDYyNzU3Mzk5fQ.CUYrENIrwD_WQhBcmsR3oJkFwrDs1wVKus4UMzXud3M' http://localhost:9090/v1/api/comment/add