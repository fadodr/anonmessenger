const express = require('express')
const app = express()
const userroutes = require('./routes/user')
const messageroutes = require('./routes/message');
const mongoose = require('mongoose');

require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Credentials");
  next();
});

app.use('/user', userroutes);
app.use('/message', messageroutes);

app.use((req, res, next) => {
    const error = new Error('Page not found')
    error.statuscode = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.statuscode).json({
        error : error.message
    })
})

mongoose.connect('mongodb+srv://fadoag:playboy10@shop.kqlba.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
.then(() => console.log('database successfully connected')).catch(error => console.log(error))

app.listen(3000, console.log('running on port 3000'))