// File containing APIs for betting functions
var bets = require('express').Router();
var Bet = require('../models/betData');
var BetRegion = require('../models/bettingRegions');
var calcDistance = require('./calcDistance');
var mongoose = require('mongoose');

/**
 * <-------------------------------------------------------------------->
 *                      Page Rendering APIs
 * <-------------------------------------------------------------------->
 */

// Render create bet page
bets.get('/createBet', function(req, res, next){
    res.render('create_bet', {title: 'CreateBet'});
});

// Render find bet page
bets.get('/findBets', function(req, res, next){
    res.render('find_bets', {title : 'FindBets'});
});

// Render debug and testing page
bets.get('/debugTest', function(req, res, next){
    res.render('debugAndTestingPage');
});

/**
 * <-------------------------------------------------------------------->
 *                              Bet APIs
 * <-------------------------------------------------------------------->
 */

// API to handle adding bet to database
bets.post('/addBetToDataBase', function(req, res, next){
    var bet = new Bet(req.body);
    bet.save(function(err, savedBet){
        if(err){
            console.log(err);
        }
        else{
            res.json(savedBet);
        }
    });
});

// API for getting bets in region
bets.get('/getBetsInRegion', function(req, res, next){
    var id = req.query.id;
    Bet.find({bet_region_id : id}, function(err, bets){
        if(err){
            console.log(err);
        }
        else{
            res.json(bets);
        }
    });
});

// API for getting bets from database
bets.get('/getBets', function(req, res, next){
    // Perform calculations server-side to increase perfromance
    Bet.find({}).exec(function(err, bets){
        if(err){
            throw(err);
        }else{
            var sendBets = [];
            const LEN = bets.length;
            for(var i = 0; i < LEN; i++){
                var bet = bets.pop();
                var d = calcDistance({lat : bet.latitude, lng : bet.longitude}, {lat : req.query.latitude, lng : req.query.longitude});
                // Convert kilometers to metres
                if((d * 1000) <= bet.radius){
                    sendBets.push(bet);
                    /*
                    console.log("Included")
                    console.log("Bet Name: " + bet.title);
                    console.log("Calculated Distance: " + (d * 1000).toString());
                    console.log("Bet Radius: " + bet.radius.toString() + "\n");
                    */  
                }else{
                    /*
                    console.log("Not Included");
                    console.log("Bet Name: " + bet.title);
                    console.log("Calculated Distance: " + (d * 1000).toString());
                    console.log("Bet Radius: " + bet.radius.toString() + "\n");
                    */
                }
            }
            res.json(sendBets);
        }
    });
});

/**
 * <-------------------------------------------------------------------->
 *                          Bet Region APIs
 * <-------------------------------------------------------------------->
 */

 // API for adding new betting region
bets.post('/addBettingRegion', function(req, res, next){
    var region = new BetRegion(req.body);
    region.save(function(err, savedRegion){
        if(err){
            console.log(err);
        }
        else{
            res.json(savedRegion);
        }
    });
});

// API for getting available betting regi
bets.get('/getBettingRegions', function(req, res, next){
    // Perform calculations server-side to increase perfromance
    BetRegion.find({}).exec(function(err, betRegions){
        if(err){
            res.json(err);
        }else{
            //console.log(betRegions);
            var regionsToSend = [];
            const LEN = betRegions.length;
            for(var i = 0; i < LEN; i++){
                var betRegion = betRegions.pop();
                var d = calcDistance({lat : betRegion.latitude, lng : betRegion.longitude}, {lat : req.query.lat, lng : req.query.lng});
                // Convert kilometers to metres
                if((d * 1000) <= betRegion.radius){
                    regionsToSend.push(betRegion);
                    /*
                    console.log("Calculated Distance: " + (d * 1000).toString());
                    console.log("Bet Radius: " + betRegion.radius.toString() + "\n");
                    */
                }else{
                    /*
                    console.log("Calculated Distance: " + (d * 1000).toString());
                    console.log("Bet Radius: " + betRegion.radius.toString() + "\n");
                    */
                }
            }
            //console.log(regionsToSend);
            res.json(regionsToSend);
        }
    });
});

// Allows user to add bet to betting region
bets.put('/addBetToRegion', function(req, res, next){
    // Takes bet region id
    console.log(req.body);
    var regionID = mongoose.Types.ObjectId(req.body.regionID.toString());
    var betID = mongoose.Types.ObjectId(req.body.betID.toString());
    // Find corresponding region and include bet id in bets array and increment num bets
    BetRegion.findOneAndUpdate({'_id' : regionID}, { '$push' : {'bet_ids' : betID}, '$inc' : { 'num_bets' : 1}}, {useFindAndModify: false}).exec(function(err, betRegion){
        if(err){
            console.log(err);
        }
        else{
            res.json(betRegion);
        }
    });
});

// Gets specific region by id
bets.get('/getRegionByID', function(req, res, next){
    console.log(req.query.id);
    var id = mongoose.Types.ObjectId(req.query.id.toString());
    console.log(id);
    BetRegion.findById(id, function(err, betRegion){
        if(err){
            console.log(err);
        }
        else{
            res.json(betRegion);
        }
    });
});

/**
 * <-------------------------------------------------------------------->
 *                      Testing and Debug APIs
 * <-------------------------------------------------------------------->
 */

// API for adding multiple bets to database
bets.post('/addMultBets', function(req, res, next){
    //console.log(req.body);
    Bet.insertMany(req.body.betData, function(err, bets){
        if(err){
            console.log(err);
        }
        else{
            res.json(bets);
        }
    });

});

// API for adding multiple bet regions to database
bets.post('/addMultRegions', function(req, res, next){
    console.log(req.body);
    BetRegion.insertMany(req.body.regions, function(err, regions){
        if(err){
            console.log(err);
        }
        else{
            res.json(regions);
        }
    });
});

// API updates bet regions with multiple bets
bets.put('/addMultBetsToRegion', function(req, res, next){
    // Takes bet region id
    console.log(req.body);
    var regionID = mongoose.Types.ObjectId(req.body.regionID.toString());
   
    var bets = req.body.bets;
    var ids = [];
    for(var i = 0; i < bets.length; i++){
        ids.push(mongoose.Types.ObjectId(bets[i].toString()));
    }
    var numBets = bets.length;
    console.log(ids);
    // Find corresponding region and include bet id in bets array and increment num bets
    BetRegion.findOneAndUpdate({'_id' : regionID}, { '$push': { 'bet_ids': { '$each': ids }}, '$inc' : { 'num_bets' : numBets}}, {useFindAndModify: false}).exec(function(err, betRegion){
        if(err){
            console.log(err);
        }
        else{
            res.json(betRegion);
        }
    });
    
});

module.exports = bets;
