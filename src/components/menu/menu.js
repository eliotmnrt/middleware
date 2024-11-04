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
                goButton.onclick = () => this.calculatePath();
            })
            .catch(error => {
                console.error('Error loading template:', error);
            });
    }

    async calculatePath() {
        const start = this.shadowRoot.querySelector('my-input').shadowRoot.querySelector('.custom-input').value;
        const end = this.shadowRoot.querySelectorAll('my-input')[1].shadowRoot.querySelector('.custom-input').value;
        let cleanStart = start.replaceAll(' ', '+');
        let cleanEnd = end.replaceAll(' ', '+');
        console.log(cleanStart, cleanEnd)
        let locaStart = (await fetch(`https://api-adresse.data.gouv.fr/search/?q=${cleanStart}&limit=5`));
        await locaStart.json().then(r => locaStart = r.features[0].geometry.coordinates);
        let locaEnd = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${cleanStart}&limit=5`);
        await locaEnd.json().then(r => locaEnd = r.features[0].geometry.coordinates);
        console.log(locaStart, locaEnd)
        const rep = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62482e4596c77c6c41079fbec41de976c380&start=${locaStart[0]},${locaStart[1]}&end=${locaEnd[0]},${locaEnd[1]}`)
        console.log(rep.json().then(r => console.log(r)));
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

// Define the custom element
customElements.define('my-menu', Menu);