var mongoose = require('mongoose');
var service = require('../service');
var USERMODEL = mongoose.model('USERMODEL');

exports.authenticate = function (req, res) {

    USERMODEL.findOne({phone: req.body.phone}, function (err, user) {
        if (err) res.send(500, err.message);
        if (!user) {
            res.json({success: false, message: 'Authentication failed. User not found.'});
        }
        else {
            if (user) {
                if (user.pass != req.body.pass) {
                    res.json({success: false, message: 'Authentication failed. Wrong password.'});
                }
                else {
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Login Success!',
                        token: service.createToken(user),
                        user: user
                    });
                }
            }
        }
    });
};

exports.authenticateWhitUuid = function (req, res) {

    USERMODEL.findOne({uuid: req.body.uuid}, function (err, user) {
        if (err) res.send(500, err.message);
        if (!user) {
            res.json({success: false, message: 'Authentication failed. User not found.'});
        }
        else {
            if (user) {

                res.json({
                    success: true,
                    message: 'Login Success!',
                    token: service.createToken(user),
                    user: user
                });
            }

        }
    });
};