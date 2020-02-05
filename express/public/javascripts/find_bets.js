class FindBetMap extends Map{
    constructor(domID, options){
        super(domID, options);
        this.zoomDuration = 1;
        this.betLayer = L.layerGroup();
    }
    showUserLocation(location){
        this.userLocationMarker = L.marker(location).addTo(this.map);
        this.map.flyTo(location, 15, {animate : true, duration: this.zoomDuration, easeLinearity : .43});
    }
    displayBets(bets){
        bets.forEach((bet) => {
            var latLng = L.latLng(bet.latitude, bet.longitude);
            var betMarker = L.marker(latLng).bindPopup(bet.title, {closeOnClick: false, closeButton : false, autoClose : false}).addTo(this.map);
            betMarker.openPopup();
            var circle = L.circle(latLng, {
                color : 'blue',
                fillColor : 'blue',
                fillOpacity : 0.2,
                radius : 0
            });
            var group = L.featureGroup([betMarker, circle]);
            group._leaflet_id = bet._id;
            var betAreaMarker = new BetArea(circle);
            betAreaMarker.expand(bet.radius);
            this.betLayer.addLayer(group);
        });
    }
}

$(document).ready(async () => {
    // Map setup
    findBetMap = new FindBetMap('mapID', options);
    findBetMap.createMap();
    // DOM setup
    var selectRegionDOM = $('#dropDown');
    // Plot user location
    var userLocation = await findBetMap.locateUser();
    findBetMap.verifyAndAddUserLocation(userLocation);
    findBetMap.showUserLocation(findBetMap.userLocation);
    // Bet region setup
    var regions =  await getBettingRegions(findBetMap.userLocation);
    if(Array.isArray(regions) && regions.length){
        findBetMap.displayBetRegions(regions, 'dropDown', findBetMap.zoomDuration);
    }
    // Add bets when user chooses bet region
    selectRegionDOM.change(() => {
        findBetMap.handleRegionSelection(selectRegionDOM);
        if(selectRegionDOM.val() != 'null'){
            // Get bets in region
            var regionID = selectRegionDOM.val();
            getBetsInRegion(regionID).then((bets) => {
                // Add bets to map
                findBetMap.displayBets(bets);
            });
        }
    });
});

function getBetsInRegion(regionID){
    return new Promise((resolve, reject) => {
        $.get('/getBetsInRegion', {id : regionID.toString()}, (betsInRegion) => {
            resolve(betsInRegion);
        });
    });
}