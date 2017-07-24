import documentRoute from './documentRoute';
import userRoute from './userRoute';
import roleRoute from './roleRoute';

export default (router) => {
  roleRoute(router);
  userRoute(router);
  documentRoute(router);
};
