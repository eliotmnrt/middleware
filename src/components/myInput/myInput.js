class MyInput extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        fetch('./components/myInput/myInput.html')
            .then(response => response.text())
            .then(htmlContent => {
                // Parse and extract the template content
                let templateContent = new DOMParser()
                    .parseFromString(htmlContent, "text/html")
                    .querySelector("template").content;
                shadow.appendChild(templateContent.cloneNode(true));

                const customInput = shadow.querySelector('.custom-input');
                const suggestionsContainer = shadow.querySelector(".suggestions-container");
                customInput.setAttribute('placeholder', this.getAttribute('placeholder'));

                //Create my location suggestion
                const myLocation = document.createElement('li');
                myLocation.setAttribute('class', 'myLocation');
                myLocation.innerHTML = 'Ma localisation';
                suggestionsContainer.appendChild(myLocation);

                // Reset the suggestions container
                const resetSuggestions = () => {
                    suggestionsContainer.innerHTML = ''; // Vide le conteneur
                    suggestionsContainer.appendChild(myLocation);
                    suggestionsContainer.style.display = 'none';
                }
                const addSuggestion = (feature) => {
                    const suggestion = document.createElement('li');
                    suggestion.setAttribute('class', 'suggestion');
                    suggestion.textContent = feature.properties.label;
                    suggestion.addEventListener('click', () => {
                        customInput.value = feature.properties.label;
                        customInput.setAttribute('data-lon', feature.geometry.coordinates[0]);
                        customInput.setAttribute('data-lat', feature.geometry.coordinates[1]);
                        resetSuggestions();
                    });
                    suggestionsContainer.appendChild(suggestion);
                }
                resetSuggestions();
                //handle my location
                myLocation.addEventListener('click', async () => {
                    if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(async (position) => {
                            const rep = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${position.coords.longitude}&lat=${position.coords.latitude}`);
                            const data = await rep.json();
                            customInput.value = data.features[0].properties.label;
                            resetSuggestions();
                        });
                    } else {
                        console.log("geolocation is not available");
                    }
                });
                const fetchSuggestions = async (query) => {
                    if (query.length < 3) {
                        // Montre uniquement myLocation
                        resetSuggestions();
                        myLocation.style.display = 'block';
                        suggestionsContainer.style.display = 'block';
                    } else {
                        try {
                            const cleanQuery = query.replaceAll(' ', '+');
                            const rep = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${cleanQuery}`);
                            const data = await rep.json();
                            resetSuggestions();
                            myLocation.style.display = 'none'; // Cache myLocation
                            data.features.forEach(addSuggestion);
                            suggestionsContainer.style.display = 'block';
                        } catch (error) {
                            console.error('Error fetching suggestions:', error);
                        }
                    }
                };
                // only show suggestions when the input is focused
                customInput.addEventListener('focus', () => {
                    suggestionsContainer.style.display = 'block';
                    myLocation.style.display = customInput.value.length < 3 ? 'block' : 'none';
                });
                //hide suggestions when the input is blurred
                customInput.addEventListener('blur', () => {
                    setTimeout(resetSuggestions, 200); // Permet les clics avant de cacher
                });

                // Fetch suggestions when the input value changes
                customInput.addEventListener('input', () => fetchSuggestions(customInput.value));

            }) .catch(error => {
            console.error('Error loading template:', error);
        });
    }
}

// Définir l'élément personnalisé
customElements.define('my-input', MyInput);
