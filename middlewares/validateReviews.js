const {reviewSchema} = require('../joischema');
const expressError = require('../utils/expressError');

module.exports = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(', ');
    throw new expressError(400, msg);
  } else {
    next();
  }
};