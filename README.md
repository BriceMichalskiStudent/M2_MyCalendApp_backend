# MyCalendApp Backend


[![Website Prod](https://img.shields.io/github/deployments/MyCalendApp/backend/api-mycalendapp?label=deployment )](https://api-mycalendapp.herokuapp.com/ping)
[![GitHub Super-Linter](https://github.com/MyCalendApp/backend/workflows/Continuous%20Integration/badge.svg)](https://github.com/marketplace/actions/super-linter)
[![Website Prod](https://img.shields.io/website-up-down-green-red/http/api-mycalendapp.herokuapp.com/ping)](https://api-mycalendapp.herokuapp.com/ping)
![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
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
