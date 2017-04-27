var textsimilarity = require('textsimilarity');
var Complain = require('../models/complains');
var Area = require('../models/area');
var SM = require('../models/sm');

module.exports.register = function (req, res) {
    var days;
    var daysrange;
    var categoryscore;
    var categoryname;
    var peoplescore;
    var peoplerange;
    switch (Number(req.body.complainday)) {
        case 1 :
            days = 2.5;
            daysrange = "1-20 days";
            break;
        case 2 :
            days = 5;
            daysrange = "20-60 days";
            break;
        case 3 :
            days = 7.5;
            daysrange = "60-100 days";
            break;
        case 4 :
             days = 10;
             daysrange = "100+ days";
    };
    switch (Number(req.body.complaincat)) {
        case 1 :
            categoryscore = 10;
            categoryname = "Education";
            break;
        case 2 :
            categoryscore = 8.58;
            categoryname = "Healthcare";
            break;
        case 3 :
            categoryscore = 7.15;
            categoryname = "Sanitation & Water supply";
            break;;
        case 4 :
            categoryscore = 5.72;
            categoryname = "Law & Order";
            break;
        case 5 :
            categoryscore = 4.29;
            categoryname = "Waste Management";
            break;
        case 6 :
            categoryscore = 2.86;
            categoryname = "Electricity";
            break;
        case 7 :
            categoryscore = 1.43;
            categoryname = "Road & Transportation";
    };
    switch (Number(req.body.complainpeople)) {
        case 1 :
            peoplescore = 2.5;
            peoplerange = "1-20 people";
            break;
        case 2 :
            peoplescore : 5;
            peoplerange = "20-60 people";
            break;
        case 3 :
            peoplescore = 7.5;
            peoplerange = "60-100 people";
        case 4 :
            peoplescore = 10;
            peoplerange = "100+ people";
    };
    var pscore = (days + categoryscore + peoplescore)/3;
    var score = Number(pscore);
    var ComplainDetail = {
        ComplainerID : req.user._id,
        ComplainerName : req.cookies.name,
        Pin : req.cookies.pin,
        Subject : req.body.complainsub,
        Description : req.body.complaindesc,
        PeopleAffected : peoplerange,
        FacingSince : daysrange,
        Category : categoryname,
        PriorityScore: pscore,
        DayScore: days
    };
    Complain.create(ComplainDetail, function (err, doc) {
        if(err) throw err;
        Complain.find({Category: categoryname, Pin: req.cookies.pin, Addressed: false}, function(err, sm){
            total = "";
            for(var i in sm) { total += "" + sm[i].Description; }
            SM.find({category: categoryname, areapin: req.cookies.pin}, function(err, comp){
                comp.smScore  = textsimilarity(total, req.body.complaindesc);
                SM.update({ category: categoryname, areapin: req.cookies.pin }, { $set: { smScore: textsimilarity(total, req.body.complaindesc) }}).exec();
                SM.find({areapin: req.cookies.pin}).where('smScore').gt(0.3).lt(1.0).exec(function(err, score){
                    if(err) throw err;
                    if(score.length > 0){
                        if(sm.length >= 5){
                            Area.find({pin: req.cookies.pin}, function(err, sarea){
                                sarea.HotArea = true;
                                Area.update({ pin: req.cookies.pin }, { $set: { HotArea: true }}).exec();
                                res.redirect('/dashboard');
                            });
                        }
                        else{
                            res.redirect('/dashboard');
                            console.log("here");
                        }
                    }
                    else{
                        res.redirect('/dashboard');
                        console.log("there");
                    }
                });
            });
        });
    });
    
};

module.exports.approve = function(req,res) {
    Complain.findByIdAndUpdate(
        req.params.id,
        {$push: {"Approvals": {id: req.user.id}}},
        {safe: true, upsert: true},
        function (err, doc) {
            if(err) throw err;
            var plus = Number("0.1");
            doc.PriorityScore+= plus;
            doc.save;
            res.send("done");
        }
    );
};

module.exports.address = function(req,res) {
    Complain.findByIdAndUpdate(
        req.params.id, 
        {$set: {'Addressed': true}},
        function(err, doc){
        if(err) throw err;
        res.send("done");
    });
};

module.exports.view = function(req, res){
    Complain.find({_id: req.params.id}, function(err, comp){
        if(err) throw err;
        Complain.find({Pin : req.cookies.pin, Addressed : false, ComplainerID : {$ne: req.user.id}, 'Approvals.id': {$ne: req.user.id}}, function(err, doc){
            if(err) throw err
            res.render('viewcomplains', {title : "View Complains | Cityzen", name : req.cookies.name, photo: req.cookies.photo, viewcomplain: comp, nearcomplain: doc});
        });
    });
}
