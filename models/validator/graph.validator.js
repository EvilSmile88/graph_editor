const joi = require('joi');
var nodesSchema = require('./node.validator');

const graph = joi.object().keys({
  last_index: joi.number().integer().min(0).max(9999),
  user: joi.string().max(100),
    // nodes: joi.array().items(joi.object(nodesSchema)).required(),
  nodes: joi.any(),
    links: joi.any(),
});

module.exports = {
  graph,
};
