const express = require("express");
const router = express.Router();
const wrapAsync =require("../views/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedin,isReviewAuthor} = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const {storage} = require("../cloudConfig.js");

const multer  = require('multer')
const upload = multer({storage});



const validateListing = ((req,res,next)=>{
 let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(',');
        throw new ExpressError(404,errMsg);
    }
    else{
        next();
    }
});


//index rought
router
 .route("/")
 .get( wrapAsync(listingController.index))
 .post(isLoggedin,validateListing,upload.single('listing[image]'), wrapAsync(listingController.addlisting));





//form-to-add-newlisting
router.get("/new",isLoggedin,listingController.newlisting);



// individual-listing
// router.get("/:id",wrapAsync(listingController.indilisting));


//new listing
router
.route("/:id")
.get(wrapAsync(listingController.indilisting))
.post( isLoggedin,wrapAsync(listingController.deletelisting))
.put(isLoggedin,validateListing,upload.single('listing[image]'),wrapAsync(listingController.updatelisting));



router.get("/:id/edit",isLoggedin, wrapAsync(listingController.editlisting));


// to delete-listing

// router.post("/:id", isLoggedin,wrapAsync(listingController.deletelisting));

// form to edit-listing



// to complete edit-listing(update)
// router.put("/:id",isLoggedin,validateListing,wrapAsync(listingController.updatelisting));

module.exports = router;


