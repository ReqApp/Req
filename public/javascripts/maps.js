const options = {
     TILESRC : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
     METADATA : { attribution : 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors' },
     LOCATE_SETTINGS : { setView : true, watch : false, enableHighAccuracy : true }
}

class Map {
    constructor(domID, options){
        this.options = options;
        this.id = domID;
        this.map;
        this.userLocation = null;
        this.userLocationMarker;
        
        // Used to load visual elements
        this.betRegionLayer = L.layerGroup();
        this.hiddenBetRegions = L.layerGroup();
    }
    // Function to load map into DOM
    createMap(){
        this.map = L.map(this.id, {centre: [51.505, -0.09], zoom: 1});
        L.tileLayer(options.TILESRC, options.METADATA).addTo(this.map);
    }
    // Obtain user's location
    async locateUser(){
        var promise = new Promise((resolve, reject) => {
            this.map.locate(options.LOCATE_SETTINGS).on('locationfound', (location) =>  resolve(location)).on('locationerror', (err) => reject(err));
        });
        var result = await promise;
        return result;
    }
    displayBetRegions(regions, dropDownID, zoomDuration){
        // Add visual elements to map
        return new Promise((resolve) => {
            window.setTimeout(() => {
                regions.forEach(betRegion => {
                    var latLng = L.latLng(betRegion.latitude, betRegion.longitude);
                    var marker = L.marker(latLng).bindPopup(betRegion.region_name, {closeOnClick: false, closeButton : false, autoClose : false}).addTo(this.map);
                    marker.openPopup();
                    var circle = L.circle(latLng, {
                        color : 'red',
                        fillColor : 'red',
                        fillOpacity : 0.2,
                        radius : 0
                    });
        
                    var group = L.featureGroup([marker, circle]);
                    group._leaflet_id = betRegion._id;
                    var regionMarker = new BetArea(circle);
                    regionMarker.expand(betRegion.radius);
                    this.betRegionLayer.addLayer(group);
                    $('#' + dropDownID).append('<option value=' + betRegion._id + '>' + betRegion.region_name + '</option>');
                });
                this.betRegionLayer.addTo(this.map);
                resolve();
            }, zoomDuration * 1000);
        });
    }
    verifyAndAddUserLocation(userLocation){
        if('latlng' in userLocation){
            // Manually set user location
            userLocation.latlng = this.setLocation(userLocation.latlng);
            userLocation.accuracy = 40;
            // Check for location accuracy
            if(userLocation.accuracy > 100){
                console.log("Your location could not be accuratly determined");
            }else{
                this.userLocation = userLocation.latlng;
            }
        }else{
            console.log("Could not find user location")
            console.log(userLocation.message);
        }
    }
    handleRegionSelection(selectRegionDOM){
        // Get selected region ID
        var id = selectRegionDOM.val();

        // Null corresponds to all regions
        if(id != 'null'){
            // Check if selected region is hidden
            if(this.hiddenBetRegions.getLayer(id)){
                // Add to visible layer
                this.betRegionLayer.addLayer(this.hiddenBetRegions.getLayer(id));
                this.hiddenBetRegions.removeLayer(id);
            }
            // Remove other regions from visible layer
            this.betRegionLayer.eachLayer((layer) => {
                if(!(layer._leaflet_id.toString() === id.toString())){
                    this.hiddenBetRegions.addLayer(layer);
                    this.betRegionLayer.removeLayer(layer);
                }        
            });
        }else{
            console.log("Null");
            // Display all available regions
            this.hiddenBetRegions.eachLayer((layer) => {
                this.betRegionLayer.addLayer(layer);
                this.hiddenBetRegions.removeLayer(layer);
            });
        }
        // Add selected region(s) to map and open popups
        console.log(this.betRegionLayer.getLayers());
        this.betRegionLayer.addTo(this.map);
        this.betRegionLayer.eachLayer((layer) => {
            var subLayers = layer.getLayers();
            subLayers.forEach((layer) =>{
                layer.openPopup();
            });
        });
    }
    // DEBUG function for setting user position
    setLocation(position){
        //position.lat = 53.337840;
        //position.lng = -9.180165;
        
        position.lat = 53.282110;
        position.lng = -9.062186;
        
        return position;
    }
    // Testing function to manually set user's location
    set userLocation(position){
        this._userLocation = position;
    }
    get userLocation(){
        return this._userLocation;
    }
}

// Adds functionality to circle marker
class BetArea {
    constructor(circle){
        this.circle = circle;
    }
    expand(limRad){
        var wait = setInterval((() => {
            var currRad = this.circle.getRadius();
            if(currRad < limRad){
                this.circle.setRadius(currRad + 1);
            }
            else if(currRad > limRad){
                this.circle.setRadius(currRad - 1);
            }
            else{
                clearInterval(wait);
            }
        }).bind(this), 1);
    }
}

// Get available regions from database
function getBettingRegions(location){  
    return new Promise((resolve, reject) => {
        $.get('/getBettingRegions', {lat : location.lat, lng: location.lng}, (betRegions) =>  resolve(betRegions), 'json').fail(() => reject("Error"));
    });
}