const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.deletereview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};


module.exports.review = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  console.log(req.body.review);  

  const r1 = new Review(req.body.review);  
  r1.author = req.user._id;
  listing.reviews.push(r1);

  await r1.save();
  await listing.save(); 
  console.log(r1);
req.flash("success","New Review Created");
  res.redirect(`/listings/${listing._id}`); 
}