const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config(); 


mongoose.connect(process.env.DBUSERS);

const User = mongoose.model('User',{
    username: {type: String, required: true, minLength: 5},
    password: {type: String, required: true},
    salt: {type: String, required: true}
});

module.exports =  User;