const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    make: String,
    model: String,
    year: Number,
    price: Number,
    color: String
});

module.exports = mongoose.model('Car', carSchema);