// get the win loss ratio for the graph
fetch("http://localhost:9000/analytics/getWinLoss", {
    method: 'POST',
    crossDomain: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        "username": "IamCathal"
    })
}).then(response => response.json()).then((response) => {
    if (response) {
        let wins = response.body.wins;
        let losses = response.body.losses;

        if (response.body.wins == 0 && response.body.losses == 0) {
            // draw empty chart
            var ctx = document.getElementById('winLoss').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ["No bets yet"],
                    datasets: [{
                        label: 'Wins vs Losses',
                        backgroundColor: 'rgb(110, 109, 109)',
                        data: [1]
                    }]
                },

                // Configuration options go here
                options: {
                    cutoutPercentage: 50
                }
            });

        } else {
            // we got data, draw a proper graph
            var ctx = document.getElementById('winLoss').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Win', 'Loss'],
                    datasets: [{
                        label: 'Wins vs Losses',
                        backgroundColor: ['rgb(0, 0, 255)', 'rgb(212, 53, 53)'],
                        data: [wins, losses]
                    }]
                },
                options: {
                    cutoutPercentage: 50
                }
            });
        }
    }
})

// get bets made and people reached stats

let betsMade = 0;
let peopleReached = 0;

fetch("http://localhost:9000/analytics/getpeopleReached", {
    method: 'POST',
    crossDomain: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        "username": "Req"
    })
}).then(response => response.json()).then((response) => {
    if (response) {
        betsMade = response.body.betsMade;
        peopleReached = response.body.peopleReached;

        let infoBox = document.getElementById("peopleReachedDiv");
        infoBox.innerHTML = `${betsMade} bets made.<br>${peopleReached} people reached`
    }
})

fetch("http://localhost:9000/analytics/getBettingHistory", {
    method: 'POST',
    crossDomain: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        "username": "testUser"
    })
}).then(response => response.json()).then((response) => {
    if (response) {
        if (response.status === "success") {
            response.body = response.body.sort((a, b) => (a.date > b.date) ? 1 : -1);
            let currentStatus = []
            let dates = []
            let i = 0;
            console.log(response.body);
            for (bet of response.body) {
                if (currentStatus.length == 0) {
                    currentStatus[0] = bet.profitOrLoss
                    let betDate = new Date(bet.date * 1000);
                    let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}`;
                    dates[0] = dateString;
                    i++;
                } else {
                    currentStatus[i] = currentStatus[i - 1] + bet.profitOrLoss;
                    // console.log(`${i} - status[${currentStatus[i]}] = ${currentStatus[i-1]} + ${bet.profitOrLoss}]`);
                    let betDate = new Date(bet.date * 1000);
                    let dateString = `${betDate.getDate()}/${betDate.getMonth()+1}`;
                    dates[i] = dateString;
                    i++;
                }
            }
            // get history of bets
            var ctx = document.getElementById('betHistory').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        fill: 'origin',
                        label: ['Wins and Losses'],
                        data: currentStatus,
                        backgroundColor: 'rgb(0, 0, 255)'
                    }, ]
                },
                options: {
                    plugins: {
                        filler: {
                            propagate: true
                        }
                    }
                }
            });

            // draw the win loss chart
            let winLosses = [];
            let colorArr = [];
            for (bet of response.body) {
                if (winLosses.length == 0) {
                    winLosses[0] = bet.profitOrLoss
                    if (bet.profitOrLoss > 0) {
                        console.log(`blue`);
                        colorArr[0] = 'rgb(0, 0, 255)';
                    } else {
                        console.log(`red`);
                        colorArr[0] = 'rgb(219, 46, 46)';
                    }
                } else {
                    winLosses.push(bet.profitOrLoss)
                    if (bet.profitOrLoss > 0) {
                        console.log(`blue`);
                        colorArr.push('rgb(0, 0, 255)');
                    } else {
                        console.log(`red`);
                        colorArr.push('rgb(219, 46, 46)');
                    }
                }
            }
            console.log(colorArr);
            console.log(winLosses);
            // get history of bets
            var ctx = document.getElementById('betHistoryWinLoss').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dates,
                    datasets: [{
                        fill: 'origin',
                        label: ['Win and Losses'],
                        data: winLosses,
                        backgroundColor: colorArr
                    }, ]
                },
                options: {
                    plugins: {
                        filler: {
                            propagate: true
                        }
                    }
                }
            });

        } else {
            console.log("Error getting bet history")
        }
    }
});