import { expect } from 'chai';
import supertest from 'supertest';
import { passwordHash } from '../helper/helper';
import app from '../../build/server';
import { User, Document, Role } from '../models';
import userHelpers from './testHelpers/userHelpers';
import jwtHelper from '../helper/jwtHelper';

const invalidToken = process.env.INVALID_TOKEN;
const request = supertest.agent(app);
const {
  validAdmin,
  incompleteData,
  validUser,
  userOne,
  userTwo,
  userThree } = userHelpers;
const adminToken = jwtHelper(validAdmin);
const token = jwtHelper(validUser);

describe('User controllers', () => {
  beforeEach((done) => {
    User.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true
    }).then((err) => {
      if (!err) {
        Role
          .destroy({
            where: {},
            truncate: true,
            cascade: true,
            restartIdentity: true
          }).then((err) => {
            if (!err) {
              Role.bulkCreate([
                {
                  name: 'admin'
                },
                {
                  name: 'regular'
                }
              ]).then(() => {
                done();
              });
            }
          });
      }
    });
  });
  describe('Signup: POST /api/v1/users', () => {
    beforeEach((done) => {
      User.create(validAdmin).then(() => {
        done();
      });
    });
    it('should return error with empty input field', (done) => {
      request
      .post('/api/v1/users')
      .set('Authorization', adminToken)
      .set('Accept', 'application/json')
      .send(incompleteData)
      .end((err, response) => {
        expect(response.status).to.equal(400);
        expect(response.body[0].msg).to.equal('Fullname is required');
        expect(response.body[1].msg).to.equal('username is required');
        expect(response.body[2].msg).to.equal('password is required');
        done();
      });
    });

    it('should return error 409 when user already exist', (done) => {
      request
      .post('/api/v1/users')
      .set('Authorization', adminToken)
      .set('Accept', 'application/json')
      .send(validAdmin)
      .end((err, response) => {
        expect(response.status).to.equal(409);
        expect(response.body.message).to.equal(
          'User credentials already exist');
        done();
      });
    });

    it('should signup successfully with valid user details', (done) => {
      request
      .post('/api/v1/users')
      .send(validUser)
      .end((err, response) => {
        expect(response.status).to.equal(201);
        expect(response.body.userDetails.id).to.equal(2);
        expect(response.body.userDetails.roleId).to.equal(2);
        expect(response.body.userDetails.fullName).to.equal('lionel messi');
        expect(response.body.userDetails.username).to.equal('lionelmessi');
        expect(response.body.userDetails.email).to.equal(
          'lionelmessi@gmail.com');
        expect(response.body).to.have.property('token');
        done();
      });
    });
  });

  describe('Login: POST /api/users/login', () => {
    beforeEach((done) => {
      User.bulkCreate([userOne, userTwo]).then(() => {
        done();
      });
    });

    it('should return error with invalid details', (done) => {
      request
      .post('/api/v1/users/login')
      .send({
        username: '',
        password: passwordHash('ronald')
      })
      .set('Accept', 'application/json')
      .end((err, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('User not found');
        done();
      });
    });

    it('should return error with incorrect password', (done) => {
      request
      .post('/api/v1/users/login')
      .send({
        username: 'cr7',
        password: passwordHash('ronald')
      })
      .set('Accept', 'application/json')
      .end((err, response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Incorrect password');
        done();
      });
    });

    it('should respond with a 200 status code for a valid login request',
    (done) => {
      request
      .post('/api/v1/users/login')
      .send({
        username: 'sergioaguero',
        password: 'aguero',
      })
      .expect(200)
      .end((err, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.User.fullName).to.equal('kun aguero');
        expect(response.body.User.username).to.equal('sergioaguero');
        expect(response.body.User.email).to.equal('kunaguero@gmail.com');
        expect(response.body.User.role).to.equal(2);
        expect(response.body.User).to.have.property('createdAt');
        done();
      });
    });
  });

  describe('GET /api/v1/users/:id', () => {
    beforeEach((done) => {
      User.create(userThree).then(() => {
        done();
      });
    });

    it('should get a particular user by its id', (done) => {
      request
        .get('/api/v1/users/1')
        .set('Authorization', adminToken)
        .set('Accept', 'application/json')
        .end((err, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(1);
          expect(response.body.fullName).to.equal('jesse lingard');
          expect(response.body.username).to.equal('jesse14');
          expect(response.body.email).to.equal('jesse14@gmail.com');
          expect(response.body.role).to.equal(2);
          done();
        });
    });
    it('should return error message when viewing unauthorized page', (done) => {
      request
        .get('/api/v1/users/1')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .end((err, response) => {
          expect(response.status).to.equal(401);
          expect(response.body.message).to.equal(
              'Oops, You are not allowed to view this page');
          done();
        });
    });


    it('should return an error message for invalid token', (done) => {
      request
        .get('/api/v1/users/3')
        .set('Authorization', invalidToken)
        .set('Accept', 'application/json')
        .expect(401)
        .end((err, response) => {
          expect(response.body.message).to.equal('Invalid token');
          expect(response.status).to.equal(401);
          done();
        });
      done();
    });

    it('should return error 404 when user not found', (done) => {
      request
        .get('/api/v1/users/33')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.status).to.equal(404);
          expect(response.body.message).to.equal('User not found');
          done();
        });
    });

    it('should return error with param not an integer', (done) => {
      request
        .get('/api/v1/users/sd')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal('id must be a number');
          done();
        });
    });

    it('should return error with invalid param', (done) => {
      request
        .get('/api/v1/users/376519826565019825012875')
        .set('Authorization', token)
        .end((err, response) => {
          expect(response.status).to.equal(500);
          expect(response.body.message).to.equal('Internal server error');
          done();
        });
    });
  });

  describe('GET /api/v1/users/:id/documents', () => {
    beforeEach((done) => {
      User.bulkCreate([userOne, userTwo]).then(() => {
        Document.create({
          title: 'testing',
          content: 'just testing this stuff',
          userId: 1,
          roleId: 1,
          access: 'public'
        })
          .then(() => {
            done();
          });
      });
    });

    it('should return error on non-existing input param', (done) => {
      request
        .get('/api/v1/users/33/documents')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.status).to.equal(404);
          expect(response.body.message).to.equal('User not found');
          done();
        });
    });

    it('should return error on invalid id', (done) => {
      request
        .get('/api/v1/users/dd/documents')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal('id must be a number');
          done();
        });
    });
    it('should successfully return all documents belonging to a user',
    (done) => {
      request
        .get('/api/v1/users/1/documents')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.documents[0].id).to.equal(2);
          expect(response.body.documents[1].title).to.equal('testing');
          expect(response.body.documents[2].content).to.equal(
            'just testing this stuff');
          expect(response.body.documents[1].access).to.equal('public');
          done();
        });
    });
    it('should return error message when user has no document', (done) => {
      request
        .get('/api/v1/users/2/documents')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.body.message).to.equal(
            'No document found for this user');
          done();
        });
    });
  });

  describe('GET /api/v1/users', () => {
    beforeEach((done) => {
      User.bulkCreate([userOne, userTwo]).then(() => {
        done();
      });
    });
    it('should return error with incorrect data', (done) => {
      request
        .get('/api/v1/users/?limit=yu&offset=0')
        .set({ Authorization: token })
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal(
            'limit and offset must be an integer');
          done();
        });
    });

    it('should return correct data with valid limit and offset', (done) => {
      request
        .get('/api/v1/users/?limit=3&offset=0')
        .set({ Authorization: adminToken })
        .end((err, response) => {
          expect(response.status).to.equal(200);
          done();
        });
    });

    it('should return a 403 status with no token set', (done) => {
      request
        .get('/api/v1/users')
        .set('Accept', 'application/json')
        .end((err, response) => {
          expect(response.status).to.equal(401);
          expect(response.body.message).to.equal(
            'Oops! You are not authenticated, Please Log in');
          done();
        });
    });
  });

  describe('GET /api/v1/search/users', () => {
    beforeEach((done) => {
      User.create(userOne).then(() => {
        done();
      });
    });
    it('should return an array of users if found', (done) => {
      request
        .get('/api/v1/search/users/?q=cr')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.count).to.be.greaterThan(0);
          expect(response.body.userList.length).to.be.greaterThan(0);
          expect(response.body.userList[0].username).to.equal('cr7');
          expect(response.body.userList[0].fullName).to.equal(
            'cristiano ronaldo');
          expect(response.body.userList[0]).to.have.property('createdAt');
          done();
        });
    });

    it('should return an error for invalid token', (done) => {
      request
        .get('/api/v1/search/users/?q=just')
        .set('Authorization', invalidToken)
        .end((err, response) => {
          expect(response.status).to.equal(401);
          expect(response.body.message).to.equal('Invalid token');
          done();
        });
    });
    it('should return an empty array if user is not found', (done) => {
      request
        .get('/api/v1/search/users/?q=hgjvqwhgj')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.userList).to.eqls([]);
          done();
        });
    });
  });

  describe('Update user: PUT /api/v1/users/:id', () => {
    beforeEach((done) => {
      User.create(userThree).then(() => {
        done();
      });
    });
    it('should return error message on email/username conflict', (done) => {
      User.create(userTwo).then(() => {
        request
        .post('/api/v1/users/login')
        .send({
          username: 'sergioaguero',
          password: 'aguero',
        })
        .expect(200)
        .end((err, response) => {
          const tokens = response.body.token;
          request
              .put('/api/v1/users/2')
              .send({
                email: 'jesse14@gmail.com',
              })
              .set('Authorization', `${tokens}`)
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
                  .end((err, response) => {
                    expect(response.status).to.equal(409);
                    expect(response.body.message).to.equal(
                      'A user exist with same email or username');
                    done();
                  });
        });
      });
    });

    it('should return message for user not found', (done) => {
      request
          .put('/api/v1/users/2')
          .set('Authorization', token)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, response) => {
            if (!err) {
              expect(response.status).to.equal(404);
              expect(response.body.message).to.equal('User not found');
            }
            done();
          });
    });

    it('should return error for invalid param', (done) => {
      request
        .put('/api/v1/users/hh')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.body.message).to.equal('Id must be a number');
          done();
        });
    });

    it('returns error on unauthorized access', (done) => {
      User.bulkCreate([userOne, userTwo])
        .then(() => {
          request
            .put('/api/v1/users/2')
            .set('Authorization', adminToken)
            .send({
              username: 'moses',
            })
            .end((err, response) => {
              expect(response.status).to.equal(403);
              expect(response.body.message).to.equal(
                'Oops! You are not allowed to update the user');
              done();
            });
        });
    });
  });

  describe('DELETE user: /api/v1/users', () => {
    beforeEach((done) => {
      User.create(userThree).then(() => {
        done();
      });
    });

    it('should return an error on unauthorized access', (done) => {
      request
        .delete('/api/v1/users/1')
        .set('Authorization', token)
        .end((err, response) => {
          expect(response.status).to.equal(403);
          expect(response.body.message).to.equal(
              'You Are not authorized to delete this user');
          done();
        });
    });

    it('should return an error 404 for user not found', (done) => {
      request
        .delete('/api/v1/users/10')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.status).to.equal(404);
          expect(response.body.message).to.equal('User not found');
          done();
        });
    });
    it('should return an error for bad request', (done) => {
      request
        .delete('/api/v1/users/10876529837465908475874659485764')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.status).to.equal(500);
          expect(response.body.message).to.equal('Internal server error');
          done();
        });
    });

    it('should delete a user by id', (done) => {
      request
        .delete('/api/v1/users/1')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.message).to.equal(
              'User successfully deleted');
          done();
        });
    });
  });
});
