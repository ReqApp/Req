function getTimeDiff(nowTime, commentTime) {
    let timeDiff = nowTime - commentTime;

    let seconds = (timeDiff / 1000).toFixed(0);
    let minutes = (timeDiff / (1000 * 60)).toFixed(0);
    let hours = (timeDiff / (1000 * 60 * 60)).toFixed(0);
    let days = (timeDiff / (1000 * 60 * 60 * 24)).toFixed(0);

    if (seconds < 60) {
        return `${seconds}s`;
    } else if (minutes < 60) {
        return `${minutes}m`;
    } else if (hours < 24) {
        return `${hours}h`;
    } else {
        return `${days}d`;
    }

}

module.exports.getTimeDiff = getTimeDiff;