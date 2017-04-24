/*global document, window, alert, console, require*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Database = 'mongodb://cityadmin:changeMe@35.161.98.154:27017/admin';
var DBconnect = mongoose.createConnection(Database);
require('mongoose-double')(mongoose);


var SchemaTypes = mongoose.Schema.Types;
var ApprovalSchema = mongoose.Schema({ id : String});
var complainSchema = mongoose.Schema({
        ComplainerID : String,
        ComplainerName : String,
        Pin : Number,
        Subject : String,
        Description : String,
        PeopleAffected : String,
        FacingSince : String,
        DayScore: {type: SchemaTypes.Double},
        Category : String,
        PriorityScore: {type: SchemaTypes.Double},
        Approvals : [ApprovalSchema],
        Anonymous : {type : Boolean, default : false},
        Addressed : {type : Boolean, default : false}
}, { collection : 'complains'});


module.exports = DBconnect.model('Complains', complainSchema);
