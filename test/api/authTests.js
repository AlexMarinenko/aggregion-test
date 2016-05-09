var config = require('config');
var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var userRepository = require('../../repositories/userRepository.js');

chai.use(chaiHttp);

var apiBaseUrl = 'http://localhost:9090';

var server;

describe('Authentication functions tests', function () {

	before(function (){
		//
	});

	after(function (){
		//	
	});
	
	describe('Login API functions tests', function (){
		
		it('Login with no username returns 500', function (done) {
			
			chai
				.request(apiBaseUrl)
				.post('/v1/api/login')
				.send({})
				.end(function (err, response){					
					expect(response).to.have.status(500);					
     				done();			
				});
			
		});	
		it('Login with no password returns 500', function (done) {
			chai
				.request(apiBaseUrl)
				.post('/v1/api/login')
				.send({ username: 'username' })
				.end(function (err, response){										
     				expect(response).to.have.status(500);		
     				done();			
				});
		});	

		it('Login with wrong login/password returns 401', function (done) {
			chai
				.request(apiBaseUrl)
				.post('/v1/api/login')
				.send({ username: 'unknown username', password:'unknown password' })
				.end(function (err, response){										
     				expect(response).to.have.status(401);		     				
     				done();	
				});
		});	
		it('Login with correct login/password returns 200 and token as the response', function (done) {

			userRepository.register('user1', 'pass123', function (err, user){
				chai
					.request(apiBaseUrl)
					.post('/v1/api/login')
					.send({ username: 'user1', password:'pass123' })
					.end(function (err, response){								
						expect(err).to.be.null;							
	     				expect(response).to.have.status(200);     				
	     				expect(response.body.token).is.not.null;
	     				done();	
					});
			});		

		});	
	});	

	describe('Register API functions tests', function (){
		it('Register with no username returns 500', function (done) {
			chai
				.request(apiBaseUrl)
				.post('/v1/api/register')
				.send({})
				.end(function (err, response){					
					expect(response).to.have.status(500);					
     				done();			
				});
		});
		it('Register with no password returns 500', function (done) {
			chai
				.request(apiBaseUrl)
				.post('/v1/api/register')
				.send({ username: 'username' })
				.end(function (err, response){										
     				expect(response).to.have.status(500);		
     				done();			
				});
		});
		it('Register with already taken username returns 500', function (done) {
			chai
				.request(apiBaseUrl)
				.post('/v1/api/register')
				.send({ username: 'user1', password: 'some password' })
				.end(function (err, response){										
     				expect(response).to.have.status(500);		
     				done();			
				});
		});
		it('Register with correct username/password returns 200 and token as the response', function (done) {
			chai
				.request(apiBaseUrl)
				.post('/v1/api/register')
				.send({ username: 'user5', password: 'some password' })
				.end(function (err, response){										
     				expect(err).to.be.null;							
     				expect(response).to.have.status(200);     				
     				expect(response.body.token).is.not.null;
     				done();	
				});
		});

	});
});