# MyCalendApp Backend

[![GitHub Super-Linter](https://github.com/MyCalendApp/backend/workflows/Continuous%20Integration/badge.svg)](https://github.com/marketplace/actions/super-linter)

## Install

- 1. Installation des dependances

``` bash
yarn install
```

ou

``` bash
npm install
```

- 2. créer un fichier .env

``` conf
PORT={PORT de l'app (3000)}
HOST={HOST de la game (localhost)}
WEBURl={URL pour le cors (localhost:3001)}
MONGO_CONNECTION_STRING={Url de connexion pour la base mongo}
JWT_SECRET_KEY={SECRET DU JWT}
PUBLIC={CHEMIN DU DOSSIER public (./public)}
```

## lancer l'appli

``` bash
yarn start
```

ou

``` bash
npm run start
```

## lancer l'appli avec reload auto

``` bash
yarn watch
```

ou

``` bash
npm run watch
```
