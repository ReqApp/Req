const socketFuncs = require('../funcs/socketFuncs');


module.exports = function(io) {

    io.on('connection', (socket) => {

        let countdown = setInterval(() => {
            socket.emit('currentTime', socketFuncs.getTimeDiff(1588590000000, new Date().getTime()))
        }, 1000);
        
        socket.on('servedQR', (req) => {
            console.log(`Served shortened link: ${req}`);
        });

        // Used to get accurate user location from mobile app
        socket.on('userPosition', (data) => {
            // Send it to react front-end in browser
            io.sockets.emit('accurateUserPos', data);
        });

        socket.on('locationResponse', (data) => {
            io.sockets.emit('response', data);
        });

    });
};