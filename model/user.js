const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    namaTempat: {
        type: String
    },
    email : {
        type: String
    },
    nomorTelp : {
        type: String
    },
    password : {
        type: String
    },
})

module.exports = mongoose.model('user', userSchema)
