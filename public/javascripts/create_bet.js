const MIN_BET_RAD = 20;

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
    loadMap('mapID');
    
    // Wait for user position to be obtained
    $(window).on('locRetrieved', function (data) {
        console.log('locRetrieved', data.location);
        addMapMarkers(data.location);
    });
    
});

function addMapMarkers(pos){
    console.log(pos.accuracy);
    //DEBUG setting location
    if(pos.accuracy > 100){
        pos = setLocation(pos);
    }
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
    /*
    position.latitude = 53.282110;
    position.longitude = -9.062186;
    */
    position.accuracy = 40;
    return position;
}
