exports = module.exports = function (app, mongoose) {

    var addressSchema = new mongoose.Schema({
        name: String,
        address: String,
        number: String,
        lat: String,
        long: String
    });

    var cardSchema = new mongoose.Schema({
        name: String,
        emissor: String,
        num: String,
        cvv: String
    });

    var userSchema = new mongoose.Schema({
        name: String,
        pass:  String,
        email: String,
        phone:  String,
        state: String,
        createDate: {type: Date, default: new Date().toString('dd/MM/yyyy HH:mm:ss')},
        type:  String,
        uuid:  String,
        pushId:  String,
        cardList: {type: [cardSchema], default: []},
        addressList: {type: [addressSchema], default: []},
        identificationDocument: String,
        vehicleId: String,
        distributionStatus: String
    });

    mongoose.model('USERMODEL', userSchema);

};
