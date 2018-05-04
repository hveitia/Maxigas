var express        = require("express"),
    cors           = require('cors'),
    app            = express(),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose       = require('mongoose'),
    config         = require('./config');
// Connection to DB
mongoose.connect('mongodb://localhost/' + config.dbName, function(err, res) {
    if(err)throw err;
    console.log('Connected to Database ' + config.dbName);
});

// Middlewares
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());


// API routes
var routesIndex = require('./routes/index');
var routesUser = require('./routes/user');
var routesDelivery = require('./routes/delivery');

app.use('/api', routesIndex);
app.use('/api', routesUser);
app.use('/api', routesDelivery);



// Start server
app.listen(config.port, function() {
  console.log("Node server running on http://localhost:" + config.port);
});
