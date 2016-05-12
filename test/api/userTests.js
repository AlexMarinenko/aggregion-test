var config = require('config');
var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

chai.use(chaiHttp);

var apiBaseUrl = 'http://localhost:9090';

var token;

describe('Users functions tests', function () {

    it('Get users ordered by comments count', function (done) {
        chai
            .request(apiBaseUrl)
            .post('/v1/api/login')
            .send({username: 'user1', password: 'pass123'})
            .end(function (err, response) {

                expect(err).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body.token).is.not.null;

                token = response.body.token;

                chai
                    .request(apiBaseUrl)
                    .get('/v1/api/user/list/byCommentsCount')
                    .send()
                    .set('Authorization', 'Bearer ' + response.body.token)
                    .end(function (err, response) {

                        expect(err).to.be.null;
                        expect(response).to.have.status(200);

                        result = response.body;

                        expect(result).to.be.not.null;
                        expect(result.length).to.be.equal(2);
                        expect(result[0].count).to.be.equal(8);
                        expect(result[1].count).to.be.equal(1);

                        done();

                    });

            });
    });

});