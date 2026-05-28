/**
 * User model.
 * @module models/users
 */

const mongoose = require('mongoose');

/** @type {mongoose.Schema} */
const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        maxlength : [45, 'Username must beless that 45 characters'],
        required : [true , "username is required"],
        trim : true,
    },
    password : {
        type : String,
        required : [true, 'Password is required']
    },

    staff : {
        type : Boolean,
        default : false
    },

    admin : {
        type : Boolean,
        default : false,
    },

    usertype :{
        type : String,
        default : 'normal'
    },
    
})

module.exports  = mongoose.model('Users', UserSchema);