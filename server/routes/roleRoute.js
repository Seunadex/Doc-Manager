export default (router) => {
  router.get('/api/v1/roles', (req, res) => {
    res.status(200).json({
      message: 'Hello roles',
    });
  });
  router.get('/api/v1/roles/:id');
};
