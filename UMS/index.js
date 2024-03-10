const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/user_managements_system")

const express = require("express");
const app = express();

// for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute)


// for admin route
const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute)

const port = process.env.PORT || 3000
app.listen(port,function(){
    console.log("Server is running........");
})