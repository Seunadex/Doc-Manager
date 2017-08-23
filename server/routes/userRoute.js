import UserControllers from '../controllers/UserControllers';
import Middleware from '../middleware/Middleware';
import Validation from '../middleware/Validation';

export default (router) => {
  router.post('/api/v1/users', Validation.validateUser, UserControllers.create);

  router.post('/api/v1/users/login', Validation.validateLoginInput,
  UserControllers.login);

  router.get('/api/v1/users/:id', Middleware.verifyUser,
  Middleware.findById,
    UserControllers.show);

  router.get('/api/v1/users', Middleware.verifyUser,
  Middleware.verifyAdmin, UserControllers.index);

  router.get('/api/v1/search/users', Middleware.verifyUser,
    UserControllers.search);

  router.get('/api/v1/users/:id/documents', Middleware.verifyUser,
  Middleware.findById,
    UserControllers.listUserDocuments);

  router.put('/api/v1/users/:id', Middleware.verifyUser,
  Middleware.verifyCurrentUser,
    UserControllers.update);

  router.delete('/api/v1/users/:id', Middleware.verifyUser,
  Middleware.findById,
    UserControllers.destroy);
};
