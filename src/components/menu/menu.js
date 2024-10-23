class Menu extends HTMLElement {
    containerWidth ='400px'

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
    `;  
        const deco=document.createElement('img');
        deco.setAttribute('class','deco');
        deco.setAttribute('src','./images/deco.png');

        const toggleButton = document.createElement('div');
        toggleButton.setAttribute('id', 'toggle-btn');
        toggleButton.innerHTML = '<img src="./images/menuIcon.png" alt="Menu Icon" class="menu-icon">';
        toggleButton.onclick = () => this.toggleMenu();


        container.appendChild(toggleButton);
        container.appendChild(menu);
        container.appendChild(deco);
        shadow.appendChild(container);

        // Lien au fichier CSS externe
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', './components/menu/menu.css');
        shadow.appendChild(linkElem);
    }

    // Méthode pour afficher/masquer le menu
    toggleMenu() {
        const container = this.shadowRoot.querySelector('.side-menu');
        const toggleButton = this.shadowRoot.querySelector('.toggle-btn');
        const menuContainer = this.ownerDocument.querySelector('.container');
        if (container.style.display === 'none') {
            container.style.display = 'block';
            menuContainer.style.width = this.containerWidth;
        } else {
            container.style.display = 'none';
            menuContainer.style.width = 'fit-content';
        }
    }

}

// Définir l'élément personnalisé
customElements.define('my-menu', Menu);
