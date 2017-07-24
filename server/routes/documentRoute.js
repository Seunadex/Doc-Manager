import DocumentControllers from '../controllers/DocumentControllers';
import Authorization from '../middleware/Authorization';

export default (router) => {
  router.get('/api/v1/documents', Authorization.verifyUser, DocumentControllers.listDocuments);
  router.get('/api/v1/documents/:id', Authorization.verifyUser, DocumentControllers.getDocument);
  router.post('/api/v1/documents', Authorization.verifyUser, DocumentControllers.create);
  router.put('/api/v1/documents/:id', DocumentControllers.updateDocument);
  router.delete('/api/v1/documents/:id', DocumentControllers.destroy);
};
