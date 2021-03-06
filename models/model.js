const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: String,
    date: String,
    time: String,
    location: String,
    lat_in: String,
    lng_in: String,
    details: String
});

const Event = mongoose.model('Events', eventSchema);

module.exports = Event;