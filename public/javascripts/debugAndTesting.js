// Function for auto-generating bets in specified area
function generateRandomBets(){
    // TODO 
        // Add script for creating bet regions
        // Update generate random bets to work with bet regions

        // Accept bet region id as param
        // Find bet region and generate bets inside that region
        // Must be in circular area

    // Max lat, min lng, min, lat, max lng
    const GALWAY = [53.345586, -9.202011, 53.264998, -8.909720];
    const NUIG = [53.288905, -9.071247, 53.277547, -9.056773];
    const NUM_BETS = 50;

    var coords = genRandomCoords(NUIG, NUM_BETS);
    var bets = [];

    for(var i = 0 ; i < NUM_BETS; i++){
        var newBet = {};
        newBet.title = "Random Bet: " + i.toString();
        newBet.location_Name = "Location: " + i.toString();
        newBet.latitude = coords[i][0];
        newBet.longitude = coords[i][1];
        newBet.radius = Math.floor(generateRandomNumInInterval(500, 50));
        bets.push(newBet);
    }

    bets.forEach(function(element){
        console.log(element);
    });
    
    $.post('/addMultBets', {betData : bets}, function(data){
        console.log("Added bets to database");
    });

}

// Similar to previous function but must use bet region schema instead
function generateRandomBetRegions(){

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

