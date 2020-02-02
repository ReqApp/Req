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
        
        // Used to load visual elements
        this.betRegionLayer = L.layerGroup();
        this.hiddenBetRegions = L.layerGroup();
        this.betLayer = L.layerGroup();
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