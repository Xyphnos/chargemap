
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stationSchema = new Schema({

    Title: String,
    AddressLine1: String,
    Town: String,
    StateOrProvince: String,
    Postcode: String,
    Connections: [{ type: Schema.Types.ObjectId, ref: 'Connection' }],
    Location: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: true,
        },
        coordinates: {
            type: [[[Number]]], // first is longitude, second latitude
            index: "2dsphere",
            required: true,

        }

    },

});

module.exports = mongoose.model('Station', stationSchema);
