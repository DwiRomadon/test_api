const mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const utils = mongoose.Schema({
    macAddress: String,
    status : {
        fav: {default: false, type: Boolean},
        history: {default: false, type: Boolean}
    },
    idDokwan: ObjectId
});

module.exports = mongoose.model('utils', utils)
