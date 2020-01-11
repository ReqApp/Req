$(document).ready(function(){
    loadMap('mapID');
    $(window).on('locRetrieved', function(data){
        console.log("Postion retrieved");
    })
});