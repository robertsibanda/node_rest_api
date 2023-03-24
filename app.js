const connectDB = require("./db/connect");
const jwt = require('jsonwebtoken');
const express = require('express');

const CourseRouter = require('./routes/coursesRoutes');
const taskRouter = require("./routes/tasksRoutes");
const NotFound = require("./middleware/not-found");
//const passport = require("passport")

const Mainrouter = require('./routes/mainRoutes');
const app = express();

//middleware
app.use(express.json());
app.use(express.static('./public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

//routes
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/courses', CourseRouter);
app.use('/api/v1/', Mainrouter);

app.use(NotFound);

const start = async () => {
    try {
        await connectDB();
        app.listen(3000, ()=>{
            console.log('server running @ 3000');
        });
    } catch (error) {
        
    }
}

start();
