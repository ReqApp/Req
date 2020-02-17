module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log("yuppa connection in socket io js");

        let currTime = new Date().getTime();

        let countdown = setInterval(() => {
            currTime = new Date().getTime();
            socket.emit('currentTime', currTime)

        }, 1);

        socket.on('cans', (msg) => {
            console.log(`${msg} received`);
        });
    });
};