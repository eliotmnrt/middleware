

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
    // Références aux champs d'entrée

// Ajouter un gestionnaire d'événements pour les clics sur la carte
    map.on('click', function (e) {
        const departureInput = document.querySelector('my-menu').shadowRoot.querySelectorAll('my-input')[0].shadowRoot.querySelector('.custom-input')
        const arrivalInput = document.querySelector('my-menu').shadowRoot.querySelectorAll('my-input')[1].shadowRoot.querySelector('.custom-input')

        const lat = e.latlng.lat.toFixed(6); // Latitude cliquée (précision 6 décimales)
        const lon = e.latlng.lng.toFixed(6); // Longitude cliquée
        const latFormat = e.latlng.lat.toFixed(6).toString().trim().replace(" ", "").trim(); // Latitude cliquée (précision 6 décimales)
        const lonFormat = e.latlng.lng.toFixed(6).toString().trim().replace(" ", "").trim(); // Longitude cliquée
        console.log(latFormat, lonFormat)
        // Afficher une boîte de dialogue pour demander à l'utilisateur
        const userChoice = confirm(`Coordonnées cliquées : ${lat}, ${lon}\nVoulez-vous les définir comme point de départ ? (Cliquez sur Annuler pour les définir comme arrivée)`);

        if (userChoice) {
            // Mettre à jour le champ de départ
            departureInput.value = `${lonFormat},${latFormat}`;
            departureInput.setAttribute('data-lat', latFormat);
            departureInput.setAttribute('data-lon', lonFormat);

            // Optionnel : Ajouter un marqueur sur la carte pour le départ
            L.marker([lat, lon]).addTo(map).bindPopup("Point de départ").openPopup();
        } else {
            // Mettre à jour le champ d'arrivée
            arrivalInput.value = `${lonFormat},${latFormat}`;
            arrivalInput.setAttribute('data-lat', latFormat);
            arrivalInput.setAttribute('data-lon', lonFormat);

            // Optionnel : Ajouter un marqueur sur la carte pour l'arrivée
            L.marker([lat, lon]).addTo(map).bindPopup("Point d'arrivée").openPopup();
        }
    });
});

