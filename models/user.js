var mongoose = require('mongoose');
var moment = require('moment');

var userSchema = new mongoose.Schema({
    name: {type: String, unique: true, lowercase: true, default: ''},
    password: {type: String, default: ''},
    createdTimeStamp: {type: String, default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")} 
});

module.exports = mongoose.model('userSchema', userSchema);