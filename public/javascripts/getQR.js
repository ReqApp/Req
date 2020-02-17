document.addEventListener("DOMContentLoaded", hidePopup);

function hidePopup() {
    let popup = document.getElementById("QRPopup");
    popup.style.visibility = "hidden"
}

function getShortenedLink(url) {
    return new Promise((resolve, reject) => {
        if (url.includes("localhost")) {
            // If the link is a localhost the API doesn't like it,
            // instead link to my github pages
            resolve("https://goolnk.com/BZY3XX");
        } else {
            fetch('https://goolnk.com/api/v1/shorten', {
                method: 'POST',
                body: `url=http://localhost:8673/exampleShare`
            }).then((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        }
    });
}

// If the element's ID isnt the click to show, hide it
document.body.addEventListener("click", (event) => {
    console.log(event.target.id);
    if (event.target.id !== "getQR") {
        hidePopup();
    }
})

document.getElementById("getQR").addEventListener("click", () => {
    let popup = document.getElementById("QRPopup")
    document.getElementById("QRHere").src = `https://api.qrserver.com/v1/create-qr-code/?size=265x265&qzone=0&margin=0&data=${window.location.href}`;

    getShortenedLink(window.location.href).then((response) => {
        document.getElementById("popupText").innerHTML = `<a href="https://goolnk.com/BZY3XX">https://goolnk.com/BZY3XX</a>`;
    }, (err) => {
        console.log('Error shortening link');
    })

    if (popup.style.visibility === "hidden") {
        popup.style.visibility = "visible";
    } else {
        popup.style.visibility = "hidden";
        document.getElementById("popupText").innerHTML = "";
    }
})