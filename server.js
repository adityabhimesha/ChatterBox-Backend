const express = require('express')
const morgan = require('morgan')
const app = express()
var http = require('http').createServer(app);
const port = process.env.PORT || 8080
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cron = require("./misc/cron_del")
var cookieParser = require('cookie-parser');
const path = require("path")

//DATABASE
dotenv.config()
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Database Connection Successful!")
)

http.listen(port, function() {
        console.log("Server and Socket connections running at ", port);
    })
    // app.listen(port, function() {
    //     console.log("Server running at ", port);
    // })

exports.io = require('socket.io')(http);

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

//CRON job to delete stories.
cron.cronJob.start();

//Routes
app.use('/auth', require("./routes/auth"))
app.use('/story', require("./routes/video"))
app.use('/', require("./routes/home"))
app.use('/', express.static(path.join(__dirname, 'public/dist/')))
app.use('/static', express.static(path.join(__dirname, 'public/uploads/')))