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
            if (err) {
                response.status(500).json({message: err});
            }else{
                response.status(200).json(comment);
            }
        });
    });

});

router.get('/depth', function (request, response){
    commentRepository.getMaxNestedLevel(function(err, result){
        if (err) {
            response.status(500).json({message: err});
        }else {
            response.status(200).json(result);
        }
    });
});

router.get('/list', function (request, response) {
    commentRepository.list(function (err, comments){
        if (err) {
            response.status(500).json({message: err});
        }else {
            response.status(200).json(comments);
        }
    });
});

module.exports = router;