// Constants
const DEFAULT_BET_VALS = {
    name: 'New Bet',
    location: 'Your location',
    radius: 100
}
const RESTRICTIONS = {
    min_bet_rad : 20
}

// Extends basic map class for more functionality
class CreateBetMap extends Map{
    constructor(domID, options){
        super(domID, options);
        this.betLayers = L.featureGroup();
        this.betCircle;
    }
    // Add marker to display user's location
    showUserLocation(userLocation){
        this.userLocationMarker = L.marker(userLocation).bindPopup('', {closeOnClick: false, closeButton : false, autoClose : false});
        this.updateUserLocationMarker(DEFAULT_BET_VALS.name, DEFAULT_BET_VALS.location, DEFAULT_BET_VALS.radius);
        this.betCircle = new BetArea(L.circle(userLocation, {
            color : 'blue',
            fillColor : 'blue',
            fillOpacity : 0.2,
            radius : 0
        }));
        this.betLayers.addLayer(this.betCircle.circle);
        this.betLayers.addLayer(this.userLocationMarker);
        this.betLayers.addTo(this.map);

        this.userLocationMarker.openPopup();
        this.betCircle.expand(DEFAULT_BET_VALS.radius);
    }
    updateUserLocationMarker(name, location, radius){
        var str = '<b>' + name + '</b><br>Location: ' + location + '<br>Radius: ' + radius;
        this.userLocationMarker._popup.setContent(str);
    }
}

// Load elements on page
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
        betMap.verifyAndAddUserLocation(result);
    
        const zoomDuration = 1;
        betMap.map.flyTo(betMap.userLocation, 15, {animate : true, duration: zoomDuration, easeLinearity : .43});

        window.setTimeout(() => {
            betMap.showUserLocation(betMap.userLocation);
        }, zoomDuration * 1000);
        
        setDOMDefaultValues(betNameDOM, locationDOM, radiusDOM, betMap.userLocation);
    
        // Get betting regions
        var regions = await getBettingRegions(betMap.userLocation);
        console.log(regions);
        
        // Check if user is in one or more bet regions
        if(Array.isArray(regions) && regions.length){
            betMap.displayBetRegions(regions, 'selectRegion', zoomDuration).then(() => {
                betMap.showUserLocation(betMap.userLocation);
            });
        } else{
            console.log("No available betting regions")
        }

        // Create Bet/Bet region listeners
        $('#createBet').click(() => {
            // TODO write form validation
            if(selectRegionDOM.val() != 'null'){
                var newBet = {
                    title: betNameDOM.val(),
                    location_Name: locationDOM.val(),
                    latitude: betMap.userLocation.lat,
                    longitude: betMap.userLocation.lng,
                    radius: parseInt(radiusDOM.val()),
                    bet_region_id: selectRegionDOM.val().toString()
                }
                addBetToDataBase(newBet);
            }
            else{
                alert("Please choose a region to create bet");
            }
        });
        $('#createBetRegion').click(() => {
            // TODO write from validation
            var newRegion = {
                region_name : betNameDOM.val(), 
                latitude : betMap.userLocation.lat, 
                longitude : betMap.userLocation.lng,
                radius : parseInt(radiusDOM.val()),
                bet_ids : []
            }
            addNewBetRegion(newRegion);
        });

        // Allow user to choose which region to create bet in
        selectRegionDOM.change(() => {
            // Get selected region ID
            var id = selectRegionDOM.val()

            // Null corresponds to all regions
            if(id != 'null'){
                // Check if selected region is hidden
                if(betMap.hiddenBetRegions.getLayer(id)){
                    // Add to visible layer
                    betMap.betRegionLayer.addLayer(betMap.hiddenBetRegions.getLayer(id));
                    betMap.hiddenBetRegions.removeLayer(id);
                }
                // Remove other regions from visible layer
                betMap.betRegionLayer.eachLayer((layer) => {
                    if(!(layer._leaflet_id.toString() === id.toString())){
                        betMap.hiddenBetRegions.addLayer(layer);
                        betMap.betRegionLayer.removeLayer(layer);
                    }        
                });
            }else{
                // Display all available regions
                betMap.hiddenBetRegions.eachLayer((layer) => {
                    betMap.betRegionLayer.addLayer(layer);
                });
            }
            // Add selected region(s) to map and open popups
            betMap.betRegionLayer.addTo(betMap.map);
            betMap.betRegionLayer.eachLayer((layer) => {
                var subLayers = layer.getLayers();
                subLayers.forEach((layer) =>{
                    layer.openPopup();
                });
            });
        });

        // Update popUp when input fields are changed
        locationDOM.keyup(() => {
            betMap.updateUserLocationMarker(betNameDOM.val(), locationDOM.val(), radiusDOM.val());
        });
        betNameDOM.keyup(() => {
            betMap.updateUserLocationMarker(betNameDOM.val(), locationDOM.val(), radiusDOM.val());
        });
        radiusDOM.keyup(() => {
            betMap.updateUserLocationMarker(betNameDOM.val(), locationDOM.val(), radiusDOM.val());
            var val = parseInt(radiusDOM.val());
            if(val >= RESTRICTIONS.min_bet_rad){
                betMap.betCircle.expand(val);
            }
        });

    }, 200);
});

function setDOMDefaultValues(name, location, rad, userLocation){
    name.val(DEFAULT_BET_VALS.name);
    rad.val(DEFAULT_BET_VALS.radius);
    // Reverse geocode lat and lng to predict location name of bet/betRegion
    $.ajax('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + userLocation.lat + '&longitude=' + userLocation.lng + '&localityLanguage=en', 
    { 
        success : (data) => {
            var len = data.localityInfo.informative.length;
            var predictedLocation = data.localityInfo.informative[len - 1].name;
            location.val(predictedLocation);
        },
        error: (jqXHR, exception) => {
            location.val(DEFAULT_BET_VALS.location);
            console.log("Location could not be found");
        }
    });
}



// Allows user to define new region where bets can be created and placed
function addNewBetRegion(newRegion){
    $.post('/addBettingRegion', newRegion, function(data){
        console.log('Added bet region to database');
        console.log(data);
    }, 'json');
}

// Allows user to add their bet to the database
function addBetToDataBase(newBet){
    var updateRegion = {};
    $.post('/addBetToDataBase', newBet, function(res){
        console.log("Added data to database");
        updateRegion.betID = res._id.toString();
        updateRegion.regionID = res.bet_region_id;
        $.ajax({
            url : '/addBetToRegion',
            type : 'PUT',
            data : updateRegion,
            success : function(res){
                console.log(res);
            }
        });
    }, 'json');
}