import { expect } from 'chai';
import models from '../../../build/models';

const Document = models.Document;
const newDoc = {
  title: 'in the British Isles',
  content: 'The point like readable English.',
  userId: 2,
  access: 'public',
};

describe('Document model', () => {
  describe('#Create Document', () => {
    it('should create a user document', (done) => {
      Document.create(newDoc)
        .then((user) => {
          expect(user.dataValues.title).to.equal(newDoc.title);
          expect(user.dataValues.content).to.equal(newDoc.content);
          expect(user.dataValues.access).to.equal(newDoc.access);
          done();
        })
        .catch();
    });

    it('should throw error for invalid access type', (done) => {
      Document.create({
        title: 'British Isles',
        content: 'This is for invalid access.',
        userId: 2,
        access: 'general',
      })
      .then()
      .catch((err) => {
        expect(err.errors[0].message).to.equal('Use a valid access type');
        expect(err.errors[0].type).to.equal('Validation error');
        done();
      });
    });
  });

  describe('#Update Document', () => {
    it('should update a user document by user id', (done) => {
      Document.findById('2')
        .then((document) => {
          document.update({ title: 'React stuff' })
            .then((docUpdate) => {
              expect(docUpdate.dataValues.title).to.equal(
                'React stuff');
              done();
            });
        });
    });
  });

  describe('#Delete Document', () => {
    it('should delete a user document by user id', (done) => {
      Document.findById('2')
        .then((document) => {
          document.destroy()
            .then((docUpdate) => {
              expect(docUpdate[0]).to.equal(undefined);
              done();
            });
        });
    });
  });
});
