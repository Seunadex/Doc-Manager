export default (router) => {
  router.get('/api/v1/documents', (req, res) => {
    res.status(200).json({
      message: 'Hello document',
    });
  });
  router.get('/api/v1/documents/:id');
  router.post('/api/v1/documents');
  router.put('/api/v1/documents/:id');
  router.delete('/api/v1/documents/:id');
};
