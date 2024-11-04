class Step extends HTMLElement {
    constructor() {
        super();
        // Attache le shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });

        // Structure HTML du menu
        const container = document.createElement('div');
        container.setAttribute('class', 'step-container');

        let infos = this.getAttribute('placeholder')

        const step = document.createElement('div');
        step.setAttribute('class', 'step');
        step.innerHTML = `<p>${infos}</p>`;

        container.appendChild(step);
        shadow.appendChild(container);

        // Lien au fichier CSS externe
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', './components/step/step.css');
        shadow.appendChild(linkElem);
    }

}

// Définir l'élément personnalisé
customElements.define('my-step', Step);
