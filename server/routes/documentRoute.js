import DocumentControllers from '../controllers/DocumentControllers';
import Authorization from '../middleware/Authorization';
import Validation from '../middleware/Validation';

export default (router) => {
  router.get('/api/v1/documents', Authorization.verifyUser,
  DocumentControllers.index);

  router.get('/api/v1/documents/:id', Authorization.verifyUser,
  DocumentControllers.show);

  router.get('/api/v1/search/documents', Authorization.verifyUser,
  DocumentControllers.search);

  router.post('/api/v1/documents', Validation.validateDocuments,
  Authorization.verifyUser, DocumentControllers.create);

  router.put('/api/v1/documents/:id', Authorization.findDocumentById,
  Authorization.verifyUser,
  DocumentControllers.update);

  router.delete('/api/v1/documents/:id', Authorization.verifyUser,
  DocumentControllers.destroy);
};
