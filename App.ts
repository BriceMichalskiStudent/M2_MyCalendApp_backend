import express from 'express'
import * as bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'

import CRUDController from './Core/Controllers/CRUDController'
import UserController from './Core/Controllers/UserController'
import TokenController from './Core/Controllers/TokenController'

import AuthMiddleware from './Core/Middleware/AuthMiddleware'

import RoleCodes from './Commons/RoleCodes'

import UserModel from './Core/Models/UserModel'
import RoleModel from './Core/Models/RoleModel'
import TestModel from './Models/TestModel'
import CRUDRepository from './Core/Repository/CrudRepository'
import UserRepository from './Core/Repository/UserRepository'
require('dotenv').config()

class App {
    public app: express.Application;
    public mongoUrl: string = process.env.MONGO_CONNECTION_STRING ?? '';

    port = process.env.PORT ?? 3000;
    host = process.env.HOST ?? 'localhost';
    url = `http://${this.host}${this.port ? ':' + this.port : ''}`;

    constructor() {
        this.app = express()
        this.config()
        this.mongoSetup();
    }

    private config(): void {
        // Configuration du CORS pour l'url du site web
        const corsOptions = {
            origin: process.env.WEBURl,
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        }

        // enable cors
        this.app.use(cors(corsOptions))
        this.app.use(express.static(process.env.PUBLIC ?? './public'))

        // support application/json type post data
        this.app.use(bodyParser.json())

        // support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({extended: false}))

      // API router
      this.app.use('/test/', AuthMiddleware(RoleCodes.USER), CRUDController(new CRUDRepository(TestModel.TestModel)))

        const userRepository: UserRepository = new UserRepository(UserModel.UserModel)
        this.app.use('/user/', UserController(userRepository))
        this.app.use('/token/', TokenController(userRepository))
        this.monitoringSetup()
        App.ensureEntitiesCreated().then()
    }

    private static async ensureEntitiesCreated(): Promise<void> {
        await RoleModel.EnsureEntities();
        await TestModel.EnsureEntities();
    }

    private mongoSetup(): void {
        mongoose.connect(this.mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true});
        mongoose.set('useFindAndModify', false);
        mongoose.connection.once('open', () => {
            console.log('\x1b[34m%s\x1b[0m', 'Connected to Mongo via Mongoose');
            App.ensureEntitiesCreated().then();
        });
        mongoose.connection.on('error', (err) => {
            console.error('Unable to connect to Mongo via Mongoose', err);
        });
    }

    private monitoringSetup() {
        this.app.use(require('express-status-monitor')())
    }
}

export default new App().app
