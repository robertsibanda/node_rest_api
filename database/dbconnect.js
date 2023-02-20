const mongoose = require("mongoose");

const url = "mongodb://localhost:27017" //use you mongodb server connection // i use mogodb-compass comunity

mongoose.connect(url, ()=>{
    console.log('database connected ')
});

