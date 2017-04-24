/*global document, window, alert, console, require*/

var mongoose = require('mongoose');
var Database = 'mongodb://cityadmin:changeMe@35.161.98.154:27017/admin';
var DBconnect = mongoose.createConnection(Database);

var userSchema = mongoose.Schema({
    admin            : {
        username     : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        photo        : String
    }
}, { collection : 'userinfo'});


module.exports = DBconnect.model('Users', userSchema);
