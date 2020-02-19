const socketFuncs = require('../funcs/socketFuncs');

module.exports = function(io) {

    io.on('connection', (socket) => {

        socket.emit('currentTime', socketFuncs.getTimeDiff(1588590000000, new Date().getTime()));

        socket.on('servedQR', (req) => {
            console.log(`Served shortened link: ${req}`);
        })
    });
};