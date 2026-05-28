/**
 * Token model for storing refresh tokens.
 * @module models/tokens
 */

const mongoose = require('mongoose');

/** @type {mongoose.Schema} */
const TokenSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    }, 
    token : {
        type : String,
        required : true
    },
})

module.exports = mongoose.model('Token', TokenSchema);