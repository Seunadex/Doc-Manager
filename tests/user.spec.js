import chai from 'chai';
import request from 'supertest';
import app from '../server/server';

const expect = chai.expect;

describe('API Tests', () => {
  it('should return a message', (done) => {
    request(app)
      .get('/api/v1')
      .end((err, res) => {
        expect(res.body.message).to.equal('Welcome to Document Management System');
        expect('Content-Type', /json/);
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
  describe('Registration Tests', () => {
    it('should return the user if the name is valid', (done) => {
      request(app)
      .post('/api/v1/users')
      .send({ fullname: 'JoshMatz' })
      .end((err, res) => {
        expect(res.body.fullname).to.be.equal('JoshMatz');
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });
  });
});
