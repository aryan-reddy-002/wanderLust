const express = require("express");
const router = express.Router({mergeParams : true});
const {listingSchema} = require("../schema.js");
const {reviewSchema} =  require("../schema.js");
const Review = require("../models/reviews.js");
const wrapAsync =require("../views/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedin ,isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



const validateReview = ((req,res,next)=>{
 let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(',');
        throw new ExpressError(404,errMsg);
    }
    else{
        next();
    }
});




// Delete Review 
router.delete("/:reviewId", isReviewAuthor,isLoggedin, wrapAsync(reviewController.deletereview));

//Review
router.post("/",isLoggedin, validateReview, wrapAsync(reviewController.review));

module.exports = router;