const joi = require('joi');

const linkValidator = joi.object().keys({
  editable: joi.boolean(),
  source: joi.number(),
  target: joi.number(),
});

module.exports = {
  linkValidator,
};
