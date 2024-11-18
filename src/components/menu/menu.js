class Menu extends HTMLElement {
    containerWidth = '400px';

    constructor() {
        super();
        // Attach the shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });

        // Fetch the external HTML content
        fetch('./components/menu/menu.html')
            .then(response => response.text())
            .then(htmlContent => {
                // Parse and extract the template content
                let templateContent = new DOMParser()
                    .parseFromString(htmlContent, "text/html")
                    .querySelector("template").content;

                // Append the cloned content to the shadow DOM
                shadow.appendChild(templateContent.cloneNode(true));

                // Set up toggle button functionality after the DOM has been appended
                const toggleButton = shadow.querySelector('#toggle-btn');
                toggleButton.onclick = () => this.toggleMenu();
                const goButton = shadow.querySelector('#go');
                goButton.onclick = () => {
                    const start = this.shadowRoot.querySelector('my-input').shadowRoot.querySelector('.custom-input').value;
                    const end = this.shadowRoot.querySelectorAll('my-input')[1].shadowRoot.querySelector('.custom-input').value;
                    console.log(start, end);
                    remainingSteps = calculatePath(start, end);
                }
            })
            .catch(error => {
                console.error('Error loading template:', error);
            });
    }

    // Method to show/hide the menu
    toggleMenu() {
        const container = this.shadowRoot.querySelector('.side-menu');
        const menuContainer = this.ownerDocument.querySelector('.container');
        if (container.style.display === 'none') {
            container.style.display = 'block';
            menuContainer.style.width = this.containerWidth;
            this.shadowRoot.querySelector(".deco").style.display = 'block';
        } else {
            container.style.display = 'none';
            this.shadowRoot.querySelector(".deco").style.display = 'none';
            menuContainer.style.width = 'fit-content';
        }
    }
}

let polyline = null;
let markers = [];
let remainingSteps;
async function calculatePath(start, end) {
    try {
        console.log(start, end);
        let locaStart;
        let locaEnd;
        const regex = /^-?\d{1,2}\.\d{4}$/;
        if (!regex.test(start[0]) || !regex.test(start[1]) || !regex.test(end[0]) || !regex.test(end[1])) {
            start = start.replaceAll(' ', '+');
            end = end.replaceAll(' ', '+');
            console.log(start, end);
            locaStart = (await fetch(`https://api-adresse.data.gouv.fr/search/?q=${start}&limit=5`));
            await locaStart.json().then(r => locaStart = r.features[0].geometry.coordinates);
            locaEnd = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${end}&limit=5`);
            await locaEnd.json().then(r => locaEnd = r.features[0].geometry.coordinates);
        } else {
            locaStart = start;
            locaEnd = end;
        }

        console.log(locaStart, locaEnd);

        L.marker([locaStart[1], locaStart[0]]).addTo(window.map);
        L.marker([locaEnd[1], locaEnd[0]]).addTo(window.map);
        const rep = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62482e4596c77c6c41079fbec41de976c380&start=${locaStart[0]},${locaStart[1]}&end=${locaEnd[0]},${locaEnd[1]}`)
        let coords = [];
        rep.json().then(r => {
            if (markers.length > 0) {
                markers.forEach(marker => window.map.removeLayer(marker));
            }
            stepMarkers = [];
            // recup les steps du chemin
            console.log(r.features[0].properties.segments[0].steps);
            const stepContainer = document.querySelector("my-menu").shadowRoot.querySelector('#steps-container');
            const allSteps = r.features[0].properties.segments[0].steps;
            let lastPoint = null
            for (let i = 0; i < 10; i++) {
                if (allSteps.length < i) break;
                const step = allSteps[i];
                const stepElement = document.createElement('my-step');
                console.log('instruction' + step.instruction);
                stepElement.setAttribute('placeholder', `${i + 1}. ` + step.instruction);
                stepContainer.appendChild(stepElement);
                lastPoint = step.way_points[1];

                const startPoint = step.way_points[0];
                const startCoords = r.features[0].geometry.coordinates[startPoint];
                const marker = L.marker([startCoords[1], startCoords[0]]).addTo(window.map);

                stepMarkers.push(marker);
            }
            console.log(lastPoint);
            if (polyline) {
                window.map.removeLayer(polyline);
            }
            coords = r.features[0].geometry.coordinates;
            const latLngCoordinates = coords.slice(0, lastPoint).map(coord => [coord[1], coord[0]]);
            polyline = L.polyline(latLngCoordinates, {color: 'blue'}).addTo(window.map);
            window.map.fitBounds(polyline.getBounds());

            startConsumingSteps();

            return allSteps.length;
        });
    } catch (e) {
        console.error(e);
    }
}

// Define the custom element
customElements.define('my-menu', Menu);
