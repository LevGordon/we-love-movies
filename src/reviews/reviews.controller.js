const reviewService = require("./reviews.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function reviewExists(req, res, next) {
    const { reviewId } = req.params;
  
    const review = await reviewService.read(reviewId);
    if (review) {
      res.locals.review = review;
      return next();
    }
    return next({ status: 404, message: `Review cannot be found.` });
  }

  async function update(req, res) {
    const time = new Date().toISOString();
    const reviewId = res.locals.review.review_id
    const updatedReview = {
      ...req.body.data,
      review_id: reviewId,
      
    }
    await reviewService.update(updatedReview)
    const info = await reviewService.updateCritic(reviewId)
    const data = { ...info[0], created_at: time, updated_at: time};
    res.json({ data });
  }

  async function destroy(req, res) {
    const {review} = res.locals
    const data = await reviewService.destroy(review.review_id)
    res.sendStatus(204).json({ data });
  }

  module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  };