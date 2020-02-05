document.addEventListener("DOMContentLoaded", hidePopup);

function hidePopup() {
    let popup = document.getElementById("QRPopup");
    popup.style.visibility = "hidden"
}

document.getElementById("getQR").addEventListener("click", () => {
    let popup = document.getElementById("QRPopup")
    document.getElementById("QRHere").src = `https://api.qrserver.com/v1/create-qr-code/?size=225x225&color=102-153-255&qzone=0&margin=0&data=${window.location.href}`;
    console.log(window.location.href);
    if (popup.style.visibility === "hidden") {
        popup.style.visibility = "visible";
        document.getElementById("popupText").innerHTML = "<h1> Scan me </h1>";
    } else {
        popup.style.visibility = "hidden";
        document.getElementById("popupText").innerHTML = "";
    }
})