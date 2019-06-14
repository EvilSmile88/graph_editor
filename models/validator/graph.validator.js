const joi = require('joi');
var nodesSchema = require('./node.validator');

const graphValidator = joi.object().keys({
  last_index: joi.number().integer().min(0).max(9999),
  user: joi.string().min(1).max(100),
    // nodes: joi.array().items(joi.object(nodesSchema)).required(),
  nodes: joi.any(),
    links: joi.any(),
});

module.exports = {
    graphValidator,
};
