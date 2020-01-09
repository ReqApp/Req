const TILESRC = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const METADATA = { attribution : 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors' };
const DEFAULT_RAD = 100;
const MIN_BET_RAD = 20;

var map;
var area;
var marker;

var betNameDOM;
var locationDOM;
var radiusDOM;

var betData = {betName : 'New Bet', location: 'location', radius: DEFAULT_RAD};

$(document).ready(function(){
    betNameDOM = $('#betName');
    locationDOM = $('#location');
    radiusDOM = $('#rad');
    
    betNameDOM.val(betData.betName);
    radiusDOM.val(betData.radius);
    loadMap();

});

//Function to load map with user location
function loadMap(){
    // Create map
    map = L.map('mapid');
    L.tileLayer(TILESRC, METADATA).addTo(map);
    
    var locateSettings = {setView: true, watch:false, enableHighAccuracy:true}
    
    map.locate(locateSettings).on('locationfound', createMap).on('locationerror', function(err){
        console.log(err);
        alert("Could not find location");
    });

}

function createMap(pos){
    console.log(pos.accuracy);
    //DEBUG setting location
    pos = setLocation(pos);
    // Check for level of accuracy
    if(pos.accuracy > 100){
        console.log("Location could not accurately be determined");
    }
    else{
        var latLong = L.latLng(pos.latitude, pos.longitude);
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
            map.setZoomAround(latLong, 16, {animate : true});
            area = L.circle(latLong, {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.25,
                radius: DEFAULT_RAD
            }).addTo(map);
            
            // Update popUp when input fields are changed
            locationDOM.keyup(function(){
                betData.location = locationDOM.val();
                marker._popup.setContent(formatPopUp(betData));
            });
            
            betNameDOM.keyup(function(){
                betData.betName = betNameDOM.val();
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
    return '<b>' + betData.betName + '</b><br>Location: ' + betData.location + '<br>Radius: ' + betData.radius;
}

// DEBUG function for setting user position
function setLocation(position){
    position.latitude = 53.337840;
    position.longitude = -9.180165;
    position.accuracy = 40;
    return position;
}
