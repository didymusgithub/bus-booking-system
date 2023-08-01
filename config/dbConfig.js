const mongoose = require('mongoose');

// connection to the database
mongoose.connect(process.env.MONGODB_URL);

// this is to check if the connection is succesful or not
const db = mongoose.connection;
db.on('connected', ()=>{
    console.log("mongodb connection succesful");
})

db.on('error', ()=>{
    console.log("connection error");
})