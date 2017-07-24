import UserControllers from '../controllers/UserControllers';
import Authorization from '../middleware/Authorization';

export default (router) => {
  router.post('/api/v1/users', UserControllers.createUser);
  router.post('/api/v1/users/login', UserControllers.login);
  router.get('/api/v1/users/:id', Authorization.verifyUser, Authorization.AllowAdminOrUser, UserControllers.getUser);
  router.get('/api/v1/users', Authorization.verifyUser, Authorization.verifyAdmin, UserControllers.listUsers);
  router.get('/api/v1/users/:id/documents', Authorization.verifyUser, Authorization.AllowAdminOrUser, UserControllers.getUserDocuments);
  router.put('/api/v1/users/:id', Authorization.verifyUser, UserControllers.updateUser);
  router.delete('/api/v1/users/:id', Authorization.verifyUser, Authorization.verifyAdmin, UserControllers.destroy);
};
