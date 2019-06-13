const joi = require('joi');

const graph = Joi.object().keys({
  last_index: Joi.number().integer().min(0).max(9999),
  user: Joi.string().max(100),
  access_token: [Joi.string(), Joi.number()],
  birthyear: Joi.number().integer().min(1900).max(2013),
  email: Joi.string().email({ minDomainSegments: 2 })
});

module.exports = {
  graph,
};
