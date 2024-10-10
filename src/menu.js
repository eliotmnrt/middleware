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
    `;

        const toggleButton = document.createElement('div');
        toggleButton.innerText = '☰ Menu';
        toggleButton.setAttribute('class', 'toggle-btn');
        toggleButton.onclick = () => this.toggleMenu();


        container.appendChild(toggleButton);
        container.appendChild(menu);
        shadow.appendChild(container);

        // Lien au fichier CSS externe
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'menu.css');
        shadow.appendChild(linkElem);
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
