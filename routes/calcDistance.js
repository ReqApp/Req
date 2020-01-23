function calcDistance(storedBet, user){
    const RAD_EARTH = 6371;
    var changeLat = degToRad(storedBet.lat - user.lat);
    var changeLng = degToRad(storedBet.lng - user.lng);
    
    var a = Math.sin(changeLat/2) * Math.sin(changeLat/2) + Math.cos(degToRad(storedBet.lat)) * Math.cos(degToRad(user.lat)) * Math.sin(changeLng/2) * Math.sin(changeLng/2);
                                                                     
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return RAD_EARTH * c;
}

function degToRad(deg){
    return deg * (Math.PI /180);
    
}
module.exports = calcDistance;