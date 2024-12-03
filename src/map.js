

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
    // Fonction pour ouvrir le modal
    function openModal(lat, lon) {
        const modal = document.getElementById('customModal');
        const coordinatesText = document.getElementById('coordinates');
        coordinatesText.textContent = `Coordonnées : ${lat}, ${lon}`;
        modal.style.display = 'flex'; // Affiche le modal
    }

    // Fonction pour fermer le modal
    function closeModal() {
        const modal = document.getElementById('customModal');
        modal.style.display = 'none';
    }
    function updateInput(lat, lon, isDeparture) {
        const departureInput = document.querySelector('my-menu').shadowRoot.querySelectorAll('my-input')[0].shadowRoot.querySelector('.custom-input');
        const arrivalInput = document.querySelector('my-menu').shadowRoot.querySelectorAll('my-input')[1].shadowRoot.querySelector('.custom-input');

        const formattedCoordinates = `${lon},${lat}`;

        if (isDeparture) {
            departureInput.value = formattedCoordinates;
            departureInput.setAttribute('data-lat', lat);
            departureInput.setAttribute('data-lon', lon);

            L.marker([lat, lon]).addTo(map).bindPopup("Point de départ").openPopup();
        } else {
            arrivalInput.value = formattedCoordinates;
            arrivalInput.setAttribute('data-lat', lat);
            arrivalInput.setAttribute('data-lon', lon);

            L.marker([lat, lon]).addTo(map).bindPopup("Point d'arrivée").openPopup();
        }
    }

// Ajouter un gestionnaire d'événements pour les clics sur la carte
    map.on('click', function (e) {
        console.log("remaining Steps: "+remainingSteps);
        if(remainingSteps != 0) {
            return;
        }
        const departureInput = document.querySelector('my-menu').shadowRoot.querySelectorAll('my-input')[0].shadowRoot.querySelector('.custom-input')
        const arrivalInput = document.querySelector('my-menu').shadowRoot.querySelectorAll('my-input')[1].shadowRoot.querySelector('.custom-input')

        const lat = e.latlng.lat.toFixed(6); // Latitude cliquée (précision 6 décimales)
        const lon = e.latlng.lng.toFixed(6); // Longitude cliquée
        const latFormat = e.latlng.lat.toFixed(6).toString().trim().replace(" ", "").trim(); // Latitude cliquée (précision 6 décimales)
        const lonFormat = e.latlng.lng.toFixed(6).toString().trim().replace(" ", "").trim(); // Longitude cliquée
        console.log(latFormat, lonFormat)
        // Afficher une boîte de dialogue pour demander à l'utilisateur
        //const userChoice = confirm(`Coordonnées cliquées : ${lat}, ${lon}\nVoulez-vous les définir comme point de départ ? (Cliquez sur Annuler pour les définir comme arrivée)`);
        openModal(lat, lon);

        // Gestion des boutons dans le modal
        document.getElementById('departureButton').onclick = function () {
            updateInput(lat, lon, true);
            closeModal();
        };

        document.getElementById('arrivalButton').onclick = function () {
            updateInput(lat, lon, false);
            closeModal();
        };

        document.getElementById('cancelButton').onclick = function () {
            closeModal();
        };
        });
        /*
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

         */

});

