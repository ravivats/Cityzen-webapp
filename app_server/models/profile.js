/*global document, window, alert, console, require*/

var mongoose = require('mongoose');
var Database = 'mongodb://cityadmin:changeMe@35.161.98.154:27017/admin';
var DBconnect = mongoose.createConnection(Database);

var ProfileSchema = mongoose.Schema({
  name: String,
  address: String,
  state: String,
  city: String,
  pin: String,
  phone: String,
  photo: String,
  id: String
}, { collection : 'profile'});


module.exports = DBconnect.model('Profiles', ProfileSchema);

