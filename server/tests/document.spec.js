
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
              }]).then((err) => {
                if (!err) {
                  //
                }
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
        fullname: 'temi laj',
        username: 'temilaj',
        password: passwordHash('temilaj'),
        email: 'temilaj@email.com',
        RoleId: 1
      }).then((err) => {
        if (!err) {
          //
        }
        done();
      });
    });

    it('should get all documents', (done) => {
      Document.create({
        title: 'test doc',
        content: 'test running it',
        access: 'public',
        UserId: 1,
        RoleId: 1
      })
        .then(() => {
          //
        });

      request
        .get('/api/v1/documents')
        .set('Authorization', adminToken)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
          }
          done();
        });
    });

    it('should return correct data given valid offset and limit', (done) => {
      Document.bulkCreate([{
        title: 'document one',
        content: 'just one document',
        access: 'public',
        UserId: 1,
        RoleId: 1,
      }, {
        title: 'document two',
        content: 'jkhfaskldjabksjd',
        access: 'public',
        UserId: 1,
        RoleId: 1,
      }, {
        title: 'document three',
        content: 'lkajksdhlvkdjsnlkd',
        access: 'public',
        UserId: 1,
        RoleId: 1,
      }]).then(() => {
        //
      });

      request
        .get('/api/v1/documents/?limit=2&offset=0')
        .set('Authorization', adminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
          }
          done();
        });
    });

    it('should return error with non-integer limit or offset', (done) => {
      Document.bulkCreate([{
        title: 'document one',
        content: 'just one document',
        access: 'public',
        UserId: 1,
        RoleId: 1,
      }, {
        title: 'document two',
        content: 'jkhfaskldjabksjd',
        access: 'public',
        UserId: 1,
        RoleId: 1,
      }, {
        title: 'document three',
        content: 'lkajksdhlvkdjsnlkd',
        access: 'public',
        UserId: 1,
        RoleId: 1,
      }]).then(() => {
        //
      });
      request
        .get('/api/v1/documents/?limit=e&offset=t')
        .set('Authorization', adminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('limit and offset must be an integer');
          }
          done();
        });
    });
    it('should return error for unauthorized access', (done) => {
      request
        .get('/api/v1/documents/?limit=2&offset=0')
        .set('Authorization', token)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(403);
            expect(res.body.message).to.equal('Only Admin permitted');
          }
          done();
        });
    });
    it('should return error for invalid token', (done) => {
      request
        .get('/api/v1/documents/?limit=2&offset=0')
        .set('Authorization', invalidToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(401);
            expect(res.body.message).to.equal('Invalid token');
          }
          done();
        });
    });
  });

  describe('Create document: POST /api/v1/documents', () => {
    beforeEach((done) => {
      const user = {
        fullname: 'george bush',
        username: 'georgebush',
        password: passwordHash('georgebush'),
        email: 'georgebush@gmail.com',
        RoleId: 1
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
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.error.content).to.equal('Content is required');
            expect(res.body.error.title).to.equal('Document title must be entered');
            expect(res.body.error.access).to.equal('Access is required');
          }
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
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Please verify your input');
          }
          done();
        });
    });

    it('should create document with valid data', (done) => {
      const document = {
        title: 'my document',
        content: 'this is a valid document',
        access: 'public'
      };
      request
        .post('/api/v1/documents')
        .set('Authorization', token)
        .send(document)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal('Document successfully created');
          }
          done();
        });
    });
  });

  describe('Update document: PUT /api/v1/documents/:id', () => {
    beforeEach((done) => {
      User.bulkCreate([{
        fullname: 'tommy',
        username: 'tommy',
        password: passwordHash('tommy'),
        email: 'tommy@gmail.com',
        RoleId: 1
      }, {
        fullname: 'funny name',
        username: 'funny',
        password: passwordHash('funny'),
        email: 'funny@gmail.com',
        RoleId: 2
      }]).then(() => {
        done();
      });
    });

    it('should return an error message when document is not found', (done) => {
      request
        .put('/api/v1/documents/1')
        .set('Authorization', adminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('The Document does not exist');
          }
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
          UserId: 1,
          RoleId: 1
        })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Invalid document id');
          }
          done();
        });
    });

    it('should update document with correct data ', (done) => {
      Document.create({
        title: 'Real test',
        content: 'This one should update',
        UserId: 1,
        RoleId: 1,
        access: 'public'
      })
        .then(() => {
          //
        });

      request
        .put('/api/v1/documents/1')
        .set('Authorization', token)
        .send({
          title: 'Test',
          content: 'Running Tests with invalid id',
          UserId: 1,
          RoleId: 1
        })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('The Document successfully updated');
          }
          done();
        });
    });

    it('should return an error message for id not a number', (done) => {
      request
        .put('/api/v1/documents/we')
        .set('Authorization', token)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Invalid document id');
          }
          done();
        });
    });
    it('should return error with a bad request', (done) => {
      const document = {
        title: 'Doc',
        content: 'document with invalid id',
        access: 'private',
        UserId: 1,
        RoleId: 1
      };
      Document.create(document).then(() => {
        request
          .put('/api/v1/documents/1012435787876776785756454')
          .set('Authorization', adminToken)
          .send({
            access: 'public',
          })
          .end((err, res) => {
            if (!err) {
              expect(res.status).to.equal(400);
              expect(res.body.message).to.equal('Problem encountered, please try again');
            }
            done();
          });
      });
    });
  });

  describe('Search document: GET /api/v1/search/documents', () => {
    beforeEach((done) => {
      User.create({
        fullname: 'Oluwaseun Adekunle',
        username: 'spidey000',
        password: passwordHash('spidey'),
        email: 'spidey@gmail.com',
        RoleId: 1
      }).then((err) => {
        if (!err) {
          //
        }
        done();
      });
    });

    it('returns an array of documents if found', (done) => {
      Document.create({
        title: 'Search docs',
        content: 'Search documents routes test',
        access: 'public',
        UserId: 1,
        RoleId: 1
      }).then(() => {
        //
      });

      request
        .get('/api/v1/search/documents/?q=Search')
        .set('Authorization', adminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body.documents.length).to.be.greaterThan(0);
          }
          done();
        });
    });
  });

  describe('Get DocumentById: GET /api/v1/documents/:id', () => {
    beforeEach((done) => {
      User.bulkCreate([
        {
          username: 'doc man',
          fullname: 'John',
          password: passwordHash('johnny'),
          email: 'johnny@gmail.com',
          RoleId: 1
        }, {
          username: 'cage',
          fullname: 'cage',
          password: passwordHash('johnny'),
          email: 'johnncagey@gmail.com',
          RoleId: 2
        }
      ]).then(() => {
        done();
      });
    });

    it('should return the document if found', (done) => {
      request
        .get('/api/v1/documents/1')
        .set('Authorization', adminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message');
          }
          done();
        });
    });

    it('should return error for id not an integer', (done) => {
      request
        .get('/api/v1/documents/ee')
        .set('Authorization', adminToken)
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Id must be an integer');
          }
          done();
        });
    });
  });

  describe('Delete document: DELETE /api/v1/document/:id', () => {
    beforeEach((done) => {
      User.bulkCreate([
        {
          username: 'doc man',
          fullname: 'John',
          password: passwordHash('johnny'),
          email: 'johnny@gmail.com',
          RoleId: 1
        }, {
          username: 'cage',
          fullname: 'cage',
          password: passwordHash('johnny'),
          email: 'johnncagey@gmail.com',
          RoleId: 2
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
          UserId: 1,
          RoleId: 1
        })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('Invalid document id');
          }
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
          UserId: 1,
          RoleId: 1
        })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('Document does not exist');
          }
          done();
        });
    });

    it('should return error for non-existing document', (done) => {
      Document.create({
        title: 'DELETE',
        content: 'this document will be deleted soon, maybe not',
        access: 'public',
        UserId: 1,
        RoleId: 1
      }).then(() => {
        request
        .delete('/api/v1/documents/4586580090997876757645745')
        .set('Authorization', adminToken)
        .send({
          title: 'Test',
          content: 'Running Tests with valid id',
          UserId: 1,
          RoleId: 1
        })
        .end((err, res) => {
          if (!err) {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('connection error, please try again');
          }
          done();
        });
      });
    });

    it('should return a message indicating a document deleted', (done) => {
      Document.create({
        title: 'DELETE',
        content: 'this document will be deleted soon',
        access: 'public',
        UserId: 1,
        RoleId: 1
      })
        .then(() => {
          request
            .delete('/api/v1/documents/1')
            .set('Authorization', adminToken)
            .end((err, res) => {
              if (!err) {
                expect(res.status).to.equal(200);
                expect(res.body.status).to.equal('No content');
                expect(res.body.message).to.equal('Document succesfully deleted');
              }
              done();
            });
        });
    });
  });
});

