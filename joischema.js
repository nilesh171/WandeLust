const Joi = require('joi');
const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    img: Joi.string().uri().required(),
    price: Joi.number().min(0).required(),
    location: Joi.string().min(2).required(),
    country: Joi.string().min(2).required()
  }).required()
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(5).required()
  }).required()
});

module.exports = {listingSchema , reviewSchema};;