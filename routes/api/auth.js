var express = require('express');
var bodyParser = require('body-parser');
var tokenService = require('../../services/token');
var userRepository = require('../../repositories/userRepository');

var router = express.Router();

router.use(bodyParser.json());

router.post('/login', function (request, response){

	// Check the username is defined
	if (!request.body.username){
		response.status(500).json({ message: 'username required' });
		return;		
	}

	// Check the password is defined
	if (!request.body.password){
		response.status(500).json({ message: 'password required' });
		return;				
	}

	// Check if the username/password is correct
	userRepository.authenticate(request.body.username, request.body.password, function (err, user){			

		// If the user is not found
		if (!user){
			response.status(401).json({ message: 'unauthenticated' });
			return;
		}else{
			// If the user is ok, send the token			
			response.status(200).json({ token: tokenService.getToken(user) } );	
			return;
		}

	});
});

router.post('/register', function (request, response){

	// Check the username is defined
	if (!request.body.username){
		response.status(500).json({ message: 'username required' });
		return;		
	}

	userRepository.checkUsername(request.body.username, function (err, exists){
		
		if (exists){			
			response.status(500).json({ message: 'The username=[' + request.body.username + '] was already taken' });	
			return;
		}		

		// Check the password is defined
		if (!request.body.password){
			response.status(500).json({ message: 'password required' });
			return;
		}

		userRepository.register(request.body.username, request.body.password, function (err, user){
		
			if (!err && user){
				// If the user is ok, send the token
				response.status(200).json({ token: tokenService.getToken(user) } );
			}

		});
	});
	

});

module.exports = router;

