let stepContainer;
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(() => {
        const myMenu = document.querySelector("my-menu");
        if (myMenu && myMenu.shadowRoot) {
            stepContainer = myMenu.shadowRoot.querySelector("#steps-container");
            console.log(stepContainer);
            if (stepContainer) {
                observer.disconnect();
            }
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});
});

let polyline = null;
let markers = [];
let remainingSteps;
let path;
let k = 0;
let intervalId = null;

async function calculatePath(start, end) {
    try {
        console.log(start, end);
        let locaStart;
        let locaEnd;
        const regex = /^-?\d{1,2}\.\d+$/;
        if (!regex.test(start[0]) || !regex.test(start[1]) || !regex.test(end[0]) || !regex.test(end[1])) {
            start = start.replaceAll(' ', '+');
            end = end.replaceAll(' ', '+');
            console.log(start, end);
            locaStart = (await fetch(`https://api-adresse.data.gouv.fr/search/?q=${start}&limit=5`));
            await locaStart.json().then(r => locaStart = r.features[0].geometry.coordinates);
            locaEnd = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${end}&limit=5`);
            await locaEnd.json().then(r => locaEnd = r.features[0].geometry.coordinates);
        } else {
            locaStart = start;
            locaEnd = end;
        }

        console.log(locaStart, locaEnd);

        L.marker([locaStart[1], locaStart[0]]).addTo(window.map);
        L.marker([locaEnd[1], locaEnd[0]]).addTo(window.map);
        const rep = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62482e4596c77c6c41079fbec41de976c380&start=${locaStart[0]},${locaStart[1]}&end=${locaEnd[0]},${locaEnd[1]}`)
        let coords = [];
        rep.json().then(r => {
            if (markers.length > 0) {
                markers.forEach(marker => window.map.removeLayer(marker));
            }
            stepMarkers = [];
            // recup les steps du chemin
            console.log(r.features[0].properties.segments[0].steps);
            const stepContainer = document.querySelector("my-menu").shadowRoot.querySelector('#steps-container');
            const allSteps = r.features[0].properties.segments[0].steps;
            let lastPoint = null
            for (let i = 0; i < 10; i++) {
                if (allSteps.length <= i) break;
                const step = allSteps[i];
                const stepElement = document.createElement('my-step');
                console.log('instruction' + step.instruction);
                stepElement.setAttribute('placeholder', `${k+i + 1}. ` + step.instruction);
                stepElement.setAttribute('point', step.way_points[1]);
                stepContainer.appendChild(stepElement);
                lastPoint = step.way_points[1];

                const startPoint = step.way_points[0];
                const startCoords = r.features[0].geometry.coordinates[startPoint];
                const marker = L.marker([startCoords[1], startCoords[0]]).addTo(window.map);

                stepMarkers.push(marker);
            }
            k += Math.min(10, allSteps.length);
            console.log(lastPoint);
            if (polyline) {
                window.map.removeLayer(polyline);
            }
            path = r.features[0].geometry.coordinates;
            const latLngCoordinates = path.slice(0, lastPoint).map(coord => [coord[1], coord[0]]);
            polyline = L.polyline(latLngCoordinates, {color: 'blue'}).addTo(window.map);
            window.map.fitBounds(polyline.getBounds());

            remainingSteps = allSteps.length;
            startConsumingSteps();
        });
    } catch (e) {
        console.error(e);
    }
}


async function consumeSteps() {
    console.log(remainingSteps);
    console.log(stepContainer.childElementCount);
    if (3 < stepContainer.childElementCount) {
        stepContainer.removeChild(stepContainer.firstChild);
        console.log(remainingSteps);
        remainingSteps--;
    } else if (stepContainer.childElementCount < 3 && remainingSteps > 3) {
        const point = stepContainer.firstChild.attributes['point'].value;
        console.log(remainingSteps);
        remainingSteps = calculatePath(path[point], path[path.length - 1]);
    } else if (0 < stepContainer.childElementCount && stepContainer.childElementCount <= 3) {
        stepContainer.removeChild(stepContainer.firstChild);
        remainingSteps--;
    } else if (remainingSteps === 0) {
        clearInterval(intervalId);
        k = 0;
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startConsumingSteps() {
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(consumeSteps, 1000);
}


if (window.WebSocket) {
    var client, destination;
    document.querySelector("my-menu").shadowRoot.getElementById("envoi").onclick = function () {
        let url = "ws://localhost:61614/stomp";
        let login = "admin";
        let passcode = "password";
        destination = "/topic/chat.general";

        client = Stomp.client(url);

        /* this allows to display debug logs directly on the web page
        client.debug = function(str) {
            document.getElementById("debug").append(document.createTextNode(str + "\n"));
        };*/

        // the client is notified when it is connected to the server.
        client.connect(login, passcode, function (frame) {
            client.debug("connected to Stomp");
            client.subscribe(destination, function (message) {
                let p = document.createElement("p");
                p.appendChild(document.createTextNode(message.body));
                document.getElementById("debug").append(p);

            });
        });
        return false;
    };


} else {
    alert("Your browser does not support WebSockets.");
}