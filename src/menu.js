class Menu extends HTMLElement {
    constructor() {
        super();
        // Attache le shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });

        // Structure HTML du menu
        const container = document.createElement('div');
        container.setAttribute('class', 'menu-container');

        const menu = document.createElement('div');
        menu.setAttribute('class', 'side-menu');
        menu.innerHTML = `
      <my-input placeholder="Départ"></my-input>
      <my-input placeholder="Arrivé"></my-input>
      
      <my-step placeholder="1. Départ"></my-step>
      <my-step placeholder="2. Arrivé"></my-step>
      <div id="envoi"> envoi </div>
    `;

        const toggleButton = document.createElement('div');
        toggleButton.innerText = '☰ Menu';
        toggleButton.setAttribute('class', 'toggle-btn');
        toggleButton.onclick = () => this.calculatePath();


        container.appendChild(toggleButton);
        container.appendChild(menu);
        shadow.appendChild(container);

        // Lien au fichier CSS externe
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'menu.css');
        shadow.appendChild(linkElem);
    }

    async calculatePath() {
        const start = this.shadowRoot.querySelector('my-input').shadowRoot.querySelector('.custom-input').value;
        const end = this.shadowRoot.querySelectorAll('my-input')[1].shadowRoot.querySelector('.custom-input').value;
        let cleanStart = start.replaceAll(' ', '+');
        let cleanEnd = end.replaceAll(' ', '+');
        console.log(cleanStart, cleanEnd)
        let locaStart = (await fetch(`https://api-adresse.data.gouv.fr/search/?q=${cleanStart}&limit=5`));
        await locaStart.json().then(r => locaStart = r.features[0].geometry.coordinates);
        let locaEnd = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${cleanEnd}&limit=5`);
        await locaEnd.json().then(r => locaEnd = r.features[0].geometry.coordinates);
        console.log(locaStart, locaEnd)
        L.marker([locaStart[1], locaStart[0]]).addTo(window.map);
        L.marker([locaEnd[1], locaEnd[0]]).addTo(window.map);
        const rep = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62482e4596c77c6c41079fbec41de976c380&start=${locaStart[0]},${locaStart[1]}&end=${locaEnd[0]},${locaEnd[1]}`)
        let coords = [];
        rep.json().then(r => {
            coords = r.features[0].geometry.coordinates;
            const latLngCoordinates = coords.map(coord => [coord[1], coord[0]]);
            const polyline = L.polyline(latLngCoordinates, { color: 'blue' }).addTo(window.map);
            window.map.fitBounds(polyline.getBounds());
        });

    }

    // Méthode pour afficher/masquer le menu
    toggleMenu() {
        const container = this.shadowRoot.querySelector('.side-menu');
        const toggleButton = this.shadowRoot.querySelector('.toggle-btn');
        const menuContainer = this.ownerDocument.querySelector('.container');
        if (container.style.display === 'none') {
            container.style.display = 'block';
            toggleButton.innerText = '☰ Menu';
            menuContainer.style.width = '250px';
        } else {
            container.style.display = 'none';
            toggleButton.innerText = '☰';
            menuContainer.style.width = 'fit-content';

        }
    }
}

// Définir l'élément personnalisé
customElements.define('my-menu', Menu);
