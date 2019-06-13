const joi = require('joi');
var nodesSchema = require('./node.validator');

const graph = joi.object().keys({
  last_index: joi.number().integer().min(0).max(9999),
  user: joi.string().max(100),
  tags: joi.array().items(joi.object(nodesSchema)).required()
});

module.exports = {
  graph,
};
