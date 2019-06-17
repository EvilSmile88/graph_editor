const joi = require('joi');
var { nodeValidator } = require('./node.validator');
var { linkValidator } = require('./link.validator');

const graphValidator = joi.object().keys({
  last_index: joi.number().integer().min(0).max(9999),
  user: joi.string().min(1).max(100),
  nodes: joi.array().items(nodeValidator).required(),
  links: joi.array().items(linkValidator).required(),
});

module.exports = {
    graphValidator,
};
