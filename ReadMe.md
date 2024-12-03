# Projet Itinéraire Web avec WebSocket et Stomp

Ce projet permet de calculer et afficher un itinéraire entre deux points géographiques via une interface web en utilisant WebSocket et le protocole STOMP. Les itinéraires sont récupérés en temps réel depuis un serveur backend et affichés sur une carte interactive avec des étapes détaillées.

## Fonctionnalités

- Affichage de l'itinéraire sur une carte.
- Affichage des étapes du chemin dans une interface dédiée.
- Mise à jour dynamique des étapes au fur et à mesure de la consommation des étapes.
- Gestion de l'itinéraire à pied ou en vélo.
- Utilisation de la bibliothèque **Leaflet** pour l'affichage de la carte et le tracé des itinéraires.
- Consommation des messages via **STOMP**

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
- lancez votre serveur **ActiveMQ** sur le port