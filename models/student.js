const mongoose = require('mongoose');
const user = require('./users')

const StudentSchema = new mongoose.Schema({
    user,
    courses :  {

    },

    progress : [
        //course. topic, programm
    ],

    contacts : [
    
    ]

})

module.exports  = mongoose.model('Student', StudentSchema);