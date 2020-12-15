import express from 'express'
import * as bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'

import CRUDController from './Core/Controllers/CRUDController'
import UserController from './Core/Controllers/UserController'
import TokenController from './Core/Controllers/TokenController'

import AuthMiddleware from './Core/Middleware/AuthMiddleware'

import RoleCodes from './Commons/RoleCodes'

import UserModel from './Core/Models/UserModel';
import RoleModel from './Core/Models/RoleModel';
import TestModel from './Models/TestModel';
import TagModel from './Models/TagModel';
import EventModel from "./Models/EventModel";

import PostModel from "./Models/PostModel";
import CRUDRepository from "./Core/Repository/CrudRepository";
import UserRepository from "./Core/Repository/UserRepository";
import EventRepository from "./Repository/EventRepository"
import IocManager from "./Core/IocManager";

import {config} from "dotenv";
import fileUpload from "express-fileupload";

import express_status_monitor from "express-status-monitor";
import PostController from "./Controller/PostController";

import aws from "aws-sdk";

config()

class App {
    public app: express.Application;
    public mongoUrl: string = process.env.MONGO_CONNECTION_STRING ?? '';

    port = process.env.PORT ?? 3000;
    host = process.env.HOST ?? 'localhost';
    url = `http://${this.host}${this.port ? ':' + this.port : ''}`;

    constructor() {
        this.app = express()
        App.registerRepositories();
        this.config()
        this.mongoSetup();
    }

    private config(): void {
        // Configuration du CORS pour l'url du site web
        const corsOptions = {
            origin: process.env.WEBURL,
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        }

        // enable cors
        console.log(corsOptions)
        this.app.use(cors(corsOptions))
        this.app.use(fileUpload())
        this.app.use(express.static(process.env.PUBLIC ?? './public'))

        // support application/json type post data
        this.app.use(bodyParser.json())

        // support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({extended: false}))

        // API router
        this.app.use('/test/', CRUDController(IocManager.GetInstance().GetSingleton("TestCrudRepository"), {crudAll: AuthMiddleware(RoleCodes.USER)}));
        this.app.use('/tag/', CRUDController(IocManager.GetInstance().GetSingleton("TagRepository"), {crudAll: AuthMiddleware(RoleCodes.ADMIN)}));
        this.app.use('/event/', CRUDController(IocManager.GetInstance().GetSingleton("EventRepository"), {crudAll: AuthMiddleware(RoleCodes.USER)}));
        this.app.use('/post/', PostController(IocManager.GetInstance().GetSingleton("PostRepository"),
            IocManager.GetInstance().GetSingleton("EventRepository"),
            {crudAll: AuthMiddleware(RoleCodes.USER)}));

        const userRepository: UserRepository = IocManager.GetInstance().GetSingleton("UserRepository")
        this.app.use('/user/', UserController(userRepository))
        this.app.use('/token/', TokenController(userRepository))
        this.monitoringSetup()
        App.ensureEntitiesCreated().then()
    }

    private static registerRepositories() {
        IocManager.GetInstance().RegisterSingleton("TestCrudRepository", new CRUDRepository(TestModel.TestModel));
        IocManager.GetInstance().RegisterSingleton("RoleCrudRepository", new CRUDRepository(RoleModel.RoleModel));
        IocManager.GetInstance().RegisterSingleton("UserRepository", new UserRepository(UserModel.UserModel, [{name: "creator"}]));
        IocManager.GetInstance().RegisterSingleton("EventRepository", new EventRepository(EventModel.EventModel, [{name: "tags"}, {name: "creator"}]));
        IocManager.GetInstance().RegisterSingleton("TagRepository", new CRUDRepository(TagModel.TagModel));
        aws.config.region = process.env.AWS_REGION;
        IocManager.GetInstance().RegisterSingleton("AWS", aws);
        IocManager.GetInstance().RegisterSingleton("PostRepository", new CRUDRepository(PostModel.PostModel, [{name: "creator"}]));

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
        this.app.use(express_status_monitor())
    }
}

export default new App().app
