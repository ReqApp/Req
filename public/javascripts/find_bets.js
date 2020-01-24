$(document).ready(function(){
    loadMap('mapID');
    $(window).on('locRetrieved', function(data){
        if(data.location.accuracy > 100){
            // NUIG
            data.location.latitude = 53.282110;
            data.location.longitude = -9.062186;
        }
        var latLong = L.latLng(data.location.latitude, data.location.longitude);
        var marker = L.marker(latLong);
        marker.addTo(map);
        map.flyTo(latLong, 15, {animate : true, duration : 1});

        // Allow time to zoom then load other visual elements
        window.setTimeout(function(){
            marker.bindPopup("Your are here", {closeButton : false, className: 'popUp'}).openPopup();
            getBets(latLong);
        }, 1000);

    })
});

function getBets(latLong){
    var lat = latLong.lat;
    var long = latLong.lng;
    $.get('/getBets', { latitude : lat, longitude : long}, function(availableBets, status, XHR){
        console.log(availableBets);
        // Take bets and draw them on map
        addBetsToMap(availableBets);
    }, 'json');
    
}

function addBetsToMap(bets){
    var betMarkers = [];
    bets.forEach(bet => {
        // Add marker and popup on hover
        var latLng = L.latLng(bet.latitude, bet.longitude);
        var marker = L.marker(latLng);
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
        ).addTo(map);

        betArea = new BetArea(circle);
        betArea.expand(bet.radius);

        // Add visual elements to array and add to map
        betMarkers.push(marker);
        var index = betMarkers.length - 1;
        betMarkers[index].addTo(map);
    });


}