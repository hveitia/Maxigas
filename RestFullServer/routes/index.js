var express = require('express');
var router = express.Router();
var app = express();
var mongoose = require('mongoose');

//Import Models
var userModel = require('../models/userModel')(app, mongoose);
var deliveryModel  = require('../models/deliveryModel')(app, mongoose);

  router.get('/', function(req, res) {
     res.send("Distributions RestApi!");
  });


module.exports = router;