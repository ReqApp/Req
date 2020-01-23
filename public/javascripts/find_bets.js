$(document).ready(function(){
    loadMap('mapID');
    $(window).on('locRetrieved', function(data){
        var latLong = L.latLng(data.location.latitude, data.location.longitude);
        var marker = L.marker(latLong);
        marker.addTo(map);
        marker.bindPopup("Your are here", {closeButton : false, className: 'popUp'}).openPopup();
        getBets(latLong);
    })
});

function getBets(latLong){
    var lat = latLong.lat;
    var long = latLong.lng;
    $.get('/getBets', { latitude : lat, longitude : long}, function(data, status, XHR){
        console.log(data);
    }, 'json');
    
}
