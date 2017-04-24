module.exports.login = function (req, res) {
  res.render('login', { title : "Login | Cityzen"});
};

module.exports.signup = function (req, res) {
  res.render('signup', { title : "Sign Up | Cityzen"});
};
