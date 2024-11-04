

async function setMap() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            console.log("geolocation is available");
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position.coords.latitude.toFixed(4), position.coords.longitude.toFixed(4))
                resolve([position.coords.latitude.toFixed(4), position.coords.longitude.toFixed(4)]);
            })
        } else {
            resolve([48.8566, 2.3522]);
        }
    });
}

setMap().then(r => {
    console.log(r)
    window.map = L.map('map').setView([r[0], r[1]], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(window.map);
    var marker = L.marker([r[0], r[1]]).addTo(window.map);

    console.log("map loaded");
});


