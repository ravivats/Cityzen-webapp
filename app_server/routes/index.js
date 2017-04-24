var express = require('express');
var router = express.Router();

/* GET home page. */
var Onboard = require('../controllers/onboard');
var Profile = require('../controllers/profile');
var Dashboard = require('../controllers/dashboard');
var Complains = require('../controllers/complains');
var Admin = require('../controllers/admin');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cityzen - A smart cityzen complaint addressal platform' });
});
router.get('/about', function(req, res){
  res.render('about', {title: "About Us | Cityzen"});
})
router.get('/login', Onboard.login);
router.get('/signup', Onboard.signup);
router.get('/profile/create', Profile.create);
router.post('/profile/add', Profile.add);
router.get('/dashboard', Dashboard.main);
router.get('/dashboard/addressed', Dashboard.addressed);
router.get('/approve/:id', Complains.approve);
router.get('/address/:id', Complains.address);
router.post('/complains/lodge', Complains.register);
router.get('/admin', Admin.main);
router.get('/admin/login', Admin.login);
router.get('/admin/analysis', Admin.analysis);
router.get('/admin/analysis/01', Admin.analysis01);
router.get('/admin/analysis/02', Admin.analysis02);
router.post('/admin/analysis/03', Admin.analysis03);
router.get('/admin/analysis/04', Admin.analysis04);
router.get('/admin/analysis/05', Admin.analysis05);
router.get('/complains/view/:id', Complains.view);
router.get('/admin/areas', Admin.area);
router.post('/admin/hareas', Admin.hareas);


module.exports = router;
