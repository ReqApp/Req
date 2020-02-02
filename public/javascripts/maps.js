// TODO 
    // optimise createbet and findbet scripts by defining common function here
    // Possibly implement class system

const TILESRC = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const METADATA = { attribution : 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors' };
var locateSettings = {setView: true, watch:false, enableHighAccuracy:true}
const DEFAULT_RAD = 100;


var map;

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
        this.betRegionLayer = L.layerGroup();
        this.betLayer = L.layerGroup();
    }
    // Function to load map into DOM
    createMap(){
        this.map = L.map(this.id);
        L.tileLayer(options.TILESRC, options.METADATA).addTo(this.map);
    }
    // Obtain user's location
    async locateUser(){
        var promise = new Promise((resolve, reject) => {
            this.map.locate(options.LOCATE_SETTINGS).on('locationfound', (location) =>  resolve(location.latlng)).on('locationerror', (err) => reject(err));
        });
        var result = await promise;
        return result;
    }
}

function loadMap(mapID){
    // Create map
    map = L.map(mapID);
    L.tileLayer(TILESRC, METADATA).addTo(map);
    map.locate(locateSettings).on('locationfound', createMap).on('locationerror', function(err){
        console.log(err);
        alert("Could not find location");
    });
    
}

function createMap(location){
    console.log(location);
    var evt = $.Event('locRetrieved');
    evt.location = location;
    $(window).trigger(evt);
}

// Adds functionality to circle marker
class BetArea {
    constructor(circle){
        this.circle = circle;
    }
    expand(limRad){
        var wait = setInterval((function(){
            var currRad = this.circle.getRadius();
            if(currRad < limRad){
                this.circle.setRadius(currRad + 10);
            }
            else{
                clearInterval(wait);
            }
        }).bind(this), 20);
    }
}