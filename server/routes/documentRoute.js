import DocumentControllers from '../controllers/DocumentControllers';
import Middleware from '../middleware/Middleware';
import Validation from '../middleware/Validation';

export default (router) => {
  router.get('/api/v1/documents', Middleware.verifyUser,
  DocumentControllers.index);

  router.get('/api/v1/documents/:id', Middleware.verifyUser,
  Middleware.allowUserGetDocument,
  DocumentControllers.show);

  router.get('/api/v1/search/documents', Middleware.verifyUser,
  DocumentControllers.search);

  router.post('/api/v1/documents',
  Middleware.verifyUser,
  Validation.validateDocuments,
  DocumentControllers.create);

  router.put('/api/v1/documents/:id', Middleware.verifyUser,
  Middleware.findDocumentById,
  Validation.validateDocuments,
  DocumentControllers.update);

  router.delete('/api/v1/documents/:id', Middleware.verifyUser,
  DocumentControllers.destroy);
};
