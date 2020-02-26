const socketFuncs = require('../funcs/socketFuncs');

function printStuff() {
    return `print stuff func working`;
}

module.exports = function(io) {

    io.on('connection', (socket) => {

        console.log(printStuff());
        let countdown = setInterval(() => {
            socket.emit('currentTime', socketFuncs.getTimeDiff(1588590000000, new Date().getTime()))
        }, 1000);
        
        socket.on('servedQR', (req) => {
            console.log(`Served shortened link: ${req}`);
        });

    });
};