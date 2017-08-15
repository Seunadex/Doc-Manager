
import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../build/server';
import { passwordHash } from '../helper/helper';

const Role = require('../../build/models/index').Role;
const Document = require('../../build/models/index').Document;
const User = require('../../build/models/index').User;


const request = supertest.agent(app);
const adminToken = process.env.ADMIN_TOKEN;
const token = process.env.TOKEN;
const invalidToken = process.env.INVALID_TOKEN;

describe('Document controller', () => {
  beforeEach((done) => {
    Document.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
    .then(() => User.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true
    }))
    .then((err) => {
      if (!err) {
        Role.destroy({
          where: {},
          truncate: true,
          cascade: true,
          restartIdentity: true
        })
          .then((err) => {
            if (!err) {
              Role.bulkCreate([{
                name: 'admin'
              },
              {
                name: 'user'
              }]).then(() => {
                done();
              });
            }
          });
      }
    });
  });

  describe('Get documents: GET /api/v1/documents', () => {
    beforeEach((done) => {
      User.create({
        fullName: 'temi laj',
        username: 'temilaj',
        password: passwordHash('temilaj'),
        email: 'temilaj@email.com',
        roleId: 1
      }).then(() => {
        done();
      });
    });
    it('should return an error message on title conflict', (done) => {
      Document.create({
        title: 'test doc',
        content: 'test running it',
        access: 'public',
        userId: 1,
        roleId: 1
      })
        .then(() => {
        });
      request
        .post('/api/v1/documents')
        .send({
          title: 'test doc',
          content: 'testing testing 123',
          access: 'public',
          userId: 2,
          roleId: 1
        })
        .set('Authorization', adminToken)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.message).to.equal(
              'A document already exist with same title');
          done();
        });
    });

    it('should get all documents', (done) => {
      Document.create({
        title: 'test doc',
        content: 'test running it',
        access: 'public',
        userId: 1,
        roleId: 1
      })
        .then(() => {
        });
      request
        .get('/api/v1/documents')
        .set('Authorization', adminToken)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it('should return correct data given valid offset and limit', (done) => {
      Document.bulkCreate([{
        title: 'document one',
        content: 'just one document',
        access: 'public',
        userId: 1,
        roleId: 1,
      }, {
        title: 'document two',
        content: 'jkhfaskldjabksjd',
        access: 'public',
        userId: 1,
        roleId: 1,
      }, {
        title: 'document three',
        content: 'lkajksdhlvkdjsnlkd',
        access: 'public',
        userId: 1,
        roleId: 1,
      }]).then(() => {
        request
        .get('/api/v1/documents/?limit=2&offset=0')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    it('should return error with non-integer limit or offset', (done) => {
      request
        .get('/api/v1/documents/?limit=e&offset=t')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal(
              'limit and offset must be an integer');
          done();
        });
    });
    it('should return error for invalid token', (done) => {
      request
        .get('/api/v1/documents/?limit=2&offset=0')
        .set('Authorization', invalidToken)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Invalid token');
          done();
        });
    });
  });

  describe('Create document: POST /api/v1/documents', () => {
    beforeEach((done) => {
      const user = {
        fullName: 'george bush',
        username: 'georgebush',
        password: passwordHash('georgebush'),
        email: 'georgebush@gmail.com',
        roleId: 1
      };

      User.create(user).then(() => {
        done();
      });
    });

    it('should return error message for invalid input data', (done) => {
      const document = {
        title: '',
        content: '',
        access: ''
      };
      request
        .post('/api/v1/documents')
        .set('Authorization', adminToken)
        .send(document)
        .end((err, res) => {
          expect(res.body[0].msg).to.equal('Document title must be entered');
          expect(res.body[1].msg).to.equal('Content is required');
          expect(res.body[2].msg).to.equal('Access can not be an integer');
          expect(res.body[3].msg).to.equal('Access is required');
          done();
        });
    });
    it('should return an error for invalid access', (done) => {
      const document = {
        title: 'one title',
        content: 'still running some Tests',
        access: 'normal'
      };
      request
        .post('/api/v1/documents')
        .set('Authorization', adminToken)
        .send(document)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal(
              'Access field must be either PUBLIC, PRIVATE or ROLE');
          done();
        });
    });

    it('should create a new document', (done) => {
      const password = passwordHash('admin');
      User.create({
        fullName: 'admin',
        email: 'admin@admin.com',
        username: 'admin',
        password,
        roleId: 1
      }).then(() => {
        request
      .post('/api/v1/users/login')
      .send({
        username: 'admin',
        password: 'admin',
      })
      .expect(200)
      .end((err, res) => {
        const tokens = res.body.token;
        request
            .post('/api/v1/documents')
            .send({
              title: 'New doc',
              content: 'the future is now',
              access: 'public'
            })
            .set('Authorization', `${tokens}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
                .end((err, res) => {
                  expect(res.status).to.equal(201);
                  expect(res.body.document.id).to.equal(1);
                  expect(res.body.document.title).to.equal('New doc');
                  expect(res.body.document.content).to.equal(
                    'the future is now');
                  expect(res.body.document.access).to.equal('public');
                  expect(res.body.document.userId).to.equal(2);

                  done();
                });
      });
      });
    });
  });

  describe('Update document: PUT /api/v1/documents/:id', () => {
    beforeEach((done) => {
      User.bulkCreate([{
        fullName: 'tommy',
        username: 'tommy',
        password: passwordHash('tommy'),
        email: 'tommy@gmail.com',
        roleId: 1
      }, {
        fullName: 'funny name',
        username: 'funny',
        password: passwordHash('funny'),
        email: 'funny@gmail.com',
        roleId: 2
      }]).then(() => {
        done();
      });
    });

    it('should return an error message when document is not found', (done) => {
      request
        .put('/api/v1/documents/1')
        .set('Authorization', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Document not found');
          done();
        });
    });

    it('should return error for invalid document id', (done) => {
      request
        .put('/api/v1/documents/seun')
        .set('Authorization', token)
        .send({
          title: 'Test',
          content: 'Running Tests with invalid id',
          userId: 1,
          roleId: 1
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid document id');
          done();
        });
    });

    it('should update document with correct data ', (done) => {
      Document.create({
        title: 'Real test',
        content: 'This one should update',
        userId: 1,
        roleId: 1,
        access: 'public'
      })
        .then(() => {
        });

      request
        .put('/api/v1/documents/1')
        .set('Authorization', token)
        .send({
          title: 'Test',
          content: 'Running Tests with invalid id',
          userId: 1,
          roleId: 1
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.document.id).to.equal(1);
          expect(res.body.document.title).to.equal('Test');
          expect(res.body.document.content).to.equal(
              'Running Tests with invalid id');
          expect(res.body.document.access).to.equal('public');
          expect(res.body.document.userId).to.equal(1);
          done();
        });
    });

    it('should return an error message for id not a number', (done) => {
      request
        .put('/api/v1/documents/we')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid document id');
          done();
        });
    });
    it('should return error with a bad request', (done) => {
      const document = {
        title: 'Doc',
        content: 'document with invalid id',
        access: 'private',
        userId: 1,
        roleId: 1
      };
      Document.create(document).then(() => {
        request
          .put('/api/v1/documents/1012435787876776785756454')
          .set('Authorization', adminToken)
          .send({
            access: 'public',
          })
          .end((err, res) => {
            expect(res.status).to.equal(500);
            expect(res.body.message).to.equal(
                'Internal server error');
            done();
          });
      });
    });
  });

  describe('Search document: GET /api/v1/search/documents', () => {
    beforeEach((done) => {
      User.create({
        fullName: 'Oluwaseun Adekunle',
        username: 'spidey000',
        password: passwordHash('spidey'),
        email: 'spidey@gmail.com',
        roleId: 1
      }).then(() => {
        done();
      });
    });

    it('returns an array of documents if found', (done) => {
      Document.create({
        title: 'Search docs',
        content: 'Search documents routes test',
        access: 'public',
        userId: 1,
      }).then(() => {
      });

      request
        .get('/api/v1/search/documents/?q=S')
        .set('Authorization', adminToken)
        .end(() => {
          done();
        });
    });
  });

  describe('Get DocumentById: GET /api/v1/documents/:id', () => {
    beforeEach((done) => {
      User.bulkCreate([
        {
          username: 'doc man',
          fullName: 'John',
          password: passwordHash('johnny'),
          email: 'johnny@gmail.com',
          roleId: 1
        }, {
          username: 'cage',
          fullName: 'cage',
          password: passwordHash('johnny'),
          email: 'johnncagey@gmail.com',
          roleId: 2
        }
      ]).then(() => {
        done();
      });
    });

    it('should return document if found', (done) => {
      const password = passwordHash('blessed');
      User.create({
        fullName: 'blessing',
        email: 'blessing@blessing.com',
        username: 'blessed',
        password,
        roleId: 2
      }).then(() => {
        request
      .post('/api/v1/users/login')
      .send({
        username: 'blessed',
        password: 'blessed',
      })
      .expect(200)
       .end((err, res) => {
         const tokens = res.body.token;
         request
          .post('/api/v1/documents/')
          .send({
            title: 'title',
            content: 'content',
            access: 'public'
          })
           .set('Authorization', `${tokens}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .end(() => {
            request
            .get('/api/v1/documents/1')
            .set('Authorization', `${tokens}`)
            .set('Accept', 'application/json')
                .end((err, res) => {
                  expect(res.status).to.equal(200);
                  expect(res.body.document.id).to.equal(1);
                  expect(res.body.document.title).to.equal('title');
                  expect(res.body.document.content).to.equal('content');
                  expect(res.body.document.access).to.equal('public');
                  done();
                });
          });
       });
      });
    });
  });

  describe('Delete document: DELETE /api/v1/document/:id', () => {
    beforeEach((done) => {
      User.bulkCreate([
        {
          username: 'doc man',
          fullName: 'John',
          password: passwordHash('johnny'),
          email: 'johnny@gmail.com',
          roleId: 1
        }, {
          username: 'cage',
          fullName: 'cage',
          password: passwordHash('johnny'),
          email: 'johnncagey@gmail.com',
          roleId: 2
        }
      ]).then(() => {
        done();
      });
    });

    it('should return error for invalid document id', (done) => {
      request
        .delete('/api/v1/documents/seun')
        .set('Authorization', token)
        .send({
          title: 'Test',
          content: 'Running Tests with invalid id',
          userId: 1,
          roleId: 1
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid document id');
          done();
        });
    });

    it('should return error for non-existing document', (done) => {
      request
        .delete('/api/v1/documents/2')
        .set('Authorization', token)
        .send({
          title: 'Test',
          content: 'Running Tests with unavailable id',
          userId: 1,
          roleId: 1
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Document does not exist');
          done();
        });
    });

    it('should return error for non-existing document', (done) => {
      Document.create({
        title: 'DELETE',
        content: 'this document will be deleted soon, maybe not',
        access: 'public',
        userId: 1,
        roleId: 1
      }).then(() => {
        request
        .delete('/api/v1/documents/4586580090997876757645745')
        .set('Authorization', adminToken)
        .send({
          title: 'Test',
          content: 'Running Tests with valid id',
          userId: 1,
          roleId: 1
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal(
              'Server error, please try again');
          done();
        });
      });
    });

    it('should return a message indicating a document deleted', (done) => {
      Document.create({
        title: 'DELETE',
        content: 'this document will be deleted soon',
        access: 'public',
        userId: 1,
        roleId: 1
      })
        .then(() => {
          request
            .delete('/api/v1/documents/1')
            .set('Authorization', adminToken)
            .end((err, res) => {
              expect(res.status).to.equal(200);
              expect(res.body.message).to.equal(
                  'Document succesfully deleted');
              done();
            });
        });
    });
  });
});

