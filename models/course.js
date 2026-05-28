const mongoose = require("mongoose");

courseSchema = new mongoose.Schema({
    name :  {
        type : String,
        required :  [true, 'Course name is required'],
        maxlength : 200
    },

    topics : [
        
    ],

    instructor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    }

});

module.exports = mongoose.model('Course', courseSchema);