const TILESRC = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const METADATA = { attribution : 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors' };
var locateSettings = {setView: true, watch:false, enableHighAccuracy:true}
const DEFAULT_RAD = 100;

var map;

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