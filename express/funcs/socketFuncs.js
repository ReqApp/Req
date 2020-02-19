function getTimeDiff(nowTime, commentTime) {
    let timeDiff = nowTime - commentTime;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days} days<br>${hours} hours<br>${minutes} minutes<br>${seconds} seconds`;

}

module.exports.getTimeDiff = getTimeDiff;