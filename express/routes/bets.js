// File containing APIs for betting functions
var router = require('express').Router();
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
router.get('/createBet', (req, res, next) => {
    res.render('create_bet', {title: 'CreateBet'});
});

// Render find bet page
router.get('/findBets', (req, res, next) => {
    res.render('find_bets', {title : 'FindBets'});
});

// Render debug and testing page
router.get('/debugTest', (req, res, next) => {
    res.render('debugAndTestingPage');
});

/**
 * <-------------------------------------------------------------------->
 *                              Bet APIs
 * <-------------------------------------------------------------------->
 */

// API to handle adding bet to database
router.post('/addBetToDataBase', function(req, res, next){
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
router.get('/getBetsInRegion', (req, res) => {
    let id = req.query.id;
    if(id != null){
        Bet.find({bet_region_id : id.toString()}, (err, bets) => {
            if(err){
                res.status(500).json({
                    "status" : "error",
                    "body" : "error"
                });
            }
            else{
                res.status(200).json(bets);
            }
        });
    }else{
        res.status(400).json({
            "status" : "error",
            "body": "Missing query parameter id"
        });
    }
});

/**
 * <-------------------------------------------------------------------->
 *                          Bet Region APIs
 * <-------------------------------------------------------------------->
 */

 // API for adding new betting region
 router.post('/addBettingRegion', function(req, res, next){
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

// API for getting available betting regions
router.get('/getBettingRegions', (req, res) => {
    // Verify query parameters
    let latitude = req.query.lat;
    let longitude = req.query.lng;

    if(latitude == null || longitude == null){
        res.status(400).json({
            "status" : "error",
            "body" : "Invalid query parameters"
        });
    }else if(isNaN(latitude) || isNaN(longitude)){
        res.status(400).json({
            "status" : "error",
            "body" : "Invalid coords"
        })
    }
    else{
        // Perform calculations server-side to increase perfromance
        BetRegion.find({}).exec((err, betRegions) => {
        if(err){
            res.status(500).json({
                "status" : "error",
                "body" : err
            });
        }else{
            let regionsToSend = [];
            const LEN = betRegions.length;
            for(let i = 0; i < LEN; i++){
                let betRegion = betRegions.pop();
                let d = calcDistance({lat : betRegion.latitude, lng : betRegion.longitude}, {lat : latitude, lng : longitude});
                // Convert kilometers to metres
                if((d * 1000) <= betRegion.radius){
                    regionsToSend.push(betRegion);
                    // console.log("Calculated Distance: " + (d * 1000).toString());
                    // console.log("Bet Radius: " + betRegion.radius.toString() + "\n");
                }
                // else{
                //     console.log("Calculated Distance: " + (d * 1000).toString());
                //     console.log("Bet Radius: " + betRegion.radius.toString() + "\n");
                // }
            }
            res.status(200).json(regionsToSend);
        }
    });
    }
});

// Allows user to add bet to betting region
router.put('/addBetToRegion', function(req, res, next){
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
router.get('/getRegionByID', function(req, res, next){
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
router.post('/addMultBets', function(req, res, next){
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
router.post('/addMultRegions', function(req, res, next){
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
router.put('/addMultBetsToRegion', function(req, res, next){
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

// API for getting bets from database
router.get('/getBets', function(req, res, next){
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

module.exports = router;
