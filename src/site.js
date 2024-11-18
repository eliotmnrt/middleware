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

async function consumeSteps() {
    if (3 <= stepContainer.childElementCount && stepContainer.childElementCount <= 10) {
        stepContainer.removeChild(stepContainer.firstChild);
    } else if (stepContainer.childElementCount < 3 && remainingSteps > 3) {
        await calculatePath();
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startConsumingSteps() {
    setInterval(consumeSteps, 4000);
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