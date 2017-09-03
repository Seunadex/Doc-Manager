import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../build/server';
import { User, Document, Role } from '../models';
import userHelpers from './testHelpers/userHelpers';
import documentHelpers from './testHelpers/documentHelpers';
import jwtHelper from '../helper/jwtHelper';

const request = supertest.agent(app);
const invalidToken = process.env.INVALID_TOKEN;
const { validAdmin, validUser } = userHelpers;
const {
  document1,
  document2,
  document3,
  sameTitle,
  emptyDoc,
  invalidAccess,
  validDoc,
  titleString,
  privateDoc
 } = documentHelpers;
const adminToken = jwtHelper(validAdmin);
const token = jwtHelper(validUser);

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
  beforeEach((done) => {
    User.bulkCreate([validAdmin, validUser]).then(() => {
      done();
    });
  });

  describe('Get documents: GET /api/v1/documents', () => {
    beforeEach((done) => {
      Document.bulkCreate([document1, document2, document3]).then(() => {
        done();
      });
    });
    it('should get all documents if user is admin', (done) => {
      request
        .get('/api/v1/documents')
        .set('Authorization', adminToken)
        .set('Accept', 'application/json')
        .end((err, response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an('object');
          expect(response.badRequest).to.equal(false);
          expect(response.ok).to.equal(true);
          expect(response.unauthorized).to.equal(false);
          done();
        });
    });

    it('should get all documents accessible to a regular user', (done) => {
      request
        .get('/api/v1/documents')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .end((err, response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an('object');
          expect(response.badRequest).to.equal(false);
          expect(response.ok).to.equal(true);
          expect(response.unauthorized).to.equal(false);
          done();
        });
    });

    it('should return correct response given valid offset and limit',
    (done) => {
      request
        .get('/api/v1/documents/?limit=2&offset=0')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.documents[0]).to.have.property('id');
          expect(response.body.documents[0]).to.have.property('title');
          expect(response.body.documents[0]).to.have.property('content');
          expect(response.body.documents[0]).to.have.property('access');
          expect(response.body.metadata.page).to.equal(1);
          expect(response.body.metadata.pageCount).to.equal(2);
          expect(response.body.metadata.pageSize).to.equal('2');
          expect(response.body.metadata.totalCount).to.equal(3);
          done();
        });
    });

    it('should return error with non-integer limit or offset', (done) => {
      request
        .get('/api/v1/documents/?limit=e&offset=t')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal(
              'limit and offset must be an integer');
          done();
        });
    });
    it('should return error for invalid token', (done) => {
      request
        .get('/api/v1/documents/?limit=2&offset=0')
        .set('Authorization', invalidToken)
        .end((err, response) => {
          expect(response.status).to.equal(401);
          expect(response.body.message).to.equal('Invalid token');
          done();
        });
    });
  });

  describe('Create document: POST /api/v1/documents', () => {
    it('should return an error message on title conflict', (done) => {
      Document.create(document1)
        .then(() => {
        });
      request
        .post('/api/v1/documents')
        .send(sameTitle)
        .set('Authorization', adminToken)
        .set('Accept', 'application/json')
        .end((err, response) => {
          expect(response.status).to.equal(409);
          expect(response.body.message).to.equal(
              'A document already exist with same title');
          done();
        });
    });
    it('should return error message when title is not a string', (done) => {
      request
      .post('/api/v1/documents')
      .set('Authorization', token)
      .send(titleString)
      .end((err, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          'Title must be in string format');
        done();
      });
    });

    it('should return error message for invalid/empty input data', (done) => {
      request
        .post('/api/v1/documents')
        .set('Authorization', token)
        .send(emptyDoc)
        .end((err, response) => {
          expect(response.body[0].msg).to.equal(
            'Document title must be entered');
          expect(response.body[1].msg).to.equal('Content is required');
          expect(response.body[2].msg).to.equal('Access can not be an integer');
          expect(response.body[3].msg).to.equal('Access is required');
          done();
        });
    });
    it('should return an error for invalid access', (done) => {
      request
        .post('/api/v1/documents')
        .set('Authorization', adminToken)
        .send(invalidAccess)
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal(
              'Access field must be either PUBLIC, PRIVATE or ROLE');
          done();
        });
    });

    it('should create a new document', (done) => {
      request
        .post('/api/v1/documents')
        .send(validDoc)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
          .end((err, response) => {
            expect(response.status).to.equal(201);
            expect(response.body.document.id).to.equal(1);
            expect(response.body.document.title).to.equal('New doc');
            expect(response.body.document.content).to.equal(
              'the future is now');
            expect(response.body.document.access).to.equal('public');
            expect(response.body.document.userId).to.equal(2);
            done();
          });
    });
  });

  describe('Update document: PUT /api/v1/documents/:id', () => {
    beforeEach((done) => {
      Document.create(validDoc)
      .then(() => {
        done();
      });
    });
    it('should return error message when title is not a string', (done) => {
      request
      .put('/api/v1/documents/1')
      .set('Authorization', token)
      .send({
        title: 87,
        content: 'Running Tests with invalid id',
        access: 'public',
        userId: 2,
        roleId: 2
      })
      .end((err, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          'Title must be in string format');
        done();
      });
    });

    it('should return error message when user does not have permission',
    (done) => {
      request
      .put('/api/v1/documents/1')
      .set('Authorization', adminToken)
      .end((err, response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal(
          'You don\'t have permission to update this document');
        done();
      });
    });

    it('should return database error when user update with invalid access type',
    (done) => {
      request
      .put('/api/v1/documents/1')
      .send(invalidAccess)
      .set('Authorization', token)
      .end((err, response) => {
        expect(response.status).to.equal(500);
        expect(response.body.message.name).to.equal(
          'SequelizeDatabaseError');
        done();
      });
    });

    it('should return an error message when document is not found', (done) => {
      request
        .put('/api/v1/documents/3')
        .set('Authorization', adminToken)
        .end((err, response) => {
          expect(response.status).to.equal(404);
          expect(response.body.message).to.equal('Document does not exist');
          done();
        });
    });

    it('should return error for invalid document id', (done) => {
      request
        .put('/api/v1/documents/seun')
        .set('Authorization', adminToken)
        .send(document2)
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal('Invalid document id');
          done();
        });
    });

    it('should update document with correct input data ', (done) => {
      request
        .put('/api/v1/documents/1')
        .set('Authorization', token)
        .send({
          title: 'Test',
          content: 'Running Tests with invalid id',
          access: 'public',
          userId: 2,
          roleId: 2
        })
        .end((err, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.document.id).to.equal(1);
          expect(response.body.document.title).to.equal('Test');
          expect(response.body.document.content).to.equal(
              'Running Tests with invalid id');
          expect(response.body.document.access).to.equal('public');
          expect(response.body.document.userId).to.equal(2);
          done();
        });
    });

    it('should return an error message for id not a number', (done) => {
      request
        .put('/api/v1/documents/we')
        .set('Authorization', token)
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal('Invalid document id');
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
          .end((err, response) => {
            expect(response.status).to.equal(500);
            expect(response.body.message).to.equal(
                'Internal server error');
            done();
          });
      });
    });
  });

  describe('Search document: GET /api/v1/search/documents', () => {
    it('returns an array of documents if found', (done) => {
      Document.create({
        title: 'Search docs',
        content: 'Search documents routes test',
        access: 'public',
        roleId: 1,
        userId: 1
      }).then(() => {
        request
        .get('/api/v1/search/documents/?q=Se')
        .set('Authorization', adminToken)
        .end((err, response) => {
          if (!err) {
            expect(response.status).to.equal(200);
            expect(response.body.documents[0].title).to.equal('Search docs');
            expect(response.body.documents[0].content).to.equal(
              'Search documents routes test');
            expect(response.body.documents[0].access).to.be.equal('public');
          }
          done();
        });
      });
    });
  });

  describe('Get DocumentById: GET /api/v1/documents/:id', () => {
    beforeEach((done) => {
      Document.bulkCreate([validDoc, privateDoc])
      .then(() => {
        done();
      });
    });
    it('should return the document if found', (done) => {
      request
        .get('/api/v1/documents/1')
        .set('Authorization', adminToken)
        .set('Accept', 'application/json')
          .end((err, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.document.id).to.equal(1);
            expect(response.body.document.title).to.equal('New doc');
            expect(response.body.document.content).to.equal(
              'the future is now');
            expect(response.body.document.access).to.equal('public');
            expect(response.body.document).to.have.property('createdAt');
            done();
          });
    });
    it('should return error when user does not have access', (done) => {
      request
      .get('/api/v1/documents/2')
      .set('Authorization', token)
      .end((err, response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal(
          'You do not have access to this document');
        done();
      });
    });

    it('should return error with invalid integer limit', (done) => {
      request
      .get('/api/v1/documents/2127834673276')
      .set('Authorization', token)
      .end((err, response) => {
        expect(response.status).to.equal(500);
        expect(response.body.message).to.equal('Internal server error');
        done();
      });
    });
  });

  describe('Delete document: DELETE /api/v1/document/:id', () => {
    beforeEach((done) => {
      Document.create(validDoc).then(() => {
        done();
      });
    });
    it('should return error for invalid document id', (done) => {
      request
        .delete('/api/v1/documents/seun')
        .set('Authorization', token)
        .send(document2)
        .end((err, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal('Invalid document id');
          done();
        });
    });

    it('should return error for document not found', (done) => {
      request
        .delete('/api/v1/documents/2')
        .set('Authorization', token)
        .send(document2)
        .end((err, response) => {
          expect(response.status).to.equal(404);
          expect(response.body.message).to.equal('Document Not Found');
          done();
        });
    });

    it('should return server error when other errors has been checked',
    (done) => {
      request
        .delete('/api/v1/documents/4586580090997876757645745')
        .set('Authorization', adminToken)
        .send(document2)
        .end((err, response) => {
          expect(response.status).to.equal(500);
          expect(response.body.message).to.equal(
            'Internal server error');
          done();
        });
    });

    it('should return a message indicating a document has been deleted',
    (done) => {
      request
        .delete('/api/v1/documents/1')
        .set('Authorization', token)
        .end((err, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.message).to.equal(
              'Document succesfully deleted');
          done();
        });
    });
  });
});

