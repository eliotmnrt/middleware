if(window.WebSocket) {
    var client, destination;
    document.querySelector("my-menu").shadowRoot.getElementById("envoi").onclick = function() {
        var url = "ws://localhost:61614/stomp";
        var login = "admin";
        var passcode = "password";
        destination = "/topic/chat.general";

        client = Stomp.client(url);

        /* this allows to display debug logs directly on the web page
        client.debug = function(str) {
            document.getElementById("debug").append(document.createTextNode(str + "\n"));
        };*/

        // the client is notified when it is connected to the server.
        client.connect(login, passcode, function(frame) {
            client.debug("connected to Stomp");
            client.subscribe(destination, function(message) {
                var p = document.createElement("p");
                p.appendChild(document.createTextNode(message.body));
                document.getElementById("debug").append(p);

            });
        });
        return false;
    };


} else {
    alert("Your browser does not support WebSockets.");
}