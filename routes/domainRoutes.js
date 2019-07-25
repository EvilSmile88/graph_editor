const { domain } = require('../controllers/domain');

module.exports = app => {
  app.get('/api/domain', domain.get);
  app.post('/api/domain/group', domain.addGroup);
};