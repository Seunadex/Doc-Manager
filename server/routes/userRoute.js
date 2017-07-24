export default (router) => {
  router.get('/api/v1/users', (req, res) => {
    res.status(200).json({
      message: 'Hello user',
    });
  });
  router.get('/api/v1/users/:id');
  router.post('/api/v1/users');
  router.post('/api/v1/users/login');
  router.put('/api/v1/users/:id');
  router.delete('/api/v1/users/:id');
};
