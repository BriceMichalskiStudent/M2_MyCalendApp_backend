"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var App_1 = __importDefault(require("./App"));
var port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
var host = (_b = process.env.HOST) !== null && _b !== void 0 ? _b : "localhost";
var url = "http://" + host + (port ? ":" + port : "");
// Route de vérification du serveur
App_1.default.get('/ping', function (req, res) {
    res.send("pong");
});
// Lancement de l'api sur le port spécifié.
App_1.default.listen(port, function () {
    console.log("Running on PORT: " + port + ", HOST: " + host + ", URL: " + url);
});
