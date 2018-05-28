var mongoose = require('mongoose');
var DELIVERYMODEL = mongoose.model('DELIVERYMODEL');


exports.options = function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');

    next();
};

exports.findAllLimits = function (req, res) {

    var limit = req.query.limit || 10;

    DELIVERYMODEL.find({}).limit(limit).exec(function (err, locations) {
        if (err) {
            return res.json(500, err);
        }

        res.status(200).jsonp(locations);
    });
};

exports.findAll = function (req, res) {

    DELIVERYMODEL.find(function (err, result) {

        if (err) res.send(500, err.message);

        res.status(200).jsonp(result);

    });
};

exports.findByState = function (req, res) {

    DELIVERYMODEL.find({state: req.params.state}, function (err, result) {

        if (err) res.send(500, err.message);

        res.status(200).jsonp(result);

    });
};

exports.attendDelivery = function (req, res) {

    DELIVERYMODEL.findById(req.params.id, function (err, delivery) {

        delivery.state = 'ATTENDED';
        delivery.userResponse = req.user;

        delivery.save(function (err, result) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(result);
        });

    });
};

exports.cancelDelivery = function (req, res) {

    DELIVERYMODEL.findById(req.params.id, function (err, delivery) {

        delivery.state = 'CANCELED';

        delivery.save(function (err, result) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(result);
        });

    });
};

exports.pendingDeliveryByUser = function (req, res) {

    DELIVERYMODEL.find({$and: [{userRequest: req.user}, {state: 'PENDING'}]})
        .exec(function (err, result) {

            if (err) {
                res.send(500, err.message);
            }

            res.status(200).jsonp(result);

        });
};

exports.attendedDeliveryByUserClient = function (req, res) {

    DELIVERYMODEL.find({$and: [{userRequest: req.user}, {state: 'ATTENDED'}]})
        .populate('userResponse')
        .exec(function (err, result) {

            if (err) {
                res.send(500, err.message);
            }

            res.status(200).jsonp(result);

        });
};

exports.onSiteDeliveryByUserClient = function (req, res) {

    DELIVERYMODEL.find({$and: [{userRequest: req.user}, {state: 'ONSITE'}]})
        .populate('userResponse')
        .exec(function (err, result) {

            if (err) {
                res.send(500, err.message);
            }

            res.status(200).jsonp(result);

        });
};

exports.successDeliveryByUserClient = function (req, res) {

    DELIVERYMODEL.find({$and: [{userRequest: req.user}, {state: 'SUCCESS'}]})
        .populate('userResponse')
        .exec(function (err, result) {

            if (err) {
                res.send(500, err.message);
            }

            res.status(200).jsonp(result);

        });
};

exports.attendedDeliveryByUserDistrib = function (req, res) {

    DELIVERYMODEL.find({$and: [{userResponse: req.user}, {state: 'ATTENDED'}]})
        .populate('userRequest')
        .exec(function (err, result) {

            if (err) {
                res.send(500, err.message);
            }

            res.status(200).jsonp(result);

        });
};

exports.addDelivery = function (req, res) {

    var obj = new DELIVERYMODEL({
        type: req.body.type,
        date: new Date().toString('dd/MM/yyyy HH:mm:ss'),
        userRequest: req.user,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        state: 'PENDING',
        address: req.body.address,
        valoration: 0
    });

    obj.save(function (err, result) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).jsonp(result);
    });
};

exports.addValoration = function (req, res) {

    DELIVERYMODEL.findById(req.params.id, function (err, delivery) {

        delivery.valoration = req.body.valoration;

        delivery.save(function (err, result) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(result);
        });

    });
};

exports.getValorationAverage = function (req, res) {

    DELIVERYMODEL.find({userResponse: req.params.user})
        .where('valoration').ne(0)
        .exec(function (err, result) {

            if (err) {
                res.send(500, err.message);
            }

            var length = result.length;

            if (length > 0) {

                var sum = result.reduce(function (previousValue, currentValue) {
                    return previousValue.valoration + currentValue.valoration;
                });

                res.status(200).jsonp((sum / length).toFixed(1));

            } else {
                res.status(200).jsonp(0);
            }

        });
};

exports.deleteDelivery = function (req, res) {

    DELIVERYMODEL.findById(req.params.id, function (err, delivery) {

        if (err) return res.status(500).send(err.message);

        delivery.remove(function (err) {

            if (err) return res.status(500).send(err.message);

            res.status(200).jsonp('OK');
        })
    });

};

exports.successDelivery = function (req, res) {

    DELIVERYMODEL.findById(req.params.id, function (err, delivery) {

        delivery.state = 'SUCCESS';

        delivery.save(function (err, result) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(result);
        });

    });

};

exports.onSiteDelivery = function (req, res) {

    DELIVERYMODEL.findById(req.params.id, function (err, delivery) {

        delivery.state = 'ONSITE';

        delivery.save(function (err, result) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(result);
        });

    });

};
