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

let polyline = [];
let markers = [];
let remainingSteps = 0;
let path;
let k = 0;
let intervalId = null;

async function calculatePath(start, end, step) {
    const stepContainer = document.querySelector("my-menu").shadowRoot.querySelector('#steps-container');
    stepContainer.style.display='block';
    try {
        console.log(start, end);
        let locaStart;
        let locaEnd;
        const regex = /^-?\d{1,2}\.\d+$/;
        if (!regex.test(start[0]) || !regex.test(start[1])) {
            start = start.replaceAll(' ', '+');
            console.log(start);
            locaStart = start
        } else {
            locaStart = start.toString();
        }

        if (!regex.test(end[0]) || !regex.test(end[1])){
            end = end.replaceAll(' ', '+');
            console.log(end);
            locaEnd = end;
        } else {
            locaEnd = end.toString();
        }

        console.log(locaStart, locaEnd);
        const rep = await fetch(`http://localhost:8081/Itinerary/CalculateItinerary?departure=${locaStart}&arrival=${locaEnd}&step=${step}`);
    } catch (e) {
        console.error(e);
    }
}


async function consumeSteps() {
    if (3 < stepContainer.childElementCount) {
        stepContainer.removeChild(stepContainer.firstChild);
    } else if (0 < stepContainer.childElementCount <= 3 && remainingSteps > 0) {
        const step= stepContainer.lastChild;
        const point = step.attributes['point'].value;
        const end = document.querySelector("my-menu").shadowRoot.querySelectorAll('my-input')[1].shadowRoot.querySelector('.custom-input').value;
        clearInterval(intervalId)
        calculatePath(path[point], end, step.attributes['way'].value);
    } else if (0 < stepContainer.childElementCount && stepContainer.childElementCount <= 3 && remainingSteps === 0) {
        stepContainer.removeChild(stepContainer.firstChild);
    } else if (stepContainer.childElementCount === 0) {
        clearInterval(intervalId);
        k = 0;
        if (polyline.length > 0) {
            polyline.map(poly => window.map.removeLayer(poly));
        }
        alert("Arrivé à destination");
    } else {
        alert("mauvais cas")
        clearInterval(intervalId);
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
                if(message.body.toString().startsWith("error")){
                    alert(message.body);
                    return;
                }
                const response = JSON.parse(message.body);
                let coords = [];
                if (markers.length > 0) {
                    markers.forEach(marker => window.map.removeLayer(marker));
                }
                if (polyline.length > 0) {
                    polyline.map(poly => window.map.removeLayer(poly));
                }
                stepMarkers = [];
                // recup les steps du chemin
                let lastPoint = null
                path = [];
                let totalSteps = 0;
                let nbDisplaySteps = 10;
                let nbDisplayed = 0;
                for (const element of response) {
                    let partOfPath = [];
                    const data = element;
                    console.log(data.properties.segments[0].steps);
                    const way = data.type;
                    console.log(way);
                    const stepContainer = document.querySelector("my-menu").shadowRoot.querySelector('#steps-container');
                    const allSteps = data.properties.segments[0].steps;
                    console.log("step length: " + allSteps.length)
                    totalSteps += allSteps.length;
                    for (let i = 0; i < allSteps.length; i++) {
                        if (allSteps.length <= i) break;
                        const step = allSteps[i];
                        if (nbDisplaySteps > 0) {
                            const stepElement = document.createElement('my-step');
                            console.log('instruction' + step.instruction);
                            stepElement.setAttribute('placeholder', `${k + 1}. ` + step.instruction);
                            stepElement.setAttribute("time", step.duration);
                            stepElement.setAttribute("distance", step.distance);
                            stepElement.setAttribute('point', step.way_points[1]);
                            stepElement.setAttribute('way', way);
                            stepContainer.appendChild(stepElement);
                            nbDisplaySteps--;
                            nbDisplayed++
                            k++;
                        }

                        let startPoint = step.way_points[0];
                        lastPoint = step.way_points[1];

                        const startCoords = data.geometry.coordinates[startPoint];
                        //const marker = L.marker([startCoords[1], startCoords[0]]).addTo(window.map);
                        //stepMarkers.push(marker);

                        for (let i=startPoint; i<lastPoint; i++){
                            partOfPath.push(data.geometry.coordinates[i]);
                        }
                    }
                    const latLngCoordinates = partOfPath.map(coord => [coord[1], coord[0]]);
                    polyline.push(L.polyline(latLngCoordinates, {color: way === 'foot'? 'blue':'red'}).addTo(window.map));
                    partOfPath.forEach(coord => path.push(coord));
                    partOfPath = [];
                    const bounds = L.latLngBounds([response[0].geometry.coordinates[0][1], response[0].geometry.coordinates[0][0]],[data.geometry.coordinates[lastPoint][1], data.geometry.coordinates[lastPoint][0]]);
                    map.fitBounds(bounds);
                }

                remainingSteps = totalSteps - nbDisplayed;
                startConsumingSteps();
                p.appendChild(document.createTextNode(message.body));
                document.getElementById("debug").append(p);

            });
        });
        return false;
    };


} else {
    alert("Your browser does not support WebSockets.");
}