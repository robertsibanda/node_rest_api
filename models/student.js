const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    },
    courses :  {

    },

    progress : [
        //course. topic, programm
    ],

    contacts : [
    
    ]

})

module.exports  = mongoose.model('Student', StudentSchema);