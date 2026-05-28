/**
 * Student model.
 * @module models/student
 */

const mongoose = require('mongoose');

/** @type {mongoose.Schema} */
const StudentSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    },
    courses :  {

    },

    progress : [

    ],

    contacts : [
    
    ]

})

module.exports  = mongoose.model('Student', StudentSchema);