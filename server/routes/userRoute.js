import UserControllers from '../controllers/UserControllers';
import Authorization from '../middleware/Authorization';
import Validation from '../middleware/Validation';

export default (router) => {
  router.post('/api/v1/users', Validation.validateUser, UserControllers.createUser);
  router.post('/api/v1/users/login', UserControllers.login);

  router.get('/api/v1/users/:id', Authorization.verifyUser, UserControllers.getUser);
  router.get('/api/v1/users', Authorization.verifyUser, UserControllers.listUsers);
  router.get('/api/v1/search/users', Authorization.verifyUser, Authorization.verifyAdmin, UserControllers.searchUsers);
  router.get('/api/v1/users/:id/documents', Authorization.verifyUser, Authorization.AllowAdminOrUser, UserControllers.listUserDocuments);

  router.put('/api/v1/users/:id', Authorization.verifyUser, Authorization.AllowAdminOrUser, UserControllers.updateUser);
  router.delete('/api/v1/users/:id', Authorization.verifyUser, Authorization.verifyAdmin, UserControllers.destroy);
};
