"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bodyParser = __importStar(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var cors_1 = __importDefault(require("cors"));
var Swagger_1 = __importDefault(require("./Core/Swagger/Swagger"));
var CRUDController_1 = __importDefault(require("./Core/Controllers/CRUDController"));
var UserController_1 = __importDefault(require("./Core/Controllers/UserController"));
var TokenController_1 = __importDefault(require("./Core/Controllers/TokenController"));
var AuthMiddleware_1 = __importDefault(require("./Core/Middleware/AuthMiddleware"));
var RoleCodes_1 = __importDefault(require("./Commons/RoleCodes"));
var UserModel_1 = __importDefault(require("./Core/Models/UserModel"));
var RoleModel_1 = __importDefault(require("./Core/Models/RoleModel"));
var TestModel_1 = __importDefault(require("./Models/TestModel"));
var CrudRepository_1 = __importDefault(require("./Core/Repository/CrudRepository"));
var UserRepository_1 = __importDefault(require("./Core/Repository/UserRepository"));
var App = /** @class */ (function () {
    function App() {
        var _a, _b, _c;
        this.mongoUrl = (_a = process.env.MONGO_CONNECTION_STRING) !== null && _a !== void 0 ? _a : "";
        this.port = (_b = process.env.PORT) !== null && _b !== void 0 ? _b : 3000;
        this.host = (_c = process.env.HOST) !== null && _c !== void 0 ? _c : "localhost";
        this.url = "http://" + this.host + (this.port ? ":" + this.port : "");
        this.app = express_1.default();
        this.config();
        this.mongoSetup();
    }
    App.prototype.config = function () {
        var _a;
        // Configuration du CORS pour l'url du site web
        var corsOptions = {
            origin: process.env.WEBURl,
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        };
        // enable cors
        this.app.use(cors_1.default(corsOptions));
        this.app.use(express_1.default.static((_a = process.env.PUBLIC) !== null && _a !== void 0 ? _a : "./public"));
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // API router
        this.app.use('/test/', AuthMiddleware_1.default(RoleCodes_1.default.USER), CRUDController_1.default(new CrudRepository_1.default(TestModel_1.default.TestModel)));
        var userRepository = new UserRepository_1.default(UserModel_1.default.UserModel);
        this.app.use('/user/', UserController_1.default(userRepository));
        this.app.use('/token/', TokenController_1.default(userRepository));
        this.swaggerSetup();
        this.monitoringSetup();
    };
    App.prototype.ensureEntitiesCreated = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RoleModel_1.default.EnsureEntities()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, TestModel_1.default.EnsureEntities()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.mongoSetup = function () {
        var _this = this;
        mongoose_1.default.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        mongoose_1.default.set('useFindAndModify', false);
        mongoose_1.default.connection.once('open', function () {
            console.log('\x1b[34m%s\x1b[0m', 'Connected to Mongo via Mongoose');
            _this.ensureEntitiesCreated().then();
        });
        mongoose_1.default.connection.on('error', function (err) {
            console.error('Unable to connect to Mongo via Mongoose', err);
        });
    };
    App.prototype.swaggerSetup = function () {
        var options = {
            "openapi": "3.0.0",
            "host": this.url,
            "servers": [
                {
                    "url": this.url,
                    "description": "Dev server url"
                },
            ],
            "info": {
                "version": "1.0.0",
                "title": "MyCalendApp API",
                "description": "MyCalendApp is a School Project aiming to implement a social network. The particularity of this social network is to be calendar oriented with shared events, in public or private, with comments, a list of participants, a photo sharing on past events, a discussion and an organization tab for future events.",
                "contact": { "email": "benjamin.lhonnen@ynov.com" },
                "license": {
                    "name": "MIT",
                    "url": "https://github.com/MyCalendApp/backend/blob/main/LICENSE"
                }
            },
            "path": {},
            "components": {
                "schemas": ""
            }
        };
        Swagger_1.default.onGeneratorSwaggerDoc(this.app, options);
    };
    App.prototype.monitoringSetup = function () {
        this.app.use(require('express-status-monitor')());
    };
    return App;
}());
exports.default = new App().app;
