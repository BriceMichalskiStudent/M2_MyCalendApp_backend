import swaggerUi from "swagger-ui-express";
import e from "express"
import * as mongoose from "mongoose";
import {model} from "mongoose";

interface InterfaceDoc {
    "openapi": string,
    "servers": [{
        description: string,
        url: string,
    }]
    "host": string,
    "info": {
        "version": string,
        "title": string,
        "description": string,
        "contact": string,
        "license": {
            "name": string,
            "url": string
        }
    },
    "swagger": string,
    "tags": object;
    "paths": object;
    "components": {
        "schemas": object;
    };
}

interface swaggerTags {
    "tags": Array<object>;
}

interface swaggerPaths {
    "inventory": object;
}

interface swaggerSchemas {
    "schema": object;
}


export default class swaggerDoc {

    private static onSwaggerDoc: InterfaceDoc;
    private static onSwaggerSchemas: swaggerSchemas;
    private static onSwaggerPaths: swaggerPaths;
    private static onSwaggerTags: swaggerTags;

    constructor() {
    }

    public static onGeneratorSwaggerDoc(app: e.Application, options: any) {

        if (options) {
            this.onSwaggerDoc = options;
        } else {
            console.log("Erreur lors de la mise en place des options");
        }

        if (this.onSwaggerSchemas.schema) {
            this.onSwaggerDoc.components.schemas = this.onSwaggerSchemas.schema;
        }
        if (this.onSwaggerPaths) {
            this.onSwaggerDoc.paths = this.onSwaggerPaths.inventory;
        }
        if (this.onSwaggerTags) {
            this.onSwaggerDoc.tags = this.onSwaggerTags.tags;

        }

        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(this.onSwaggerDoc));
    }

    public static onGenerateSwaggerModelAndRouteApi(routes: any, Model: mongoose.Model<mongoose.Document>) {

        let ModelMongoose: any = {};
        let RoutesMongoose: any = {};
        let routesStack = routes.stack;

        if (!this.onSwaggerSchemas) {
            this.onSwaggerSchemas = {} as swaggerSchemas;
            this.onSwaggerSchemas.schema = [{}];
        }

        this.onGenerateTags(Model.modelName);

        ModelMongoose[Model.modelName] = {
            "type": 'object',
            "required": this.onVerifyRequireMongoose(Model),
            "properties": this.onVerifyTypeMongoose(Model)
        };


        if (!this.onSwaggerPaths) {
            this.onSwaggerPaths = {} as swaggerPaths;
            this.onSwaggerPaths.inventory = [{}];
        }

        RoutesMongoose['/' + Model.modelName] = this.onVerifyPathsSwagger(routesStack, Model);

        this.onSwaggerSchemas.schema = Object.assign(ModelMongoose, this.onSwaggerSchemas.schema);
        this.onSwaggerPaths.inventory = Object.assign(RoutesMongoose, this.onSwaggerPaths.inventory);

    }


    private static onGenerateTags(modelName: string) {
        let tagsMongoose: object = {};

        if (!this.onSwaggerTags) {
            this.onSwaggerTags = {} as swaggerTags;
            this.onSwaggerTags.tags = [];
        }

        tagsMongoose = {"name": modelName, "description": "Regroupement des liens api pour  " + modelName};

        this.onSwaggerTags.tags.push(tagsMongoose);
    }

    private static onVerifyPathsSwagger(verbs_http: any, Model: mongoose.Model<mongoose.Document>) {

        let routePath: any = {};
        let routes: any = {};

        verbs_http.forEach((http: any) => {

            let method: string = http['route'].stack[0].method;
            let path: string = http['route'].path;

            routePath[method] = {
                "tags": [Model.modelName],
                "name": "Affiche les informations de" + Model.modelName,
                "operationId": Model.modelName + method,
                "description": "test description",
                "parameters": this.onVerifyParametersPathsSwagger(Model, method, path),
            };

            routes = Object.assign({}, routePath);

        });

        return routes;

    }

    private static onVerifyParametersPathsSwagger(Model: mongoose.Model<mongoose.Document>, method: string, path: string) {
        let parameter: object;
        let parameters: Array<object> = [];

        if (method === 'get' || method === 'delete') {

            parameter = {
                "in": "query",
                "name": this.onVerifyTypeMongoose(Model, 'property', '_id'),
                "description": this.onVerifyTypeMongoose(Model, 'example', '_id'),
                "required": true,
                "schema": {
                    "type": this.onVerifyTypeMongoose(Model, 'type', '_id'),
                    "format": this.onVerifyTypeMongoose(Model, 'format', '_id'),
                }
            };

            parameters.push(parameter);


        } else if (method === 'post' || method === 'put') {
            const that = this;
            Model.schema.eachPath(function (path) {

                if (method === 'post') {
                    if (path === '__v' || path === '_id') return false;
                } else {
                    if (path === '__v') return false;
                }

                parameter = {
                    "in": "query",
                    "name": that.onVerifyTypeMongoose(Model, 'property', path),
                    "description": that.onVerifyTypeMongoose(Model, 'example', path),
                    "required": true,
                    "schema": {
                        "type": that.onVerifyTypeMongoose(Model, 'type', path),
                        "format": that.onVerifyTypeMongoose(Model, 'format', path),
                    }
                };

                parameters.push(parameter);
            });
        } else {
            console.log(method + 'non pris en charge')
        }


        return parameters
    }

    private static onVerifyRequireMongoose(Model: mongoose.Model<mongoose.Document>) {

        let required: Array<string> = [];

        Model.schema.eachPath(function (path, schemaType) {

            if (path === '__v') {
                return false
            }

            let TypeRequired = JSON.parse(JSON.stringify(schemaType))['isRequired'];

            if (TypeRequired === true) {
                required.push(path)
            }

        });

        return required
    }

    private static onVerifyTypeMongoose(Model: mongoose.Model<mongoose.Document>, keyModel?: string, path?: string) {

        let property: any = {};
        let properties: any = {};

        Model.schema.eachPath(function (path, schemaType) {

            if (path === '__v') {
                return false
            }

            let schema = JSON.parse(JSON.stringify(schemaType));

            if (schema['instance'] === 'ObjectID' && path === '_id') {
                property[path] = {type: "id", format: schema['options'].format, example: schema['options'].example};
            } else if (schema['instance'] === 'ObjectID' && path != '_id') {
                property[path] = {$ref: "#/components/schemas/" + path};
            } else if (schema['instance'] === 'Array') {
                property[path] = {$ref: "#/components/schemas/" + path};
            } else {
                property[path] = {
                    type: schema['instance'],
                    format: schema['options'].format,
                    example: schema['options'].example
                };
            }

            properties = Object.assign({}, property);
        });

        return properties;
    }


}
