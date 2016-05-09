var config = require('config');
var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var commentRepository = require('../../models/comment');
var mongoose = require('mongoose');

chai.use(chaiHttp);

var apiBaseUrl = 'http://localhost:9090';

var server;
var token;
var rootNodeId;

describe('Comments functions tests', function () {

	describe('Comments repository tests', function (){
		it('Add root comment', function (done){			
			commentRepository.add( "1", "Root comment", null, function (err, comment){			
				expect(err).to.be.null;
				expect(comment).to.be.not.null;			
				expect(comment.lft).to.be.equal(1);
				expect(comment.rgt).to.be.equal(2);
				rootNodeId = comment._id;
				done();
			});
		});

		it('Add child comment to empty node', function (done){
			commentRepository.add( "1", "Child 1 comment", rootNodeId, function (err, comment){
				
				expect(err).to.be.null;
				expect(comment).to.be.not.null;
				expect(comment.lft).to.be.equal(2);
				expect(comment.rgt).to.be.equal(3);

				commentRepository.findById(rootNodeId, function (err, rootComment){
					expect(err).to.be.null;
					expect(rootComment).to.be.not.null;	
					expect(rootComment.lft).to.be.equal(1);
					expect(rootComment.rgt).to.be.equal(4);				
					done();	
				});
				
			});
		});

		it('Add child comment to node with children', function (done){
			commentRepository.add( "1", "Child 2 comment", rootNodeId, function (err, comment){
				expect(err).to.be.null;
				expect(comment).to.be.not.null;
				expect(comment.lft).to.be.equal(4);
				expect(comment.rgt).to.be.equal(5);			
				
				commentRepository.findById(rootNodeId, function (err, rootComment){
					expect(err).to.be.null;
					expect(rootComment).to.be.not.null;	
					expect(rootComment.lft).to.be.equal(1);
					expect(rootComment.rgt).to.be.equal(6);				
					done();	
				});
			});
		});


	});

	describe('Comments API methods tests', function (){
				
		it('Add method with no txt returns 500', function (done){
			chai
				.request(apiBaseUrl)
				.post('/v1/api/comment/add')
				.send({})
				.end(function (err, response){										
     				expect(response).to.have.status(500);		     				
     				done();	
				});
		});

		it('Add method with no token returns 500', function (done) {
			chai
				.request(apiBaseUrl)
				.post('/v1/api/comment/add')
				.send({ txt: 'text' })
				.end(function (err, response){										
     				expect(response).to.have.status(500);		     				     			
     				expect(err.response.text.indexOf('Error: authorization header is not found', 0) === 0).to.be.true;
     				done();	
				});
		});	

		it('Add comment with authorized user creates a new comment', function (done){
			chai
					.request(apiBaseUrl)
					.post('/v1/api/login')
					.send({ username: 'user1', password:'pass123' })
					.end(function (err, response){	

						expect(err).to.be.null;							
	     				expect(response).to.have.status(200);     				
	     				expect(response.body.token).is.not.null;

	     				token = response.body.token;

	     				chai
							.request(apiBaseUrl)
							.post('/v1/api/comment/add')
							.send({ txt: 'text', parentCommentId: rootNodeId })
							.set('Authorization', 'Bearer ' + response.body.token)
							.end(function (err, response){										
								expect(err).to.be.null;
			     				expect(response).to.have.status(200);
			     				
			     				result = response.body;
			     				
								expect(result).to.be.not.null;	
								expect(result.lft).to.be.equal(6);
								expect(result.rgt).to.be.equal(7);					

			     				done();	

							});
	     				
					});
		});

		it('Add comment with authorized user but wrong parentCommentId returns 500', function (done){
			chai
				.request(apiBaseUrl)
				.post('/v1/api/comment/add')
				.send({ txt: 'text', parentCommentId: 1234 })
				.set('Authorization', 'Bearer ' + token)
				.end(function (err, response){										
					
					expect(err).to.be.not.null;
     				expect(response).to.have.status(500);
     				
     				result = response.body;
     				
					expect(result).to.be.not.null;	
					expect(result.result).to.be.false;
					expect(result.message).to.be.equal("Parent comment was not found");					

     				done();	

				});
		});
	});

	describe('Comments repository aggregation methods tests', function (){
		it('Test users comments amount calculating method.', function (done){
			commentRepository.getUsersByCommentsCount(function (err, result){
				expect(err).to.be.null;
				expect(result.length).to.be.equal(2);
				expect(result[0]._id).to.be.equal("1");
				expect(result[0].count).to.be.equal(3);
				expect(result[1]._id).to.be.not.equal("1");
				expect(result[1].count).to.be.equal(1);				
				done();
			})
		});

		it('Test nested level calculating method.', function (done){

			// Add some nested nodes
			commentRepository.add( "1", "Child 3 comment", rootNodeId, function (err, comment3){
				expect(err).to.be.null;
				expect(comment3).to.be.not.null;
				commentRepository.add( "1", "Child 3.1 comment", comment3._id, function (err, comment31){
					expect(err).to.be.null;
					expect(comment31).to.be.not.null;
					
					commentRepository.add( "1", "Child 3.1.1 comment", comment31._id, function (err, comment311){
						expect(err).to.be.null;
						expect(comment311).to.be.not.null;
						commentRepository.add( "1", "Child 3.1.1.1 comment", comment311._id, function (err, comment3111){
							expect(err).to.be.null;
							expect(comment3111).to.be.not.null;
							
							commentRepository.add( "1", "Child 3.1.2 comment", comment31._id, function (err, comment312){
								expect(err).to.be.null;
								expect(comment312).to.be.not.null;
							
								commentRepository.getMaxNestedLevel(function (err, level){
									expect(err).to.be.null;
									expect(level).to.be.equal(4);
									done();
								});
								
							});							
						});

					});
					
				});		
			});
		});
	});
		
});