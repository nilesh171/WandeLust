const Express = require('express');
let path = require('path');
let router = Express.Router({ mergeParams: true });
let {listing,review}= require('../models/schema');
let wrapasync = require('../utils/wrapasync.js');
let validateReview = require('../middlewares/validateReviews.js');
let {validUser , isreviewauthor} = require("../middlewares/validUser.js");


//Review Route
router.post("/",validUser,validateReview,wrapasync(async (req,res)=>{
   let {id} = req.params;
   let listing1 = await listing.findById(id);
   let review1 = new review(req.body.review);
   review1.author = req.user._id;
   listing1.reviews.push(review1);
   await listing1.save();
   await review1.save();
   req.flash("success","Review created succesfully");
   res.redirect(`/listings/${id}`);
}));

//Delete Review Route
router.delete("/:reviewId",isreviewauthor,validUser,wrapasync(async (req,res)=>{
   let {id, reviewId} = req.params;
   await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
   await review.findByIdAndDelete(reviewId);
   req.flash("success","Review deleted succesfully");
   res.redirect(`/listings/${id}`);
}));

module.exports = router;