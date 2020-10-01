const mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const dokwan = mongoose.Schema({
    nama_dokter: String,
    nomorTelp: String,
    noIzinPrak: String,
    jadwalLayanan: [{
        hari: String,
        jam: String,
        ruang: String
    }],
    idDokwan: ObjectId
});

module.exports = mongoose.model('dokter', dokwan)
