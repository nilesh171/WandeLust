const Express = require('express');
let path = require('path');
let router = Express.Router();
let User = require('../models/user.js');
let wrapasync = require('../utils/wrapasync.js');
const passport = require('passport');
const {savedRedirect} = require('../middlewares/validUser.js');

router.get("/signup",(req,res)=>{
    res.render("signup.ejs");
})

router.post("/signup",wrapasync(async (req,res)=>{
    try{
    let {email,username,password} = req.body;
    let newUser = new User({email,username});
    const user = await User.register(newUser,password);
    req.login(user,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Welcome to Airbnb")
        res.redirect("/listings");
    })
    }catch(e){
      req.flash("failure","Username or email aleready exist!!");
      res.redirect("/signup");
    }
}))

router.get("/login",wrapasync(async(req,res)=>{
    res.render("login.ejs");
}))

router.post("/login",savedRedirect,passport.authenticate('local',{failureRedirect: '/login', failureFlash: true}),wrapasync(async (req,res)=>{
    req.flash("success","Logged in Succesfully");
    res.redirect(res.locals.redirecturl); // Redirect to saved URL or default   
}));

router.get("/logout",wrapasync(async (req,res)=>{
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success","Logged out Succesfully");
        res.redirect("/login");
    });
}))

module.exports = router;