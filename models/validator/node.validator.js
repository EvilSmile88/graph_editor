const joi = require('joi');

const nodeValidator = joi.object().keys({
  editable: joi.boolean(),
  x: joi.number(),
  y: joi.number(),
  index: joi.number(),
  weight: joi.number(),
  px: joi.number(),
  py: joi.number(),
  type: joi.string(),
  fixed: joi.number(),
  id: joi.number(),
  label: joi.string(),
});

module.exports = {
  nodeValidator,
};
