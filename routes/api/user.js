var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var commentRepository = require('../../repositories/commentRepository');

var router = express.Router();

router.use(bodyParser.json());

router.get('/list/byCommentsCount', function (request, response){
    commentRepository.getUsersByCommentsCount(function (err, result){
        if (err) {
            response.status(500).json({message: err});
        }else{
            response.status(200).json(result);
        }
    });
});

module.exports = router;