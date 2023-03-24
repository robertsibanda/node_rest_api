const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name : {
        type : String,
        trim: true.valueOf,
        maxlength : [45, 'name cannot be more than 20 characaters'],
        required : [true, 'name cannot be blank'],
    },
    
    completed : {
        type : Boolean,
        default : false,
        //required : true,
    }
})

module.exports = mongoose.model('Task', TaskSchema);