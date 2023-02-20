const mongoose = require("mongoose");

const url = "mongo://" //use you mongodb server connection

mongoose.connect(url, ()=>{
    console.log('database connected ')
});

