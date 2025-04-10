const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");

    res.redirect(`/listings/${listing._id}`);

   // console.log("new review saved", listing.reviews);
    // res.send("new review saved");

};


module.exports.destroyReview = async (req, res) => {
    let { id, reviewID } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await Review.findOneAndDelete(reviewID);
    req.flash("success", "Review Deleted");

    res.redirect(`/listings/${id}`);
};