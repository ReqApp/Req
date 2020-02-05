console.log(document.cookie);

function getJWT() {
    if (document.cookie.length == 183) {
        let jwt = document.cookie.split('%20')[1];
        console.log(jwt);
        getCoins({"jwt":jwt});
    } else {
        console.log("Auth cookie invalid");
    }
}

function getCoins(jwt) {
    fetch('http://localhost:8673/getCoins', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jwt),
    }).then((res) => res.json()).then((data) => {
        console.log(`Response: ${JSON.stringify(data)}`);
        let coin = document.getElementById('coinDiv');
        coinDiv.textContent = data.body;
        loadContent();
    }).catch((err) => {
        console.log(err);
    })
}

getJWT();