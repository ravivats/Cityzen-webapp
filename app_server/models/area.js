/*global document, window, alert, console, require*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Database = 'mongodb://cityadmin:changeMe@35.161.98.154:27017/admin';
var DBconnect = mongoose.createConnection(Database);
require('mongoose-double')(mongoose);


var SchemaTypes = mongoose.Schema.Types;

var areaSchema = mongoose.Schema({
    area: String,
    AreaName: String, 
    lat: {type: SchemaTypes.Double},
    lng: {type: SchemaTypes.Double},
    pin: Number,
    HotArea: Boolean
}, { collection : 'area'});


module.exports = DBconnect.model('Areas', areaSchema);
