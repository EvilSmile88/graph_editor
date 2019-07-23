const { domain } = require('../controllers/domain');

module.exports = app => {
  app.get('/api/domain', domain.get);
};