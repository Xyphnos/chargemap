
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stationSchema = new Schema({

    Title: String,
    AddressLine1: String,
    Town: String,
    StateOrProvince: String,
    Postcode: String,
    Connections: [{Type: Schema.Types.ObjectId, ref: 'Connection'}],
    Location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], // first is longitude, second latitude
            required: true,

        }

    }

});

module.exports = mongoose.model('Station', stationSchema);
