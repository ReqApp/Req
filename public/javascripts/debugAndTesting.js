// Function for auto-generating bets in specified area
function generateRandomBets(){
    // TODO 
        // Add script for creating bet regions
        // Update generate random bets to work with bet regions

        // Accept bet region id as param
        // Find bet region and generate bets inside that region
        // Must be in circular area
    // Find region from database
    const REGION_ID = "";
    // Create random bets inside area
        // Calculate lat of long 
        // Get random long inside interval
        // Use trig to find max value of lat

    
    $.post('/addMultBets', {betData : bets}, function(data){
        console.log("Added bets to database");
    });

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
        newRegion.region_name = "Random Bet: " + i.toString();
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

