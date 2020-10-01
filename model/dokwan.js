const mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const dokwan = mongoose.Schema({
    namaTempat: {
        type: String
    },
    nomorTelp: String,
    latitude: String,
    longitude: String,
    fav: {
        type: Boolean,
        default: false
    },
    history: {
        type: Boolean,
        default: false
    },
    gambar: Array,
    idUser: ObjectId,
    jenisHewan: [{
        nama: String
    }],
    perawatan: [{
        nama: String
    }]
});

module.exports = mongoose.model('dokwan', dokwan)
