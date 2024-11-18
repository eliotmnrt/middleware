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

                const customInput= shadow.querySelector('.custom-input');
                //const myLocation = shadow.querySelector('.myLocation');
                const suggestionsContainer = shadow.querySelector(".suggestions-container");


                customInput.setAttribute('placeholder', this.getAttribute('placeholder'));
                const myLocation = document.createElement('li');
                myLocation.setAttribute('class', 'myLocation');
                myLocation.innerHTML = 'Ma localisation';
                suggestionsContainer.appendChild(myLocation);
                suggestionsContainer.style.display = 'none';
                const allSuggestions = document.querySelectorAll('.suggestion');

                myLocation.style.display = 'none';
                //handle my location
                myLocation.addEventListener('click', async () => {
                    if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(async (position) => {
                            const rep = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${position.coords.longitude}&lat=${position.coords.latitude}`);
                            const data = await rep.json();
                            customInput.value = data.features[0].properties.label;
                            allSuggestions.forEach(mySuggestion => {
                                mySuggestion.innerHTML = '';
                                mySuggestion.style.display = 'none';
                            });
                            myLocation.style.display = 'none';
                            suggestionsContainer.style.display = 'none';
                        });
                    } else {
                        console.log("geolocation is not available");
                    }
                });
                //suggestionsContainer.setAttribute('class', 'suggestion');
                customInput.addEventListener('input', async () => {
                    const query = customInput.value;
                    if (query.length < 3) {
                        myLocation.style.display = 'block';

                        return;
                    }
                    try {
                        suggestionsContainer.style.display = 'block';
                        const cleanQuery = query.replaceAll(' ', '+');

                        const rep = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${cleanQuery}`);
                        const data = await rep.json();
                        suggestionsContainer.innerHTML = ''; // Réinitialiser les suggestions

                        data.features.forEach(feature => {
                            const suggestion = document.createElement('li');
                            suggestion.setAttribute('class', 'suggestion');
                            suggestion.textContent = feature.properties.label;
                            suggestion.addEventListener('click', () => {
                                customInput.value = feature.properties.label;
                                customInput.setAttribute('data-lon', feature.geometry.coordinates[0]);
                                customInput.setAttribute('data-lat', feature.geometry.coordinates[1]);
                                allSuggestions.forEach(mySuggestion => {
                                    mySuggestion.innerHTML = '';
                                    mySuggestion.style.display = 'none';
                                });
                                suggestionsContainer.style.display = 'none';
                                myLocation.style.display = 'none';
                            });
                            suggestionsContainer.appendChild(suggestion);
                        });
                    } catch (error) {
                        console.error('Error fetching suggestions:', error);
                    }  });
                const container= shadow.querySelector('.myInput-container');
                container.appendChild(suggestionsContainer);
                customInput.addEventListener('focus', () => {
                    myLocation.style.display = 'block';
                    suggestionsContainer.style.display = 'block'; // Affiche la liste
                });

            }) .catch(error => {
            console.error('Error loading template:', error);
        });
    }
}

// Définir l'élément personnalisé
customElements.define('my-input', MyInput);
