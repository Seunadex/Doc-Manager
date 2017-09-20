import UserControllers from '../controllers/UserControllers';
import Authorization from '../middleware/Authorization';
import Middleware from '../middleware/Middleware';
import Validation from '../middleware/Validation';

export default (router) => {
  router.post('/api/v1/users', Validation.validateUser, UserControllers.create);

  router.post('/api/v1/users/login', Validation.validateLoginInput,
  UserControllers.login);

  router.get('/api/v1/users/:id', Authorization.verifyUser,
  Middleware.findUser,
    UserControllers.show);

  router.get('/api/v1/users', Authorization.verifyUser,
  Authorization.verifyAdmin, UserControllers.index);

  router.get('/api/v1/search/users', Authorization.verifyUser,
    UserControllers.search);

  router.get('/api/v1/users/:id/documents', Authorization.verifyUser,
  Middleware.findUser,
    UserControllers.listUserDocuments);

  router.put('/api/v1/users/:id', Authorization.verifyUser,
  Authorization.verifyCurrentUser,
    UserControllers.update);

  router.delete('/api/v1/users/:id', Authorization.verifyUser,
  Middleware.findUser,
    UserControllers.destroy);
};
