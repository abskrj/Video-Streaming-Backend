const express = require("express");
let bodyParser = require("body-parser");
let cors = require("cors");
const logger = require("morgan");
const dotenv = require("dotenv");
let compression = require('compression');

const app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("combined"));
app.use(compression());

const mongoConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    useCreateIndex: true
};

const db = require("./models");

db.mongoose.connect(process.env.MONGO_URI, mongoConnectOptions)
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });


// Routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/video.routes')(app);
require('./routes/list.routes')(app);
require('./routes/utils.routes')(app);

// Listen
const PORT = process.env.PORT;

app.listen(PORT || 3000, function () {
    console.log("Server is running on Port: " + (PORT || 3000));
});