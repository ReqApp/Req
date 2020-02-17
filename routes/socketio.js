module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log("yuppa connection in socket io js");
    });
};
