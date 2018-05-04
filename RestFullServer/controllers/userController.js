var mongoose = require('mongoose');
var USERMODEL = mongoose.model('USERMODEL');

exports.options = function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');

    next();
};

exports.findAll = function (req, res) {

    USERMODEL.find(function (err, result) {

        if (err) res.send(500, err.message);
        res.status(200).jsonp(result);

    });
};

exports.add = function (req, res) {

    var obj = new USERMODEL({
        name: req.body.name || '',
        pass: req.body.pass,
        email: req.body.email || '',
        phone: req.body.phone,
        state: 'ACTIVE',
        type: req.body.type,
        uuid: req.body.uuid || '',
        pushId: req.body.pushId || '',
        identificationDocument: req.body.identificationDocument || '',
        vehicleId: req.body.vehicleId || '',
        distributionStatus: 'ONLINE'
    });

    obj.save(function (err, result) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp(result);
    });
};

exports.changeDistributionStatus = function (req, res) {

    USERMODEL.findById(req.params.id, function (err, user) {

        if (err) res.send(500, err.message);

        user.distributionStatus = req.body.distributionStatus;

        user.save(function (err, result) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(result);
        });

    });

};

exports.addAddress = function (req, res) {

    USERMODEL.findById(req.params.id, function (err, user) {

        if (err) res.send(500, err.message);

        user.addressList.push({
            name: req.body.name,
            address: req.body.address,
            lat: req.body.lat,
            long: req.body.long,
            number: req.body.number
        });

        user.save(function (err, result) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(result);
        });

    });

};

exports.getAddressByUser = function (req, res) {

    USERMODEL.findById(req.params.id, function (err, user) {

        if (err) res.send(500, err.message);

        res.status(200).jsonp(user.addressList);

    });

};
