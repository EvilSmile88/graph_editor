const joi = require('joi');

const schema = joi.object().keys({
  editable: joi.boolean(),
  x: joi.number(),
  y: joi.number(),
  index: joi.number(),
  weight: joi.number(),
  px: joi.number(),
  py: joi.number(),
  fixed: joi.number(),
  id: joi.number(),
});

module.exports = {
  schema,
};
