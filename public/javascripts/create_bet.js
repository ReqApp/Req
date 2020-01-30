const MIN_BET_RAD = 20;

// Visual elements of bet
var area;
var marker;

// User input DOM elements
var betNameDOM;
var locationDOM;
var radiusDOM;

// Object containing information about bet
var betData = {title : 'New Bet', location_Name: 'location', latitude : 0, longitude : 0, radius: DEFAULT_RAD};

$(document).ready(function(){
    // Get input elements
    betNameDOM = $('#betName');
    locationDOM = $('#location');
    radiusDOM = $('#rad');
    
    // Set default bet data
    betNameDOM.val(betData.title);
    radiusDOM.val(betData.radius);
    
    loadMap('mapID'); // Function located in maps.js
    
    // Wait for user position to be obtained
    $(window).on('locRetrieved', function (data) {
        console.log('locRetrieved', data.location);
        // TODO
            // When user makes new region display immediatley on map
        getAvailableRegions(data.location);
        addMapMarkers(data.location);
    });
    
    // Add bet to database
    $('#createBet').click(addBetToDataBase);
    $('#createBetRegion').click(addNewBetRegion);
});

// Retrieve regions where user is located in from database
function getAvailableRegions(userPos){
    // Testing code
    var locData = setLocation(userPos);

    // Send user location to server
    $.get('/getBettingRegions', {latitude : locData.latitude, longitude : locData.longitude }, function(betRegions, status, XHR){
        // Check if any regions available
        if(Array.isArray(betRegions) && betRegions.length){
            $('#selectRegion').html('<select id="dropDown"></select>')
            displayRegions(betRegions);
        }else{
            console.log("There are no current betting regions in your area.");
            // Allow user to define new region
        }
    }, 'json');
}

// Visually show existing regions on map where user in located in
function displayRegions(betRegions){
    // Add marker, circle and popup to map to denote region
    betRegions.forEach(betRegion => {
        var latLng = L.latLng(betRegion.latitude, betRegion.longitude);
        var marker = L.marker(latLng);
        marker.bindPopup(betRegion.region_name, {closeButton : false});
        var circle = L.circle(latLng, {
            color : 'red',
            fillColor : 'red',
            fillOpacity : 0.2,
            radius : 0
        });
        marker.addTo(map);
        circle.addTo(map);
        betRegionCircle = new BetArea(circle);
        betRegionCircle.expand(betRegion.radius);
        $('#dropDown').html('<option value=' + betRegion._id + '>' + betRegion.region_name + '</option>');
    });
}

// Allows user to define new region where bets can be created and placed
function addNewBetRegion(){
    var betRegion = {
        region_name : betNameDOM.val(), 
        latitude : betData.latitude, 
        longitude : betData.longitude,
        radius : radiusDOM.val(),
        bet_ids : []
    }

    $.post('/addBettingRegion', betRegion, function(data){
        console.log('Added bet region to database');
    }, 'json');
}

function addBetToDataBase(){      
    // Use put request to add bet to region
    // Send bet region id and bet id

    var dataToSend = {};
    $.post('/addBetToDataBase', betData, function(res){
        console.log("Added data to database");
        dataToSend.betID = res._id.toString();
        dataToSend.regionID = $('#dropDown').val().toString();
        $.ajax({
            url : '/addBetToRegion',
            type : 'PUT',
            data : dataToSend,
            success : function(res){
                console.log(res);
            }
        });
    }, 'json');
}

function addMapMarkers(pos){
    //DEBUG setting location
    pos = setLocation(pos);
    // Check for level of accuracy
    if(pos.accuracy > 100){
        console.log("Location could not accurately be determined");

    }
    else{
        // Include lat and long in data to add to database
        var latLong = L.latLng(pos.latitude, pos.longitude);
        betData.latitude = latLong.lat;
        betData.longitude = latLong.lng;
        
        // Adding location marker to map
        marker = L.marker(latLong);
        marker.addTo(map);

        // Reverse Geocoding
        $.ajax('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + pos.latitude + '&longitude=' + pos.longitude + '&localityLanguage=en', {success : function(data, status, xhr){
            console.log(data);
            // Extract user location    
            var len = data.localityInfo.informative.length;
            betData.location = data.localityInfo.informative[len - 1].name;
            locationDOM.val(betData.location);
            
            // Create default marker and circle
            marker.bindPopup(formatPopUp(betData), {closeButton : false, className: 'popUp'}).openPopup();
            
            const zoomDuration = 1;
            
            map.flyTo(latLong, 16, {animate : true, duration: zoomDuration, easeLinearity : .43});
            
            window.setTimeout(function(){
                area = L.circle(latLong, {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.25,
                radius: 0
                }).addTo(map);
                
                betArea = new BetArea(area);
                betArea.expand(DEFAULT_RAD);
                
            }, zoomDuration * 1000);
            
            
            // Update popUp when input fields are changed
            locationDOM.keyup(function(){
                betData.location = locationDOM.val();
                marker._popup.setContent(formatPopUp(betData));
            });
            
            betNameDOM.keyup(function(){
                betData.title = betNameDOM.val();
                marker._popup.setContent(formatPopUp(betData));
            });
            
            radiusDOM.keyup(function(){
                betData.radius = radiusDOM.val();
                marker._popup.setContent(formatPopUp(betData));
                var val = parseInt(radiusDOM.val());
                if(val >= MIN_BET_RAD){
                    area.setRadius(parseInt(radiusDOM.val()));
                }
            });

        }});
    }
}

// Returns formatted string content of popup
function formatPopUp(betData){
    return '<b>' + betData.title + '</b><br>Location: ' + betData.location + '<br>Radius: ' + betData.radius;
}

// DEBUG function for setting user position
function setLocation(position){

    position.latitude = 53.337840;
    position.longitude = -9.180165;
    /*
    position.latitude = 53.282110;
    position.longitude = -9.062186;
    */
    position.accuracy = 40;
    return position;
}
