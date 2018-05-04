exports = module.exports = function (app, mongoose) {

    var USERMODEL = mongoose.model('USERMODEL');

    var deliverySchema = new mongoose.Schema({
        type: String,
        date: Date,
        latitude: String,
        longitude: String,
        currentLatitude: String,
        currentLongitude: String,
        state: String,
        address: String,
        valoration: Number,
        userRequest: {type: mongoose.Schema.ObjectId, ref: "USERMODEL"},
        userResponse: {type: mongoose.Schema.ObjectId, ref: "USERMODEL"}
    });

    mongoose.model('DELIVERYMODEL', deliverySchema);

};