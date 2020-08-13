const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// PARAM MIDDLEWARE
// router.param('id', tourController.checkID);

router.param('id', authController.protect);

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-tours')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.tourStats);
router.route('/monthly-plan/:id').get(tourController.getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlang/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(authController.restrictTo('admin'), tourController.deleteTour);

// Nested Routes
// GET /tours/:tourId/reviews
// POST /tours/:tourId/reviews
// GET /tours/:tourId/reviews/:reviewId

// router
//   .route('/:tourId/reviews/:reviewId')
//   .get(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.getReview
//   );

module.exports = router;
