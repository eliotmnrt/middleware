class MyInput extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const container = document.createElement('div');
        container.setAttribute('class', 'myInput-container');

        const input = document.createElement('input');
        input.setAttribute('class', 'custom-input');
        input.setAttribute('type', 'text');
        input.setAttribute('autocomplete', 'off');

        input.setAttribute('placeholder', this.getAttribute('placeholder'));

        const suggestionsList = document.createElement('div');
        suggestionsList.setAttribute('class', 'suggestions-container');

        suggestionsList.setAttribute('class', 'suggestions-container');

        const myLocalisationSuggestion = document.createElement('div');
        myLocalisationSuggestion.setAttribute('class', 'suggestion');
        myLocalisationSuggestion.textContent = 'Ma localisation';
        myLocalisationSuggestion.addEventListener('click', async () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const rep = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${position.coords.longitude}&lat=${position.coords.latitude}`);
                    const data = await rep.json();
                    input.value = data.features[0].properties.label;
                    suggestionsList.innerHTML = ''; // Masquer les suggestions après sélection
                });
            } else {
                console.log("geolocation is not available");
            }
        });
        suggestionsList.appendChild(myLocalisationSuggestion);

        input.addEventListener('input', async () => {
            const query = input.value;
            if (query.length < 3) {
                suggestionsList.innerHTML = '';
                return;
            }

            const cleanQuery = query.replaceAll(' ', '+');

            const rep = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${cleanQuery}`);
            const data = await rep.json();

            suggestionsList.innerHTML = ''; // Réinitialiser les suggestions

            data.features.forEach(feature => {
                const suggestion = document.createElement('div');
                suggestion.setAttribute('class', 'suggestion');
                suggestion.textContent = feature.properties.label;
                suggestion.addEventListener('click', () => {
                    input.value = feature.properties.label;
                    input.setAttribute('data-lon', feature.geometry.coordinates[0]);
                    input.setAttribute('data-lat', feature.geometry.coordinates[1]);
                    suggestionsList.innerHTML = ''; // Masquer les suggestions après sélection
                });
                suggestionsList.appendChild(suggestion);
            });
        });


        container.appendChild(input);
        container.appendChild(suggestionsList);
        shadow.appendChild(container);

        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'myInput.css');
        shadow.appendChild(linkElem);
    }
}

// Définir l'élément personnalisé
customElements.define('my-input', MyInput);
