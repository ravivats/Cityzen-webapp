var Profile = require('../models/profile');
var Complain = require('../models/complains');

module.exports.main = function (req, res) {
  console.log(req.user.id);
  Complain.find({ComplainerID : req.user._id, Addressed : false}, function (err, comp) {
    if(err) throw err;
    Complain.find({Pin : req.cookies.pin, Addressed : false, ComplainerID : {$ne: req.user.id}, 'Approvals.id': {$ne: req.user.id}}, function(err, doc){
      if(err) throw err
      res.render('dashboard', {title : "Dashboard | Cityzen", name : req.cookies.name, photo: req.cookies.photo, yourcomplain: comp, nearcomplain: doc});
    });
  });
};

module.exports.addressed = function (req, res) {
  Complain.find({ComplainerID : req.user._id, Addressed : true}, function (err, comp) {
    if(err) throw err;
    Complain.find({Pin : req.cookies.pin, Addressed : false, ComplainerID : {$ne: req.user.id}, 'Approvals.id': {$ne: req.user.id}}, function(err, doc){
      if(err) throw err
      res.render('dashboard-addressed', {title : "Addressed Complains | Cityzen", name : req.cookies.name, photo: req.cookies.photo, yourcomplain: comp, nearcomplain: doc});
    });
  });
};
