const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const {MONGODB_URL} = require('./config')

global.__basedir = __dirname;

mongoose.connect(MONGODB_URL);

mongoose.connection.on('connnected', ()=>{
    console.log('DB Connected successfully!')
})
mongoose.connection.on('error', (error)=>{
    console.log('DB connection failed')
})

require('./models/user_model');
require('./models/entry_model');

app.use(cors());
app.use(express.json());

app.use(require('./routes/user_route'));
app.use(require('./routes/entry_route'));




app.listen(4000, () =>{
    console.log("server started successfully...");
})