class CreateBetMap extends Map{
    constructor(domID, options){
        super(domID, options);
    }
    // Add marker to display user's location
    showUserLocation(userLocation){
        L.marker(this.userLocation).addTo(this.map);
    }
    // Testing function to manually set user's location
    set userLocation(position){
        this._userLocation = position;
    }
    get userLocation(){
        return this._userLocation;
    }
}

const MIN_BET_RAD = 20;

// Object containing information about bet
var betData = {title : 'New Bet', location_Name: 'location', latitude : 0, longitude : 0, radius: DEFAULT_RAD};

$(document).ready(async () => {
    // Map setup
    betMap = new CreateBetMap('mapID', options);
    betMap.createMap();

    // Get input DOM elements
    var betNameDOM = $('#betName');
    var locationDOM = $('#location');
    var radiusDOM = $('#rad');
    var selectRegionDOM = $('#selectRegion');

    // Small delay for stability
    window.setTimeout(async () => {
        var result = await betMap.locateUser();

        // Check if valid location returned
        if('latlng' in result){
            // Manually set user location
            result.latlng = setLocation(result.latlng);
            result.accuracy = 40;
            // Check for location accuracy
            if(result.accuracy > 100){
                console.log("Your location could not be accuratly determined");
            }else{
                betMap.userLocation = result.latlng;
            }
        }else{
            console.log("Could not find user location")
            console.log(result.message);
        }
    
        betMap.showUserLocation(betMap.userLocation);
        const zoomDuration = 1;
        betMap.map.flyTo(betMap.userLocation, 15, {animate : true, duration: zoomDuration, easeLinearity : .43});

        setDOMDefaultValues(betNameDOM, locationDOM, radiusDOM, betMap.userLocation);
    
        // Get betting regions
        // TODO update docs on query params change
        var regions = await getBettingRegions(betMap.userLocation);
        console.log(regions);
        
        // Check if user is in one or more bet regions
        if(Array.isArray(regions) && regions.length){
            betMap.displayBetRegions(regions, 'selectRegion', zoomDuration);
        } else{
            console.log("No available betting regions")
        }

        // Create Bet/Bet region listeners
        $('#createBet').click(addBetToDataBase);
        $('#createBetRegion').click(addNewBetRegion);

        
        selectRegionDOM.change(() => {
            var id = selectRegionDOM.val()
            if(id != 'null'){
                var layersToRemove = [];
                betMap.betRegionLayer.eachLayer((layer) => {
                    console.log("Leaflet id: " + layer._leaflet_id);
                    console.log("Region id: " + id);
                    if(!(layer._leaflet_id.toString() === id.toString())){
                        layersToRemove.push(layer._leaflet_id);
                    }else{
                        console.log("Not equal");
                    }
                });
                layersToRemove.forEach((id) =>{
                    betMap.betRegionLayer.removeLayer(id);
                });
                console.log("Test");
                betMap.betRegionLayer.addTo(betMap.map);
            }
        });

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

    }, 200);
});

function setDOMDefaultValues(name, location, rad, userLocation){
    name.val('New Bet');
    rad.val('50');
    console.log(userLocation);
    // Reverse geocode lat and lng to predict location name of bet/betRegion
    $.ajax('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + userLocation.lat + '&longitude=' + userLocation.lng + '&localityLanguage=en', 
    { 
        success : (data) => {
            var len = data.localityInfo.informative.length;
            var predictedLocation = data.localityInfo.informative[len - 1].name;
            location.val(predictedLocation);
        },
        error: (jqXHR, exception) => {
            console.log("Location could not be found");
        }
    });
}

// Get available regions from database
function getBettingRegions(location){  
    return new Promise((resolve, reject) => {
        $.get('/getBettingRegions', {lat : location.lat, lng: location.lng}, (betRegions) =>  resolve(betRegions), 'json').fail(() => reject("Error"));
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

    //position.lat = 53.337840;
    //position.lng = -9.180165;
    
    position.lat = 53.282110;
    position.lng = -9.062186;
    
    return position;
}
