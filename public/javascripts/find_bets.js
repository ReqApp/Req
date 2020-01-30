var layerGroup;

$(document).ready(function(){
    loadMap('mapID');
    $(window).on('locRetrieved', function(data){
        if(data.location.accuracy > 100){
            data.location.latitude = 53.279322295634;
            data.location.longitude = -9.06269563621165;
        }
        var latLong = L.latLng(data.location.latitude, data.location.longitude);
        var marker = L.marker(latLong);
        marker.addTo(map);
        map.flyTo(latLong, 15, {animate : true, duration : 1});

        // Allow time to zoom then load other visual elements
        window.setTimeout(function(){
            marker.bindPopup("Your are here", {closeButton : false, className: 'popUp'}).openPopup();
            // TODO
                // Get bet regions available
                getBetRegions(latLong);
                // Allow user to select region
                // Display bets only in that region
            //getBetsInRegion(latLong);
        }, 1000);

    })
});

// Return regions that user in located in
function getBetRegions(latLng){
    // Send request to server to retrieve regions from database
    $.get('/getBettingRegions', {latitude : latLng.lat, longitude : latLng.lng}, function(regions){
        console.log("Available regions");
        console.log(regions);
        // Add regions to map
        for(var i = 0; i < regions.length; i++){
            $('#dropDown').append('<option value=' + regions[i]._id + '>' + regions[i].region_name + '</option>');
        }
        addBetsToMap(regions);
        $('#selectRegion').click(function(){
            // Clear region markers and add bet markers
            console.log('Clearing markers...');
            layerGroup.clearLayers();
            
            // Get bets in region using region id
            var regionID = $('#dropDown').val();
            $.get('/getBetsInRegion', {id : regionID}, function(bets){
                console.log("Returned bets");
                console.log(bets);
                // Add bets to map
            });
        });
    });

}

// Visually display bet regions on map
function showBettingRegion(betRegion){
    // Create marker, popup and circle and add to map

    // Create drop-down menu to allow user to select between regions
}

// On user selection, retrieve bets in selected region
function getBetsInRegion(latLong){
    var lat = latLong.lat;
    var long = latLong.lng;
    $.get('/getBets', { latitude : lat, longitude : long}, function(availableBets, status, XHR){
        console.log(availableBets);
        // Take bets and draw them on map
        addBetsToMap(availableBets);
    }, 'json');
    
}

// Display bets in region on map
function addBetsToMap(bets){
    layerGroup = L.layerGroup().addTo(map);
    var betMarkers = [];
    var customIcon = L.icon({
        iconUrl : 'http://localhost:80/images/location_marker.svg',
        shadowURL : 'http://localhost:80/images/shadow_marker.png',
        iconSize:     [38, 95], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -60] // point from which the popup should open relative to the iconAnchor
    });

    bets.forEach(bet => {
        // Add marker and popup on hover
        var latLng = L.latLng(bet.latitude, bet.longitude);
        var marker = L.marker(latLng, {icon : customIcon});
        marker.bindPopup("<b>" + bet.title + "</b>", {closeButton : false});
        marker.on('mouseover', function(){
            marker.openPopup();
        });
        marker.on('mouseout', function(){   
            marker.closePopup();
        })

        // Add circle around bet
        var circle = L.circle(latLng, {
                color : 'red',
                fillColor : 'red',
                fillOpacity : 0.2,
                radius: 0
            }
        ).addTo(layerGroup);

        betArea = new BetArea(circle);
        betArea.expand(bet.radius);

        // Add visual elements to array and add to map
        betMarkers.push(marker);
        var index = betMarkers.length - 1;
        betMarkers[index].addTo(layerGroup);
    });
}