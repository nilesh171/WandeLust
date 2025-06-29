let {listing , review}= require('../models/schema');

validUser = (req,res,next)=>{
   if(!req.isAuthenticated()){
    req.session.redirecturl = req.originalUrl;
    req.flash("error","you must be logged in to do that !!");
    res.redirect('/login');
   }
   else{
    next();
   }
}
//use to rdirect to its first url before login page
savedRedirect = (req,res,next)=>{
   if(req.session.redirecturl){
      let url = req.session.redirecturl;
      if(url.includes("review")){
         res.locals.redirecturl = url.replace(/\/review.*$/, '');
      }
      else{
      res.locals.redirecturl = url;
      }
   }
   else{
      res.locals.redirecturl = '/listings';
   }
   next();
}

isowner =async (req,res,next)=>{
   let {id}= req.params;
   let list = await listing.findById(id).populate('owner');
   if(!list.owner._id.equals(res.locals.curruser._id)){
      req.flash("error","You are not owner of these post");
      res.redirect("/listings/" + id);
   }
   else{
      next();
   }
}

isreviewauthor =async (req,res,next)=>{
   let {id, reviewId} = req.params;
   let review1 = await review.findById(reviewId).populate("author")
   if(!review1.author._id.equals(res.locals.curruser._id)){
      req.flash("error","You are not author of these Review");
      res.redirect("/listings/" + id);
   }
   else{
      next();
   }
}

module.exports = {validUser, savedRedirect,isowner,isreviewauthor};

