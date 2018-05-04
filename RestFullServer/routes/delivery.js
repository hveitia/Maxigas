var express = require('express');
var router = express.Router();
var middleware = require('../middleware');

var deliveryController = require('../controllers/deliveryController');

router.route('/delivery')
    .post(middleware.ensureAuthenticated, deliveryController.addDelivery)
    .get(middleware.ensureAuthenticated, deliveryController.findAll);

router.route('/deliveryByState/:state')
    .get(middleware.ensureAuthenticated, deliveryController.findByState);

router.route('/attendDelivery/:id')
    .get(middleware.ensureAuthenticated, deliveryController.attendDelivery);

router.route('/cancelDelivery/:id')
    .get(middleware.ensureAuthenticated, deliveryController.cancelDelivery);

router.route('/pendingDeliveryByUser')
    .get(middleware.ensureAuthenticated, deliveryController.pendingDeliveryByUser);

router.route('/attendedDeliveryByUserClient')
    .get(middleware.ensureAuthenticated, deliveryController.attendedDeliveryByUserClient);

router.route('/addValoration/:id')
    .options(middleware.ensureAuthenticated, deliveryController.options)
    .put(middleware.ensureAuthenticated, deliveryController.addValoration);

router.route('/getValorationAverage/:user')
    .get(middleware.ensureAuthenticated, deliveryController.getValorationAverage);


module.exports = router;

