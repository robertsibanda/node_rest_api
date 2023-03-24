const mongoose = require('mongoose');
const user = require("./users");

const TokenSchema = new mongoose.Schema({
    user : {
        
    }, 
    token : {
        type : String,
        required : true
    },
})

module.exports = mongoose.model('Token', TokenSchema);