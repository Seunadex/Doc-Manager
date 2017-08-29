import DocumentControllers from '../controllers/DocumentControllers';
import Authorization from '../middleware/Authorization';
import Middleware from '../middleware/Middleware';
import Validation from '../middleware/Validation';

export default (router) => {
  router.get('/api/v1/documents', Authorization.verifyUser,
  DocumentControllers.index);

  router.get('/api/v1/documents/:id', Authorization.verifyUser,
  Authorization.allowUserGetDocument,
  DocumentControllers.show);

  router.get('/api/v1/search/documents', Authorization.verifyUser,
  DocumentControllers.search);

  router.post('/api/v1/documents',
  Authorization.verifyUser,
  Validation.validateDocuments,
  DocumentControllers.create);

  router.put('/api/v1/documents/:id', Authorization.verifyUser,
  Middleware.findDocument,
  Validation.validateDocuments,
  DocumentControllers.update);

  router.delete('/api/v1/documents/:id', Authorization.verifyUser,
  DocumentControllers.destroy);
};
