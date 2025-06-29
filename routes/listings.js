const Express = require('express');
let path = require('path');
let router = Express.Router({ mergeParams: true });
let {listing}= require('../models/schema');
let warpasync = require('../utils/wrapasync.js');
let validateListing = require('../middlewares/validateListing.js');
let {validUser , isowner} = require("../middlewares/validUser.js");
const multer = require('multer');
const storage = require('../utils/storage'); // Adjust path as needed
const upload = multer({ storage });
const cloudinary = require('../utils/cloudinary');


router.get("/new",validUser,(req,res)=>{
    res.render("createListing.ejs");
})

router.post("/new",validUser,validateListing,upload.single('listing[img]') ,warpasync(async (req,res)=>{
    let location = req.body.listing.location;
    const val = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=DcEQCkxfu1PEoOQboINd`);
    const data = await val.json();
    let geoPoint = {
    type: "Point",
    coordinates: [0, 0]  // default fallback in case location fails
    };
    if (data && data.features && data.features.length > 0) {
      geoPoint = {
      type: "Point",
      coordinates: data.features[0].geometry.coordinates  // [lng, lat]
    }}
    let list = new listing({...req.body.listing });
    list.owner = req.user._id;
    list.coordinates= geoPoint;
    list.img={
        url : req.file.path,
        filename : req.file.filename
    }
    await list.save();
    req.flash("success","New listing created succesfully");
    res.redirect("/listings");
}));


//show Route
router.get("/",warpasync(async (req,res)=>{
    let data = await listing.find();
    res.render("listing.ejs",{data});
}));

//detailed Route
router.get("/:id",warpasync(async (req,res)=>{
    let {id} = req.params;
    let data = await listing.findById(id).populate({path : "reviews", populate :{ path : "author"}}).populate("owner");
    res.render("show.ejs",{data});
}))

//Edit Route
router.get("/:id/edit",validUser,isowner,warpasync(async (req,res)=>{
    let {id}= req.params;
    let data = await listing.findById(id);
    res.render("edit.ejs",{data});
}))

router.patch("/:id",validUser,isowner,validateListing ,warpasync(async (req,res)=>{
    let {id}= req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing edited succesfully");
    res.redirect("/listings/" + id);
}))

//Delete Route
router.delete("/:id",validUser,isowner,warpasync(async (req,res)=>{
    let {id}= req.params;
    let Listing = await listing.findById(id);
    if (Listing.img && Listing.img.filename) {
    await cloudinary.uploader.destroy(Listing.img.filename);
    }
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted succesfully");
    res.redirect("/listings");
}))

module.exports = router;