const { graph } = require('../controllers/graph');

module.exports = app => {
  app.get('/api/graph', graph.get);
  app.patch('/api/graph', graph.forceUpdate);
  app.post('/api/node', graph.addNode);
  app.patch('/api/node', graph.updateNode);
  app.delete('/api/nodes', graph.deleteNodes);
  app.delete('/api/links', graph.deleteLinks);
  app.post('/api/link', graph.addLink);
};
