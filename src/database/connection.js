const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/store_mongoose");
mongoose.Promise = global.Promise;

module.exports = mongoose;
