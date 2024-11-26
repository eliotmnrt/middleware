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
    const stepContainer = document.querySelector("my-menu").shadowRoot.querySelector('#steps-container');
    stepContainer.style.display='block';
    try {
        console.log(start, end);
        let locaStart;
        let locaEnd;
        const regex = /^-?\d{1,2}\.\d+$/;
        if (!regex.test(start[0]) || !regex.test(start[1]) || !regex.test(end[0]) || !regex.test(end[1])) {
            start = start.replaceAll(' ', '+');
            end = end.replaceAll(' ', '+');
            console.log(start, end);
            locaStart = start
            locaEnd = end;
        } else {
            locaStart = start.toString();
            locaEnd = end.toString();
        }

        console.log(locaStart, locaEnd);
        const rep = await fetch(`http://localhost:8081/Itinerary/CalculateItinerary?departure=${locaStart}&arrival=${locaEnd}`);
        if (!rep.ok) {
            throw new Error(`HTTP error! Status: ${rep.status}`);
        }
        const data = await rep.json();
        let coords = [];
        if (markers.length > 0) {
            markers.forEach(marker => window.map.removeLayer(marker));
        }
        stepMarkers = [];
        // recup les steps du chemin
        console.log(data.features[0].properties.segments[0].steps);
        const stepContainer = document.querySelector("my-menu").shadowRoot.querySelector('#steps-container');
        const allSteps = data.features[0].properties.segments[0].steps;
        let lastPoint = null
        for (let i = 0; i < 10; i++) {
            if (allSteps.length <= i) break;
            const step = allSteps[i];
            const stepElement = document.createElement('my-step');
            console.log('instruction' + step.instruction);
            stepElement.setAttribute('placeholder', `${k+i + 1}. ` + step.instruction);
            stepElement.setAttribute("time", step.duration);
            stepElement.setAttribute("distance", step.distance);
            stepElement.setAttribute('point', step.way_points[1]);
            stepContainer.appendChild(stepElement);
            lastPoint = step.way_points[1];

            const startPoint = step.way_points[0];
            const startCoords = data.features[0].geometry.coordinates[startPoint];
            const marker = L.marker([startCoords[1], startCoords[0]]).addTo(window.map);

            stepMarkers.push(marker);
        }
        k += Math.min(10, allSteps.length);
        console.log(lastPoint);
        if (polyline) {
            window.map.removeLayer(polyline);
        }
        path = data.features[0].geometry.coordinates;
        const latLngCoordinates = path.slice(0, lastPoint).map(coord => [coord[1], coord[0]]);
        polyline = L.polyline(latLngCoordinates, {color: 'blue'}).addTo(window.map);
        window.map.fitBounds(polyline.getBounds());

        remainingSteps = allSteps.length;
        startConsumingSteps();
    } catch (e) {
        console.error(e);
    }
}


async function consumeSteps() {
    console.log(remainingSteps);
    console.log(stepContainer.childElementCount);
    if (3 < stepContainer.childElementCount) {
        stepContainer.removeChild(stepContainer.firstChild);
        remainingSteps--;
    } else if (0 < stepContainer.childElementCount < 3 && remainingSteps > 3) {
        const point = stepContainer.firstChild.attributes['point'].value;
        remainingSteps = calculatePath(path[point], path[path.length - 1]);
    } else if (0 < stepContainer.childElementCount && stepContainer.childElementCount <= 3) {
        stepContainer.removeChild(stepContainer.firstChild);
        remainingSteps--;
    } else if (remainingSteps === 0) {
        clearInterval(intervalId);
        k = 0;
        alert("Arrivé à destination");
    }
}


function startConsumingSteps() {
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(consumeSteps, 1000);
}
let mess;

if (window.WebSocket) {
    var client, destination;
    document.getElementById("debug").onclick = function () {
        let url = "ws://localhost:61614/stomp";
        let login = "admin";
        let passcode = "password";
        destination = "itineraryQueue";

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
                mess = message.body;
                const response = JSON.parse(message.body);
                let coords = [];
                if (markers.length > 0) {
                    markers.forEach(marker => window.map.removeLayer(marker));
                }
                stepMarkers = [];
                // recup les steps du chemin
                let lastPoint = null
                path = [];
                let totalSteps = 0;
                for (let i = 0; i < response.length; i++) {
                    const data = response[i];
                    console.log(data.properties.segments[0].steps);
                    const stepContainer = document.querySelector("my-menu").shadowRoot.querySelector('#steps-container');
                    const allSteps = data.properties.segments[0].steps;
                    totalSteps += allSteps;
                    for (let i = 0; i < allSteps.length; i++) {
                        if (allSteps.length <= i) break;
                        const step = allSteps[i];
                        const stepElement = document.createElement('my-step');
                        console.log('instruction' + step.instruction);
                        stepElement.setAttribute('placeholder', `${k+i + 1}. ` + step.instruction);
                        stepElement.setAttribute("time", step.duration);
                        stepElement.setAttribute("distance", step.distance);
                        stepElement.setAttribute('point', step.way_points[1]);
                        stepContainer.appendChild(stepElement);
                        lastPoint = step.way_points[1];

                        let startPoint = step.way_points[0];
                        const startCoords = data.geometry.coordinates[startPoint];
                        const marker = L.marker([startCoords[1], startCoords[0]]).addTo(window.map);

                        stepMarkers.push(marker);
                        console.log(startPoint, lastPoint)
                        for (let i=startPoint; i<lastPoint; i++){
                            path.push(data.geometry.coordinates[i]);
                        }
                    }
                    k += allSteps.length;
                }
                console.log(lastPoint);
                if (polyline) {
                    window.map.removeLayer(polyline);
                }

                const latLngCoordinates = path.map(coord => [coord[1], coord[0]]);
                console.log(latLngCoordinates)
                polyline = L.polyline(latLngCoordinates, {color: 'blue'}).addTo(window.map);
                console.log(polyline);
                window.map.fitBounds(polyline.getBounds());

                remainingSteps = totalSteps.length;
                //startConsumingSteps();
                p.appendChild(document.createTextNode(message.body));
                document.getElementById("debug").append(p);

            });
        });
        return false;
    };


} else {
    alert("Your browser does not support WebSockets.");
}