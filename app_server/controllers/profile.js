var Profile = require('../models/profile');

module.exports.create = function (req, res) {
  res.render('create_profile', { title : "Create Profile | Cityzen", Name : req.user.facebook.name });
};

module.exports.add = function (req, res) {
    var UserProfile = {
      name: req.body.name,
      address: req.body.address,
      state: req.body.state,
      city: req.body.city,
      pin: req.body.pin,
      phone: req.body.phone,
      photo: req.user.facebook.photo,
      id: req.user._id
    };

  Profile.create( UserProfile, function(err, doc) {
    if(err) throw err;
    res.cookie('name', req.body.name, { expires: 0, httpOnly: true });
    res.cookie('pin', req.body.pin, { expires: 0, httpOnly: true });
    res.cookie('photo', req.user.facebook.photo, { expires: 0, httpOnly: true });
    res.redirect('/dashboard');
  });
};
