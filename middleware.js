const Review = require("./models/reviews");

module.exports.isLoggedin = (req,res,next)=>{
  
        if(!req.isAuthenticated() ){
            req.session.redirUrl = req.originalUrl;
        req.flash("success","You Have To Login");
        return res.redirect("/login");
    }
    next();
}

// module.exports.saveRedirectUrl = (req,res,next)=>{
// if(req.session.redirUrl){
//     res.locals.redirUrl = req.session.redirUrl;
// }
// next();
// }

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirUrl) {
        res.locals.redirUrl = req.session.redirUrl;
    }
    next();
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    console.log("the author id r "+review.author);
    if(res.locals.currentUser && !review.author.equals(res.locals.currentUser._id)){
        req.flash("error","Not Deleted :-you did not created this review !!");
       return  res.redirect(`/listings/${id}`);
    }
    next();
}