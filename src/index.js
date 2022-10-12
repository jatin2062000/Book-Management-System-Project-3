const express = require('express')
const bodyParser = require('body-parser')
const router = require('./router/route')
const mongoose = require('mongoose')
const app = express();

const multer= require("multer")
const { AppConfig } = require('aws-sdk');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use( multer().any())

mongoose.connect("mongodb+srv://prabhas:Password1*@cluster0.j1kcoh4.mongodb.net/group55Database",{

  useNewUrlParser : true
})

.then(()=> console.log("mongoDb is connected"))
.catch(err=> console.log(err))

app.use('/',router)

app.listen(process.env.PORT || 3000,function(){

    console.log("express app running on port" + (process.env.PORT||3000))
})
