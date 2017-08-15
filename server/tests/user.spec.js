import { expect } from 'chai';
import supertest from 'supertest';
import { passwordHash } from '../helper/helper';
import app from '../../build/server';
import { User, Document, Role } from '../models';

const adminToken = process.env.ADMIN_TOKEN;
const token = process.env.TOKEN;
const invalidToken = process.env.INVALID_TOKEN;

const request = supertest.agent(app);

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
      User.create({
        fullName: 'seun adekunle',
        username: 'seunadex',
        password: passwordHash('seunadex'),
        email: 'seunadex@gmail.com',
        roleId: 1
      }).then(() => {
        done();
      });
    });
    it('should return error with incomplete user details', (done) => {
      const userDetails = {
        fullName: '',
        username: '',
        password: '',
        email: 'seun@gmail.com'
      };
      request
      .post('/api/v1/users')
      .set('Authorization', adminToken)
      .set('Accept', 'application/json')
      .send(userDetails)
      .end((err, res) => {
        if (!err) {
          expect(res.status).to.equal(400);
          expect(res.body[0].msg).to.equal('Fullname is required');
          expect(res.body[1].msg).to.equal('username is required');
          expect(res.body[2].msg).to.equal('password is required');
        }
        done();
      });
    });

    it('should return error when user already exist', (done) => {
      const userDetails = {
        fullName: 'seun adekunle',
        username: 'seunadex',
        password: passwordHash('seunadex'),
        email: 'seunadex@gmail.com',
        roleId: 1
      };
      request
      .post('/api/v1/users')
      .set('Authorization', adminToken)
      .set('Accept', 'application/json')
      .send(userDetails)
      .end((err, res) => {
        if (!err) {
          expect(res.status).to.equal(409);
          expect(res.body.message).to.equal('User credentials already exist');
        }
        done();
      });
    });

    it('should post valid user details', (done) => {
      const userDetails = {
        fullName: 'lionel messi',
        username: 'lionelmessi',
        password: passwordHash('lionelmessi'),
        email: 'lionelmessi@gmail.com',
      };
      request
      .post('/api/v1/users')
      .send(userDetails)
      .end((err, res) => {
        if (!err) {
          expect(res.status).to.equal(201);
          expect(res.body.userDetails.id).to.equal(2);
          expect(res.body.userDetails.roleId).to.equal(2);
          expect(res.body.userDetails.fullName).to.equal('lionel messi');
          expect(res.body.userDetails.username).to.equal('lionelmessi');
          expect(res.body.userDetails.email).to.equal('lionelmessi@gmail.com');
          expect(res.body).to.have.property('token');
        }
        done();
      });
    });
  });

  describe('Login: POST /api/users/login', () => {
    beforeEach((done) => {
      User.bulkCreate([{
        fullName: 'cristiano ronaldo',
        username: 'cr7',
        password: passwordHash('ronaldo'),
        email: 'cr7@gmail.com',
        roleId: 1
      }, {
        fullName: 'kun aguero',
        username: 'sergioaguero',
        password: passwordHash('aguero'),
        email: 'kunaguero@gmail.com',
        roleId: 2
      }]).then(() => {
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
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('User not found');
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
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('Incorrect password');
        done();
      });
    });

    it('should respond with a 200 for a valid login request', (done) => {
      request
      .post('/api/v1/users/login')
      .send({
        username: 'sergioaguero',
        password: 'aguero',
      })
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.User.fullName).to.equal('kun aguero');
        expect(res.body.User.username).to.equal('sergioaguero');
        expect(res.body.User.email).to.equal('kunaguero@gmail.com');
        expect(res.body.User.role).to.equal(2);
        expect(res.body.User).to.have.property('createdAt');
        done();
      });
    });
  });

  describe('GET /api/v1/users/:id', () => {
    beforeEach((done) => {
      User.create({
        fullName: 'jesse lingard',
        username: 'jesse14',
        password: passwordHash('jesselingard'),
        email: 'jesse14@gmail.com',
        roleId: 2
      }).then(() => {
        done();
      });
    });

    it('should get a particular user by id', (done) => {
      request
        .get('/api/v1/users/1')
        .set('Authorization', adminToken)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.id).to.equal(1);
          expect(res.body.fullName).to.equal('jesse lingard');
          expect(res.body.username).to.equal('jesse14');
          expect(res.body.email).to.equal('jesse14@gmail.com');
          expect(res.body.role).to.equal(2);
          done();
        });
    });
    it('should return error message when viewing unauthorized page', (done) => {
      request
        .get('/api/v1/users/1')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.body.message).to.equal(
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
        .end((err, res) => {
          expect(res.body.message).to.equal('Invalid token');
          expect(res.status).to.equal(401);
          done();
        });
      done();
    });

    it('should return error 404 when user not found', (done) => {
      request
        .get('/api/v1/users/33')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('should return error with param not an integer', (done) => {
      request
        .get('/api/v1/users/sd')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('id must be a number');
          done();
        });
    });

    it('should return error with invalid param', (done) => {
      request
        .get('/api/v1/users/376519826565019825012875')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal('Internal server error');
          done();
        });
    });
  });

  describe('GET /api/v1/users/:id/documents', () => {
    beforeEach((done) => {
      User.bulkCreate([{
        fullName: 'antonio valencia',
        username: 'valencia',
        password: passwordHash('valencia'),
        email: 'valencia@gmail.com',
        roleId: 1
      }, {
        fullName: 'paul pogba',
        username: 'pogback',
        password: passwordHash('pogback'),
        email: 'pogback6@gmail.com',
        roleId: 2
      }]).then(() => {
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
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('should return error on invalid id', (done) => {
      request
        .get('/api/v1/users/dd/documents')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('id must be a number');
          done();
        });
    });
    it('should return all documents belonging to a user', (done) => {
      request
        .get('/api/v1/users/1/documents')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.documents[0].id).to.equal(2);
          expect(res.body.documents[1].title).to.equal('testing');
          expect(res.body.documents[2].content).to.equal(
            'just testing this stuff');
          expect(res.body.documents[1].access).to.equal('public');
          done();
        });
    });
    it('should return error message when user has no document', (done) => {
      request
        .get('/api/v1/users/2/documents')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message).to.equal('No document found for this user');
          done();
        });
    });
  });

  describe('GET /api/v1/users', () => {
    beforeEach((done) => {
      User.bulkCreate([{
        fullName: 'delima ronaldo',
        username: 'ronaldo9',
        password: passwordHash('ronaldo'),
        email: 'ronaldo9@gmail.com',
        roleId: 1
      }, {
        fullName: 'robin hood',
        username: 'robinhood',
        password: passwordHash('robinhood'),
        email: 'robinhood@gmail.com',
        roleId: 2
      }]).then(() => {
        done();
      });
    });
    it('should return error with incorrect data', (done) => {
      request
        .get('/api/v1/users/?limit=yu&offset=0')
        .set({ Authorization: token })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal(
            'limit and offset must be an integer');
          done();
        });
    });

    it('should return correct data with valid limit and offset', (done) => {
      request
        .get('/api/v1/users/?limit=3&offset=0')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should return a 403 status with no token set', (done) => {
      request
        .get('/api/v1/users')
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal(
            'Oops! You are not authenticated, Please Log in');
          done();
        });
    });
  });

  describe('GET /api/v1/search/users', () => {
    beforeEach((done) => {
      User.create({
        fullName: 'just me',
        username: 'justme',
        password: passwordHash('seunadekunle'),
        email: 'justme@gmail.com',
        roleId: 2
      }).then(() => {
        done();
      });
    });
    it('should return an array of users if found', (done) => {
      request
        .get('/api/v1/search/users/?q=just')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.count).to.be.greaterThan(0);
          expect(res.body.userList.length).to.be.greaterThan(0);
          expect(res.body.userList[0].username).to.equal('justme');
          expect(res.body.userList[0].fullName).to.equal('just me');
          expect(res.body.userList[0]).to.have.property('createdAt');
          done();
        });
    });

    it('should return an error for invalid token', (done) => {
      request
        .get('/api/v1/search/users/?q=just')
        .set('Authorization', invalidToken)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Invalid token');
          done();
        });
    });
    it('should return an empty array if user is not found', (done) => {
      request
        .get('/api/v1/search/users/?q=hgjvqwhgj')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.userList).to.eqls([]);
          done();
        });
    });
  });

  describe('Update user: PUT /api/v1/users/:id', () => {
    beforeEach((done) => {
      User.create({
        fullName: 'adekunle oladele',
        username: 'eldee',
        password: passwordHash('eldee'),
        email: 'eldee@gmail.com',
      }).then(() => {
        done();
      });
    });
    it('should return error message on email/username conflict', (done) => {
      const password = passwordHash('jack');
      User.create({
        fullName: 'jabdjkhdb',
        email: 'daniel@daniel.com',
        username: 'daniel',
        password,
      }).then(() => {
        request
        .post('/api/v1/users/login')
        .send({
          username: 'daniel',
          password: 'jack',
        })
        .expect(200)
        .end((err, res) => {
          const tokens = res.body.token;
          request
              .put('/api/v1/users/2')
              .send({
                email: 'eldee@gmail.com',
              })
              .set('Authorization', `${tokens}`)
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
                  .end((err, res) => {
                    expect(res.status).to.equal(409);
                    expect(res.body.message).to.equal(
                      'A user exist with same email or username');
                    done();
                  });
        });
      });
    });

    it('should return message for user not found', (done) => {
      User.create({
        fullName: 'seun',
        email: 'seun@admin.com',
        username: 'seun',
        password: passwordHash('seun'),
        roleId: 1
      }).then(() => {
        request
          .post('/api/v1/users/login')
          .send({
            username: 'seun',
            password: 'seun',
          })
      .expect(400)
      .end((err, res) => {
        const tokens = res.body.token;
        request
          .put('/api/v1/users/2')
          .set('Authorization', `${tokens}`)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            if (!err) {
              expect(res.status).to.equal(404);
              expect(res.body.message).to.equal('User not found');
            }
            done();
          });
      });
      });
    });

    it('should return error for invalid param', (done) => {
      request
        .put('/api/v1/users/hh')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.body.message).to.equal('Id must be a number');
          done();
        });
    });

    it('returns error on unauthorized access', (done) => {
      User.bulkCreate([{
        username: 'firstuser',
        fullName: 'firstuser',
        password: passwordHash('test'),
        email: 'firstuser@gmail.com',
        roleId: 1,
      }, {
        username: 'seconduser',
        fullName: 'seconduser',
        password: passwordHash('test'),
        email: 'seconduser@yahoo.com',
        roleId: 2,
      }])
        .then(() => {
          request
            .put('/api/v1/users/2')
            .set('Authorization', adminToken)
            .send({
              username: 'moses',
            })
            .end((err, res) => {
              expect(res.status).to.equal(403);
              expect(res.body.message).to.equal(
                'Oops! You are not allowed to update the user');
              done();
            });
        });
    });
  });

  describe('DELETE user: /api/v1/users', () => {
    beforeEach((done) => {
      User.create({
        fullName: 'new user',
        username: 'newuser',
        password: passwordHash('newuser'),
        email: 'newuser@gmail.com',
        roleId: 2
      }).then(() => {
        done();
      });
    });

    it('should return an error on unauthorized access', (done) => {
      request
        .delete('/api/v1/users/1')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal(
              'You Are not authorized to delete this user');
          done();
        });
    });

    it('should return an error 404 for user not found', (done) => {
      request
        .delete('/api/v1/users/10')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });
    it('should return an error for bad request', (done) => {
      request
        .delete('/api/v1/users/10876529837465908475874659485764')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal('Internal server error');
          done();
        });
    });

    it('should delete a user by id', (done) => {
      request
        .delete('/api/v1/users/1')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal(
              'User successfully deleted');
          done();
        });
    });
  });
});
