/*global document, window, alert, console, require*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Database = 'mongodb://cityadmin:changeMe@35.161.98.154:27017/admin';
var DBconnect = mongoose.createConnection(Database);
require('mongoose-double')(mongoose);


var SchemaTypes = mongoose.Schema.Types;

var smSchema = mongoose.Schema({
    category: String,
    smScore: {type: SchemaTypes.Double},
    areapin: Number,
    Area: String
}, { collection : 'similarity'});


module.exports = DBconnect.model('Areas', smSchema);
