class Step extends HTMLElement {
    shadow;
    constructor() {
        super();
        // Attache le shadow DOM
        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        // Structure HTML du menu
        const container = document.createElement('div');
        container.setAttribute('class', 'step');

        let infos = this.getAttribute('instruction')
        let stepNumber = this.getAttribute('stepNumber')
        let distance = this.getAttribute('distance')/1000
        distance = distance.toFixed(4).replace(/\.?0+$/, "");
        let time = Math.floor(this.getAttribute('time')/60)

        const step = document.createElement('div');
        step.setAttribute('class', 'step');
        step.innerHTML = `
<div class="step-style">
    <div class="step-number">Step ${stepNumber}: <p class="step-time">&nbsp;&nbsp;${time} min</p></div>
    <div class="step-instruction">${infos}</div>
    <div  class="step-distance">(${distance} km)</div>
</div>
`;

        container.appendChild(step);
        this.shadow.appendChild(container);

        // Lien au fichier CSS externe
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', './components/step/step.css');
        this.shadow.appendChild(linkElem);
    }
}

// Définir l'élément personnalisé
customElements.define('my-step', Step);
