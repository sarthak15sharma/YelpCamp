const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.makeReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    req.flash('success', 'Created new review!');
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'You have successfully deleted the review');
    res.redirect(`/campgrounds/${id}`);
};