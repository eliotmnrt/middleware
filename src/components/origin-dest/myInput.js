class MyInput extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const container = document.createElement('div');
        container.setAttribute('class', 'myInput-container');

        const input = document.createElement('input');
        input.setAttribute('class', 'custom-input');
        input.setAttribute('type', 'text');

        input.setAttribute('placeholder', this.getAttribute('placeholder'));

        container.appendChild(input);
        shadow.appendChild(container);

        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', './components/origin-dest/myInput.css');
        shadow.appendChild(linkElem);
    }
}

// Définir l'élément personnalisé
customElements.define('my-input', MyInput);
