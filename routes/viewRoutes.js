const router = require('express').Router();
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

router.get('/', viewController.getOverview);

router.get('/login', viewController.getLoginForm);

router.get('/tour/:slug', authController.protect, viewController.getTour);

module.exports = router;
