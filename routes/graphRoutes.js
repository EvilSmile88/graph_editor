const { graph } = require('../controllers/graph');

module.exports = app => {
  app.get('/api/graph', graph.get);
  app.delete('/api/graph', graph.deleteNode);
  app.patch('/api/graph', graph.update);
};
