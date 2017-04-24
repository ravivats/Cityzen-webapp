var Complain = require('../models/complains');
var Area = require('../models/area');
var SM = require('../models/sm');

var request = require('request');
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
 
  // Optional depending on the providers 
  httpAdapter: 'https', // Default 
  apiKey: 'AIzaSyAE0LS71jwGKIlDq6XgXi-9aW_F7Qlj744', // for Mapquest, OpenCage, Google Premier 
  formatter: null         // 'gpx', 'string', ... 
};
 
var geocoder = NodeGeocoder(options);


module.exports.login = function (req, res) {
    res.render('admin-login', {title: "Admin Login | Cityzen"});
};

module.exports.main = function (req, res) {
    Complain.find({Addressed : false}).where('PriorityScore').gt(6.99).lt(10.01).sort({"PriorityScore" : -1}).exec(function(err, HighScore){
        if(err) throw err;
        Complain.find({Addressed : false}).where('PriorityScore').gt(3.99).lt(7).sort({"PriorityScore" : -1}).exec(function(err, MidScore){
            if(err) throw err;
            Complain.find({Addressed : false}).where('PriorityScore').gt(0).lt(4).sort({"PriorityScore" : -1}).exec(function(err, LowScore){
                if(err) throw err;
                res.render('admin-dash', {title: "Admin | Cityzen", high: HighScore, mid: MidScore, low: LowScore });
            })
        })
  });
};

module.exports.analysis = function(req, res) {
    Area.find({}, function(err, areadoc){
        if(err) throw err;
        return res.render('admin-analysis', { title : "Analysis", response: areadoc});
    });
    
};

module.exports.analysis01 = function(req, res) {
    Complain.find({Category : "Education"}, function(err, edu){
        if(err) throw err;
       Complain.find({Category : "Healthcare"}, function(err, health){
           if(err) throw err;
           Complain.find({Category : "Sanitation & Water supply"}, function(err, water){
               if(err) throw err;
               Complain.find({Category : "Law & Order"}, function(err, law){
                   if(err) throw err;
                   Complain.find({Category : "Waste Management"}, function(err, waste){
                       if(err) throw err;
                       Complain.find({Category : "Electricity"}, function(err, electric){
                           if(err) throw err;
                           Complain.find({Category : "Road & Transportation"}, function(err, road){
                               if(err) throw err;
                                res.render('complains-by-sector', {title : "Complains by Category | Cityzen", edu : edu.length, health : health.length, water : water.length, law: law.length, waste: waste.length, electric: electric.length, road: road.length });
                           })
                       })
                   })
               })
           })
       }); 

    });
    
};

module.exports.analysis02 = function(req, res) {
    Complain.find({Category : "Education"}, function(err, edu){
        if(err) throw err;
        var eduscore;
        if(!edu){eduscore = 0;}
        var total = 0;
        for(var i in edu) { total += edu[i].DayScore; }
        eduscore = total/edu.length;
       Complain.find({Category : "Healthcare"}, function(err, health){
           if(err) throw err;
           var healthscore;
           if(!healthscore){healthscore = 0;}
           var total = 0;
            for(var i in health) { total += health[i].DayScore; }
            healthscore = total/health.length;
           Complain.find({Category : "Sanitation & Water supply"}, function(err, water){
               if(err) throw err;
               var waterscore;
               if(!water){waterscore = 0;}
                total = 0;
                for(var i in water) { total += water[i].DayScore; }
                waterscore = total/water.length;
               Complain.find({Category : "Law & Order"}, function(err, law){
                   if(err) throw err;
                   var lawscore;
                   if(!law){lawscore = 0;}
                    var total = 0;
                    for(var i in law) { total += law[i].DayScore; }
                    lawscore = total/law.length;
                   Complain.find({Category : "Waste Management"}, function(err, waste){
                       if(err) throw err;
                       var wastescore;
                       if(!waste){wastescore = 0;}
                       var total = 0;
                        for(var i in waste) { total += waste[i].DayScore; }
                        wastescore = total/waste.length;
                       Complain.find({Category : "Electricity"}, function(err, electric){
                           if(err) throw err;
                           var electricscore;
                           if(!electric){electricscore = 0;}
                           var total = 0;
                            for(var i in electric) { total += electric[i].DayScore; }
                             electricscore = total/electric.length;
                           Complain.find({Category : "Road & Transportation"}, function(err, road){
                               if(err) throw err;
                               var roadscore;
                               if(!road){roadscore = 0;}
                               var total = 0;
                                for(var i in road) { total += road[i].DayScore; }
                                 roadscore = total/road.length;
                                res.render('complains-by-days', {title : "Avg.Days by Category | Cityzen", edu : eduscore, health : healthscore, water : waterscore, law: lawscore, waste: wastescore, electric: electricscore, road: roadscore });
                           })
                       })
                   })
               })
           })
       }); 

    });
};

