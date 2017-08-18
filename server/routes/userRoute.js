import UserControllers from '../controllers/UserControllers';
import Authorization from '../middleware/Authorization';
import Validation from '../middleware/Validation';

export default (router) => {
  router.post('/api/v1/users', Validation.validateUser, UserControllers.create);

  router.post('/api/v1/users/login', Validation.validateLoginInput,
  UserControllers.login);

  router.get('/api/v1/users/:id', Authorization.verifyUser,
    Authorization.findById,
    UserControllers.show);

  router.get('/api/v1/users', Authorization.verifyUser, UserControllers.index);

  router.get('/api/v1/search/users', Authorization.verifyUser,
    UserControllers.search);

  router.get('/api/v1/users/:id/documents', Authorization.verifyUser,
    Authorization.findById,
    UserControllers.listUserDocuments);

  router.put('/api/v1/users/:id', Authorization.verifyUser,
    Authorization.verifyCurrentUser,
    UserControllers.update);

  router.delete('/api/v1/users/:id', Authorization.verifyUser,
    Authorization.findById,
    UserControllers.destroy);
};
