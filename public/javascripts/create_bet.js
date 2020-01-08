const TILESRC = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const METADATA = { attribution : 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors' };
const DEFAULT_RAD = 100;

var map;
var area;

$(document).ready(function(){
    loadMap();
});

//Function which adds bet to map(rad & title)

//Function to load map with user location
function loadMap(){
    // Create map
    map = L.map('mapid');
    L.tileLayer(TILESRC, METADATA).addTo(map);
    map.locate({setView: true, watch:false, enableHighAccuracy:true}).on('locationfound', function(pos){ 
        console.log(pos.accuracy);
        //DEBUG setting location
        pos = setLocation(pos);
         // Check for level of accuracy
        if(pos.accuracy > 100){
            console.log("Location could not accurately be determined");
        }
        else{
            var latLong = L.latLng(pos.latitude, pos.longitude);
            var marker = L.marker(latLong);
            marker.addTo(map);
            
            // Reverse Geocoding
            $.ajax('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + pos.latitude + '&longitude=' + pos.longitude + '&localityLanguage=en', {success : function(data, status, xhr){
                console.log(data);
                // Extract user location
                var len = data.localityInfo.informative.length;
                var location = data.localityInfo.informative[len - 1].name;
                marker.bindPopup("<b>New Bet</b><br>Location: " + location, {closeButton : false}).openPopup()
                map.setZoomAround(latLong, 16, {animate : true}); 
                
                $('#betName').val('New Bet');
                $('#location').val(location);
                $('#rad').val(DEFAULT_RAD);

                area = L.circle(latLong, {
                    color: 'blue',
                    fillColor: 'blue',
                    fillOpacity: 0.25,
                    radius: DEFAULT_RAD
                }).addTo(map);
            }});
        }
    }).on('locationerror', function(err){
        console.log(err);
        alert("Could not find location");
    });

}

// DEBUG function for setting user position
function setLocation(position){
    position.latitude = 53.337840;
    position.longitude = -9.180165;
    position.accuracy = 40;
    return position;
}
