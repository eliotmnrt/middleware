# Projet Itinéraire Web avec WebSocket et Stomp

Ce projet permet de calculer et afficher un itinéraire entre deux points géographiques via une interface web en utilisant WebSocket et le protocole STOMP. Les itinéraires sont récupérés en temps réel depuis un serveur backend et affichés sur une carte interactive avec des étapes détaillées.

## Fonctionnalités

- Affichage de l'itinéraire sur une carte.
- Affichage des étapes du chemin dans une interface dédiée.
- Mise à jour dynamique des étapes au fur et à mesure de la consommation des étapes.
- Gestion de l'itinéraire à pied ou en vélo.
- Utilisation de la bibliothèque **Leaflet** pour l'affichage de la carte et le tracé des itinéraires.
- Consommation des messages via **STOMP**


## Hypothèses
- Le serveur calcule le trajet entre le point de départ et la station la plus proche et il a un trajet à pied jusqu'à la station de départ, puis en vélo d'une station à une autre , puis à pied jusqu'au point d'arrivé. Si le trajet jusqu'au point d'arrivé est plus proche à pied, il renvoie le chemin à pied.
- On part du principe que un utilisateur peut prendre un vélo dans une ville ou il y a un contrat, et le déposer dans une station d'un autre contrat.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- **Node.js** et **npm** (pour le développement du frontend et la gestion des dépendances).
- **Serveur WebSocket** actif (par exemple, ActiveMQ ou un autre serveur supportant STOMP).
- **Serveur Backend** pour la génération des itinéraires.

### Installer les dépendances

Une fois le repertoire cloné sur votre machine, veuillez installer les dépendances du projet avec:
```bash 
npm install
```

## Démarrer les instances nécéssaires
### ActiveMQ
- lancez votre serveur **ActiveMQ** sur le port 8161
commande pour lancer activeMQ:
 se placer sur le répertoire bin de activeMQ et exécuter la commande:`activemq start`
### Serveur c# Backend et ProxyCache
- lancez le serveur c# de backend ItineraryServer, le ItineraryServer.exe se trouve dans le dossier de rendu du projet dans: [ItineraryServer/bin/Debug/ItineraryServer.exe](ItineraryServer/bin/Debug/ItineraryServer.exe)
- lancer le serveur ProxyCache, le ProxyCache.exe se trouve dans le dossier du rendu du projet dans: [ProxyCache/bin/Debug/ProxyCache.exe](ProxyCache/bin/Debug/ProxyCache.exe)

## Version client HTML/CSS/JS
Note: le serveur backend et le proxy doivent être lancé avant de démarrer le frontend et le client lourd ne peut pas être démarré simutanément avec le client léger
- démarrer le frontend, en éxécutant le fichier [src/index.html](src/index.html)
- Pour visualiser un trajet, remplissez une 2 adresses dans les input origin/destination, ou selectionner sur la carte les coordonnées
- Patientez un peu, et le trajet s'affichera avec les étapes
- Si le trajet est à pied, il sera affiché en bleu, si c'est en vélo, il sera affiché en rouge
- le chemin est actualisé en temps réel, il est redemandé toutes les 10 étapes

## Version client lourd Java
Note: le serveur backend et le proxy doivent être lancé avant de démarrer le client lourd, et il ne peut pas être démarré simutanément avec le client léger HTML/CSS/JS
- Naviguer sur /ClientLourd
- éxécuter: `mvn clean package`
- puis lancer le ficher [App.java](ClientLourd/src/main/java/com/client/App.java)
- L'interface graphique devrait s'afficher, le trajet n'est pas dynamique, le client lourd permet uniquement de visualiser le trajet sans plus de détails
