const Joi = require("joi");

exports.createGrocery = Joi.object({
  name: Joi.string().min(1).max(24).required(),
  category: Joi.string().min(1).max(24).required(),
  price: Joi.number().integer().min(0).required(),
  tags: Joi.string().max(100).optional().allow(""),
  available_quantity: Joi.number().integer().min(0).required(),
});

exports.updateGrocery = Joi.object({
  name: Joi.string().max(24).optional().allow(""),
  category: Joi.string().max(24).optional().allow(""),
  price: Joi.number().integer().min(0).optional().allow(null),
  tags: Joi.string().max(100).optional().allow(""),
  available_quantity: Joi.number().integer().min(0).optional().allow(null),
});

exports.placeOrder = Joi.object({
  address: Joi.string().max(50).required(),
  cart: Joi.array().items(
    Joi.object({
      id: Joi.number().required(),
      quantity: Joi.number().integer().min(1),
    })
  ),
});
