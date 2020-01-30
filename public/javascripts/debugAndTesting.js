// Function for auto-generating bets in specified region
function generateRandomBets(){
    const REGION_ID = "5e2f72253c750c169c7c816c";

    $.get('/getRegionByID', {id : REGION_ID}, function(region){
        console.log(region);
        // Extract location data from region
        var lat = region.latitude;
        var lng = region.longitude;
        var rad = region.radius;

        // Calculate max and min latitudes
        var DELTA_DIS = (rad / 1000)  / 110.574;
        const MAX_LAT = lat + DELTA_DIS;
        const MIN_LAT = lat - DELTA_DIS;

        // Generate random latitude in constraints
        var randLat = generateRandomNumInInterval(MAX_LAT, MIN_LAT);
        
        // Calculate distance from original lat to random lat
        const RAD_EARTH = 6371;
        var changeLat = degToRad(lat - randLat);
        var changeLng = degToRad(0);
        var a = Math.sin(changeLat/2) * Math.sin(changeLat/2) + Math.cos(degToRad(lat)) * Math.cos(degToRad(randLat)) * Math.sin(changeLng/2) * Math.sin(changeLng/2);                                                         
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        DELTA_DIS =  RAD_EARTH * c;

        console.log("Change in distance: " + DELTA_DIS);

        // Get max change in longitude using trig (kilometres)
        var alpha = Math.pow((rad / 1000), 2);
        var beta = Math.pow(DELTA_DIS, 2);
        var limit = Math.sqrt(alpha - beta);

        console.log("Length of side: " + limit);

        // Max and minimum longitude values based on random lat value
        var max = lng + (limit / 111.32) * Math.cos(degToRad(randLat));
        var min = lng - (limit / 111.32) * Math.cos(degToRad(randLat));

        console.log("Max: " + max + " Min: " + min);

        var randLng = generateRandomNumInInterval(max, min);

        var bet = {
            latitude: randLat,
            longitude: randLng
        }

        console.log(bet);
    }, 'json');
    /*
    $.post('/addMultBets', {betData : bets}, function(data){
        console.log("Added bets to database");
    });

    */
}

// Returns (in kilometres) the change in latitude
function calculateChangeInLat(latOne, latTwo){
    const RAD_EARTH = 6371;
    var changeLat = degToRad(latOne - latTwo);
    var changeLng = degToRad(0);
    var a = Math.sin(changeLat/2) * Math.sin(changeLat/2) + Math.cos(degToRad(latOne)) * Math.cos(degToRad(latTwo)) * Math.sin(changeLng/2) * Math.sin(changeLng/2);                                                         
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return RAD_EARTH * c;
}

function degToRad(deg){
    return deg * (Math.PI /180);
    
}

// Similar to previous function but must use bet region schema instead
function generateRandomBetRegions(){
    const GALWAY = [53.345586, -9.202011, 53.264998, -8.909720];
    const NUIG = [53.288905, -9.071247, 53.277547, -9.056773];
    const NUM_BETS = 50;

    var coords = genRandomCoords(NUIG, NUM_BETS);
    var betRegions = [];

    for(var i = 0 ; i < NUM_BETS; i++){
        var newRegion = {};
        newRegion.region_name = "Random Bet Region: " + i.toString();
        newRegion.latitude = coords[i][0];
        newRegion.longitude = coords[i][1];
        newRegion.radius = Math.floor(generateRandomNumInInterval(500, 50));
        newRegion.num_bets = 0;
        newRegion.bet_ids = [];
        betRegions.push(newRegion);
    }

    betRegions.forEach(function(element){
        console.log(element);
    });

    $.post('/addMultRegions', { regions : betRegions}, function(data){
        console.log("Added regions to database");
    });
}

function genRandomCoords(location, num){
    var randomCoords = [];

    for(var i = 0; i < num; i++){
        randomCoords.push([generateRandomNumInInterval(location[0], location[2]), generateRandomNumInInterval(location[1], location[3])]);
    }
    return randomCoords;
}

function generateRandomNumInInterval(num1, num2){
    var difference = num1 - num2
    return (Math.random() * difference) + num2;
}

