import { expect } from 'chai';
import supertest from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../build/server';

const User = require('../models/').User;
const Document = require('../models').Document;
const Role = require('../models').Role;

const adminToken = process.env.ADMIN_TOKEN;
const token = process.env.TOKEN;
const invalidToken = process.env.INVALID_TOKEN;

const request = supertest.agent(app);

describe('User Controller ', () => {
  beforeEach((done) => {
    Role.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true
    }).then((error) => {
      if (!error) {
        Document
          .destroy({
            where: {},
            truncate: true,
            cascade: true,
            restartIdentity: true
          })
          .then((err) => {
            if (!err) {
              User.destroy({
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
                  ]).then((err) => {
                    if (!err) {
                      //
                    }
                    done();
                  });
                }
              });
            }
          });
      }
    });
  });

  // Create a new user
  describe('Signup route', () => {
    it('Creates a new user', (done) => {
      request
      .post('/api/v1/users/')
      .send({
        fullname: 'Seun Adekunle',
        email: 'seunadekunle@gmail.com',
        username: 'seunadex',
        password: bcrypt.hashSync('seunadekunle', bcrypt.genSaltSync(10)),
        RoleId: 2
      })
      .expect(201)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        done();
      });
    });

    it('should not create a user when email is invalid',
    (done) => {
      request.post('/api/v1/users/')
        .send({
          fullname: 'seun adekunle',
          username: 'seunadex',
          password: 'seunadekunle',
          email: 'seunadekunle.com',
          RoleId: 2
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error.email).to.equal('Invalid email');
          done();
        });
    });
  });

  // Login user
  describe('Login route:', () => {
    it('should respond with a 200 to a valid login request', (done) => {
      User.create({
        fullname: 'john doe',
        email: 'johndoe@gmail.com',
        username: 'johndoe',
        password: bcrypt.hashSync('johndoe', bcrypt.genSaltSync(10)),
        RoleId: 2
      }).then(() => {
        request
      .post('/api/v1/users/login')
      .send({
        username: 'johndoe',
        password: 'johndoe',
      })
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Token generated. Login Successful');
        done();
      });
      });
    });

    it('should respond with a 400 to an incorrect password', (done) => {
      User.create({
        fullname: 'john doe',
        email: 'johndoe@gmail.com',
        username: 'johndoe',
        password: bcrypt.hashSync('johndoe', bcrypt.genSaltSync(10)),
        RoleId: 2
      }).then(() => {
        request
      .post('/api/v1/users/login')
      .send({
        username: 'johndoe',
        password: 'johndo',
      })
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Incorrect password');
        done();
      });
      });
    });

    it('should respond with error message 400 with incorrect credentials', (done) => {
      User.create({
        fullname: 'john doe',
        email: 'johndoe@gmail.com',
        username: 'johndoe',
        password: bcrypt.hashSync('johndo', bcrypt.genSaltSync(10)),
        RoleId: 2
      }).then(() => {
        request
      .post('/api/v1/users/login')
      .send({
        username: 35635454,
        password: 'johndo',
      })
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        console.log(res.body.message);
        // expect(res.body.message).to.equal('Incorrect password');
        done();
      });

        request
        .post('/api/v1/users/login')
        .send({
          username: 'dshfnb',
          password: 'johndo',
        })
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('User not found');
          done();
        });
      });
    });
  });

  // list all users
  describe('GET: (/api/v1/users) - ', () => {
    it('should return all users, if user is admin', (done) => {
      request.get('/api/v1/users')
          .set({ Authorization: adminToken })
          .end((error, res) => {
            expect(res.status).to.equal(200);
            expect(Array.isArray(res.body.users));
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
  });

  // Get use by Id
  describe('GET: /api/v1/users/:id', () => {
    it('should return a particular user based on the ID provided in params', (done) => {
      request
      .post('/api/v1/users/')
      .send({
        fullname: 'daniel amah',
        email: 'daniel@daniel.com',
        username: 'daniel',
        password: 'daniel',
        RoleId: 2
      })
      .expect(201)
      .end((err, res) => {
        request
          .get('/api/v1/users/2')
          .set('Authorization', adminToken)
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(typeof (res.body)).to.equal('object');
            done();
          });
        done();
      });
    });
    it('should return an error message if user is not found', (done) => {
      request
          .get('/api/v1/users/100')
          .set('Authorization', adminToken)
          .set('Accept', 'application/json')
          .expect(404)
          .end((err, res) => {
            expect(res.body.message).to.equal('User not found');
            expect(typeof (res.body)).to.equal('object');
            done();
          });
      done();
    });
    it('returns an error message for invalid input parameter', (done) => {
      request
          .get('/api/v1/users/dd')
          .set('Authorization', adminToken)
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.message).to.equal('id must be a number');
            expect(typeof (res.body)).to.equal('object');
            expect(res.body.status).to.equal('error');
            done();
          });
      done();
    });

    it('should return an error message for invalid token', (done) => {
      request
          .get('/api/v1/users/3')
          .set('Authorization', invalidToken)
          .set('Accept', 'application/json')
          .expect(401)
          .end((err, res) => {
            console.log(res.body);
            expect(res.body.message).to.equal('Invalid token');
            expect(typeof (res.body)).to.equal('object');
            expect(res.status).to.equal(401);
            done();
          });
      done();
    });
    it('returns an error message for user not signed in', (done) => {
      request
          .get('/api/v1/users/d')
          .set('Accept', 'application/json')
          .expect(403)
          .end((err, res) => {
            expect(res.body.message).to.equal('Please Login');
            expect(typeof (res.body)).to.equal('object');
            expect(res.status).to.equal(403);
            done();
          });
      done();
    });
  });

  // Update user
  describe("PUT '/api/v1/users/:id'", () => {
    beforeEach((done) => {
      User.bulkCreate([{
        username: 'admin',
        fullname: 'Administrator',
        email: 'admin@admin.com',
        password: bcrypt.hashSync('admin', bcrypt.genSaltSync(10)),
        RoleId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        username: 'seunadex',
        fullname: 'Seun Adekunle',
        email: 'seunadekunle@gmail.com',
        password: bcrypt.hashSync('seunadekunle', bcrypt.genSaltSync(10)),
        RoleId: '2',
        createdAt: new Date(),
        updatedAt: new Date()
      }]).then(() => {
        done();
      });
    });

    it('should return error if id is not a number', (done) => {
      request
      .put('/api/v1/users/ew')
      .set('Authorization', adminToken)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('Access denied');
        done();
      });
    });

    it('should return error unauthorized access', (done) => {
      request
      .put('/api/v1/users/1')
      .set('Authorization', token)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('Access denied');
        done();
      });
    });
  });

  // search for users
  describe('', () => {
    beforeEach((done) => {
      User.create({
        fullname: 'just me',
        username: 'justme',
        password: bcrypt.hashSync('seunadekunle', bcrypt.genSaltSync(10)),
        email: 'justme@gmail.com',
        RoleId: 1
      }).then((err) => {
        if (!err) {
          //
        }
        done();
      });
    });
    it('returns an empty array if user is not found', (done) => {
      request
        .get('/api/v1/search/users/?q=hgjvqwhgj')
        .set('Authorization', adminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('OK');
            expect(res.body.userList).to.eqls([]);
          }
          request
        .get('/api/v1/search/users/?q=seun')
        .set('Authorization', adminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.userList.length).to.equal(0);
          }
          done();
        });
        });
    });
  });
});
