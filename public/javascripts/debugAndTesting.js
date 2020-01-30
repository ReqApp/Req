// Function for auto-generating bets in specified region
function generateRandomBets(){
    const REGION_ID = "5e2f72253c750c169c7c816c";
    const NUM_BETS = 20;

    $.get('/getRegionByID', {id : REGION_ID}, function(region){
        console.log('Selected region:');
        console.log(region);
        // Extract location data from region
        var lat = region.latitude;
        var lng = region.longitude;
        var rad = region.radius;

        // Holds auto bets to send to database
        var newBets = [];

        // Calculate max and min latitudes
        var DELTA_DIS = (rad / 1000)  / 110.574;
        const MAX_LAT = lat + DELTA_DIS;
        const MIN_LAT = lat - DELTA_DIS;

        for(var i = 0; i < NUM_BETS; i++){
            // Generate random latitude in constraints
            var randLat = generateRandomNumInInterval(MAX_LAT, MIN_LAT);
            
            // Calculate distance from original lat to random lat
            DELTA_DIS = calculateChangeInLat(lat, randLat);
            //console.log("Change in distance: " + DELTA_DIS);

            // Get max change in longitude using trig (kilometres)
            var alpha = Math.pow((rad / 1000), 2);
            var beta = Math.pow(DELTA_DIS, 2);
            var limit = Math.sqrt(alpha - beta);
            //console.log("Length of side: " + limit);

            // Max and minimum longitude values based on random lat value
            var max = lng + (limit / 111.32) * Math.cos(degToRad(randLat));
            var min = lng - (limit / 111.32) * Math.cos(degToRad(randLat));
            //console.log("Max: " + max + " Min: " + min);

            var randLng = generateRandomNumInInterval(max, min);
            //console.log("Lng: " + randLng);

            // Create new random bet object
            var newBet = {
                title: "Random Bet: " + i.toString(),
                location_Name: "Location: " + i.toString(),
                latitude: randLat,
                longitude: randLng,
                radius: generateRandomNumInInterval(20, 100),
                bet_region_id: REGION_ID
            }
            newBets.push(newBet);
        }
        //console.log(newBets);

        // Use testing API for adding multiple bets at once
        $.post('/addMultBets', {betData : newBets}, function(bets){
            console.log('Returned bets: ');
            console.log(bets);
            // Create array of bet ids
            var ids = [];
            for(var i = 0; i < bets.length; i++){
                ids.push(bets[i]._id.toString());
            }

            // Add ids to bet region
            $.ajax({
                url: '/addMultBetsToRegion',
                type: 'PUT',
                data: {regionID : REGION_ID, bets : ids},
                success : function(betRegion){
                    console.log("Updated bet region:");
                    console.log(betRegion);
                }
            });
        });

    }, 'json');
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

// Degrees to radian converter
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

