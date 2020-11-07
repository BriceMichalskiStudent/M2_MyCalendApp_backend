"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var swaggerDoc = /** @class */ (function () {
    function swaggerDoc() {
    }
    swaggerDoc.onGeneratorSwaggerDoc = function (app, options) {
        if (options) {
            this.onSwaggerDoc = options;
        }
        else {
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
        app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(this.onSwaggerDoc));
    };
    swaggerDoc.onGenerateSwaggerModelAndRouteApi = function (routes, Model) {
        var ModelMongoose = {};
        var RoutesMongoose = {};
        var routesStack = routes.stack;
        if (!this.onSwaggerSchemas) {
            this.onSwaggerSchemas = {};
            this.onSwaggerSchemas.schema = [{}];
        }
        this.onGenerateTags(Model.modelName);
        ModelMongoose[Model.modelName] = {
            "type": 'object',
            "required": this.onVerifyRequireMongoose(Model),
            "properties": this.onVerifyTypeMongoose(Model)
        };
        if (!this.onSwaggerPaths) {
            this.onSwaggerPaths = {};
            this.onSwaggerPaths.inventory = [{}];
        }
        RoutesMongoose['/' + Model.modelName] = this.onVerifyPathsSwagger(routesStack, Model);
        this.onSwaggerSchemas.schema = Object.assign(ModelMongoose, this.onSwaggerSchemas.schema);
        this.onSwaggerPaths.inventory = Object.assign(RoutesMongoose, this.onSwaggerPaths.inventory);
    };
    swaggerDoc.onGenerateTags = function (modelName) {
        var tagsMongoose = {};
        if (!this.onSwaggerTags) {
            this.onSwaggerTags = {};
            this.onSwaggerTags.tags = [];
        }
        tagsMongoose = { "name": modelName, "description": "Regroupement des liens api pour  " + modelName };
        this.onSwaggerTags.tags.push(tagsMongoose);
    };
    swaggerDoc.onVerifyPathsSwagger = function (verbs_http, Model) {
        var _this = this;
        var routePath = {};
        var routes = {};
        verbs_http.forEach(function (http) {
            var method = http['route'].stack[0].method;
            var path = http['route'].path;
            routePath[method] = {
                "tags": [Model.modelName],
                "name": "Affiche les informations de" + Model.modelName,
                "operationId": Model.modelName + method,
                "description": "test description",
                "parameters": _this.onVerifyParametersPathsSwagger(Model, method, path),
            };
            routes = Object.assign({}, routePath);
        });
        return routes;
    };
    swaggerDoc.onVerifyParametersPathsSwagger = function (Model, method, path) {
        var parameter;
        var parameters = [];
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
        }
        else if (method === 'post' || method === 'put') {
            var that_1 = this;
            Model.schema.eachPath(function (path) {
                if (method === 'post') {
                    if (path === '__v' || path === '_id')
                        return false;
                }
                else {
                    if (path === '__v')
                        return false;
                }
                parameter = {
                    "in": "query",
                    "name": that_1.onVerifyTypeMongoose(Model, 'property', path),
                    "description": that_1.onVerifyTypeMongoose(Model, 'example', path),
                    "required": true,
                    "schema": {
                        "type": that_1.onVerifyTypeMongoose(Model, 'type', path),
                        "format": that_1.onVerifyTypeMongoose(Model, 'format', path),
                    }
                };
                parameters.push(parameter);
            });
        }
        else {
            console.log(method + 'non pris en charge');
        }
        return parameters;
    };
    swaggerDoc.onVerifyRequireMongoose = function (Model) {
        var required = [];
        Model.schema.eachPath(function (path, schemaType) {
            if (path === '__v') {
                return false;
            }
            var TypeRequired = JSON.parse(JSON.stringify(schemaType))['isRequired'];
            if (TypeRequired === true) {
                required.push(path);
            }
        });
        return required;
    };
    swaggerDoc.onVerifyTypeMongoose = function (Model, keyModel, path) {
        var property = {};
        var properties = {};
        Model.schema.eachPath(function (path, schemaType) {
            if (path === '__v') {
                return false;
            }
            var schema = JSON.parse(JSON.stringify(schemaType));
            if (schema['instance'] === 'ObjectID' && path === '_id') {
                property[path] = { type: "id", format: schema['options'].format, example: schema['options'].example };
            }
            else if (schema['instance'] === 'ObjectID' && path != '_id') {
                property[path] = { $ref: "#/components/schemas/" + path };
            }
            else if (schema['instance'] === 'Array') {
                property[path] = { $ref: "#/components/schemas/" + path };
            }
            else {
                property[path] = {
                    type: schema['instance'],
                    format: schema['options'].format,
                    example: schema['options'].example
                };
            }
            properties = Object.assign({}, property);
        });
        return properties;
    };
    return swaggerDoc;
}());
exports.default = swaggerDoc;
