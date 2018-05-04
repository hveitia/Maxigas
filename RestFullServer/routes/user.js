var express = require('express');
var router = express.Router();
var middleware = require('../middleware');

var authController = require('../controllers/authenticationController');
var userController = require('../controllers/userController');

router.route('/authenticate')
    .post(authController.authenticate);

router.route('/authenticateuuid')
    .post(authController.authenticateWhitUuid);

router.route('/user')
    .post(userController.add);

router.route('/addresByUser/:id')
    .get(middleware.ensureAuthenticated, userController.getAddressByUser);

router.route('/changeDistributionStatus/:id')
    .options(middleware.ensureAuthenticated, userController.options)
    .put(middleware.ensureAuthenticated, userController.changeDistributionStatus);

router.route('/userAddAddress/:id')
    .options(middleware.ensureAuthenticated, userController.options)
    .put(middleware.ensureAuthenticated, userController.addAddress);

module.exports = router;