module.exports.analysis03 = function(req, res) {
    Complain.find({Pin : req.body.comparepin01}, function(err, Pin1){        
        if(err)throw err;
        Area.find({pin: req.body.comparepin01}, function(err, area1){
            if(err) throw err;
            Complain.find({Pin : req.body.comparepin02}, function(err, Pin2){
                if(err) throw err;
                Area.find({pin: req.body.comparepin02}, function(err, area2){
                    if(err) throw err;
                    res.render('complains-by-pin', {title : "Compare Regions | Cityzen", pin1 : Pin1.length, pin2: Pin2.length, name1: area1, name2: area2});
                });             
            });
        });

    });
};

module.exports.analysis04 = function(req, res) {
    Complain.find({}, function(err, doc){
        total = "";
        for(var i in doc) { total += "" + doc[i].Description; }
        request.post({url:'http://text-processing.com/api/sentiment/', form: {text:total}}, function(err,httpResponse,body){
            if(err) throw err;
            var pos = JSON.parse(body).probability.pos * 100;
            var neg = JSON.parse(body).probability.neg * 100;
            res.render('sentiment-analysis', {title: "Public Mood Analysis", pos: pos, neg: neg });
            console.log(total);
        });
    });
};

module.exports.analysis05 = function(req, res) {
    Area.find({HotArea: true}, function(err, harea){
        res.render('hotareas', {title : "Hot Areas | Cityzen", loc: harea});
    })
    
};

module.exports.area = function(req, res){
    res.render('area', {title: "Areas"});
};

module.exports.hareas = function(req, res){
    var area = req.body.area + ", Bengaluru";
    geocoder.geocode(area, function (err, data) { 
        console.log(data[0].latitude);
            var AreaDetails = {
                area: req.body.area,
                AreaName: area,
                lat: data[0].latitude,
                lng: data[0].longitude,
                pin: req.body.pin,
                HotArea: false
            };
            var edu = {
                category: "Education",
                smScore: 0,
                areapin: req.body.pin,
                Area: req.body.area
            };
            var health = {
                category: "Healthcare",
                smScore: 0,
                areapin: req.body.pin,
                Area: req.body.area       
            };
            var waste = {
                category: "Waste Management",
                smScore: 0,
                areapin: req.body.pin,
                Area: req.body.area 
            };
            var water = {
                category: "Sanitation & Water supply",
                smScore: 0,
                areapin: req.body.pin,
                Area: req.body.area
            };
            var law = {
                category: "Law & Order",
                smScore: 0,
                areapin: req.body.pin,
                Area: req.body.area
            };
            var elec = {
                category: "Electricity",
                smScore: 0,
                areapin: req.body.pin,
                Area: req.body.area
            };
            var road = {
                category: "Road & Transportation",
                smScore: 0,
                areapin: req.body.pin,
                Area: req.body.area
            };
            Area.find({pin: req.body.pin}).count(function(err, count){
                if(count > 0){
                    res.redirect('/admin/areas');
                }
                else{
                    Area.create(AreaDetails);
                    SM.create(waste);
                    SM.create(water);
                    SM.create(law);
                    SM.create(road);
                    SM.create(edu);
                    SM.create(health);
                    SM.create(elec);
                    res.redirect('/admin/areas');
                }
            });
    });

}