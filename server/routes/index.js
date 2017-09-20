import documentRoute from './documentRoute';
import userRoute from './userRoute';

export default (router) => {
  userRoute(router);
  documentRoute(router);
};
