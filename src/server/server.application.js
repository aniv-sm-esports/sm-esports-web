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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerApplication = exports.ServerLocals = void 0;
var express_1 = require("express");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var auth_service_1 = require("./service/auth.service");
var cors_1 = require("cors");
var auth_middleware_1 = require("./middleware/auth.middleware");
var logger_middleware_1 = require("./middleware/logger.middleware");
require("reflect-metadata");
var entity_controller_1 = require("./entity/entity-controller");
var server_logger_1 = require("./server.logger");
// Application Instances
//
var ServerLocals = /** @class */ (function () {
    function ServerLocals() {
    }
    return ServerLocals;
}());
exports.ServerLocals = ServerLocals;
// !!!MIDDLEWARE ISSUES SECION!!!
/*
const expressAuth = expressjwt({
  algorithms: ['HS256'],
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
});
*/
var ServerApplication = /** @class */ (function () {
    function ServerApplication(settings) {
        //const RSA_PRIVATE_KEY: string = fs.readFileSync('./demos/private.key');
        // (pre-startup)
        this.serverDistFolder = (0, node_path_1.dirname)((0, node_url_1.fileURLToPath)(import.meta.url));
        this.browserDistFolder = (0, node_path_1.resolve)(this.serverDistFolder, '../browser');
        // NodeJS / Express
        this.app = (0, express_1.default)();
        this.logger = new server_logger_1.ServerLogger(settings);
        this.entityController = new entity_controller_1.EntityController(this.logger);
        this.authService = new auth_service_1.AuthService(this.entityController, this.logger);
        // Middleware (route not required by express)
        this.authMiddleware = new auth_middleware_1.AuthMiddleware(this.entityController, this.authService, this.logger);
        this.loggerMiddleware = new logger_middleware_1.LoggerMiddleware(this.logger);
    }
    ServerApplication.prototype.beginConfigure = function () {
        // NodeJS / Express Setup
        //
        // CORS
        this.app.use((0, cors_1.default)());
        // Headers
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", req.get('origin') || '*');
            res.header('Access-Control-Allow-Credentials', '*');
            res.header("Access-Control-Allow-Methods", "*");
            res.header("Access-Control-Allow-Headers", "*");
            next();
        });
        /*
            // JSON: Json serialization does not deal nicely with functions. Best to use
            //       dedicated data classes.
            //
            this.app.use(express.json({
        
              // Express.js website:  The reviver option is passed directly to JSON.parse as the second argument.
              // You can find more information on this argument in the MDN documentation about JSON.parse.
              //
              // https://expressjs.com/en/resources/middleware/body-parser.html
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Example.3A_Using_the_reviver_parameter
              //
              // NOTE*** To finish the serialization problem with decorators, the emitDecoratorMetadata flag may be used. This will require
              //         more digging to see how these 3 other frameworks are operating:  busboy, class-transformer, ...angular! There is a
              //         way to query the metadata. So, some custom @Type may be used to say it's "moment".
              //
              // Update: Switching from Moment -> Date for all public data fields. Moment is still used for Date manipulation; but for data
              //         serialization and comparison I think there's things that aren't quite finished with a "primary method".
              //
              reviver: (key, value) => {
        
                // key === "" implies object root (see MDN)
                //
                // These keys were queried from the code.
                if (key === "date" ||
                  key === "accountCreation" ||
                  key === "loginTime" ||
                  key === "expirationTime" ||
                  key === "expiresAt" ||
                  key === "loggedinAt") {
                  //console.log(`Date JSON found:  Key(${key}), Value(${value})`);
                  //console.log("Date JSON deserialized:  Moment:  ", moment(value).toDate());
                  return moment(value).toDate();
                }
        
                return value;
              }
            }));
        */
        // Auth Middleware
        this.app.route("/api/auth/login").post(this.authMiddleware.logon);
        this.app.route("/api/auth/create").post(this.authMiddleware.create);
        this.app.route("/api/auth/getSession").post(this.authMiddleware.getSession);
        this.logger.log("-> Server Endpoint:  (POST) " + "api/auth/login");
        this.logger.log("-> Server Endpoint:  (POST) " + "api/auth/create");
        this.logger.log("-> Server Endpoint:  (POST) " + "api/auth/getSession");
    };
    ServerApplication.prototype.endConfigure = function () {
        /**
         * Serve static files from /browser
         */
        this.app.use(express_1.default.static(this.browserDistFolder, {
            maxAge: '1y',
            index: false,
            redirect: false,
        }));
        console.log("Server Application Configuration Complete!");
    };
    ServerApplication.prototype.addMiddleware = function (middleware) {
        // Procedure
        //
        // 0) LoggerMiddleware: Log the request data: URL, ...
        // 1) AuthMiddleware:   Authenticate, store user session (UserJWT) on response.locals['userJWT']
        // 2) EntityMiddleware:
        //    -> Validate (override)
        //    -> Cache State / CRUD method
        //    -> Send Response
        // 3) Log Result (on exit?) (TBD)
        var routeFormat = "api/entity/" + middleware.routeBase;
        var checkState = routeFormat + '/checkState';
        var getState = routeFormat + '/getState';
        var setState = routeFormat + '/setState';
        var get = routeFormat + '/get';
        var getAll = routeFormat + '/getAll';
        var create = routeFormat + '/create';
        this.app.route(checkState).post(this.loggerMiddleware.logRequest, this.authMiddleware.authenticate, middleware.checkState);
        this.app.route(getState).post(this.loggerMiddleware.logRequest, this.authMiddleware.authenticate, middleware.getState);
        this.app.route(setState).post(this.loggerMiddleware.logRequest, this.authMiddleware.authenticate, middleware.setState);
        this.app.route(get).post(this.loggerMiddleware.logRequest, this.authMiddleware.authenticate, middleware.get);
        this.app.route(getAll).post(this.loggerMiddleware.logRequest, this.authMiddleware.authenticate, middleware.getAll);
        this.app.route(create).post(this.loggerMiddleware.logRequest, this.authMiddleware.authenticate, middleware.create);
        this.logger.log("-> Server Endpoint:  (POST) " + checkState);
        this.logger.log("-> Server Endpoint:  (POST) " + getState);
        this.logger.log("-> Server Endpoint:  (POST) " + setState);
        this.logger.log("-> Server Endpoint:  (POST) " + get);
        this.logger.log("-> Server Endpoint:  (POST) " + getAll);
        this.logger.log("-> Server Endpoint:  (POST) " + create);
    };
    ServerApplication.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //this.database.test();
                    //await this.entityController.testConnectQuery();
                    return [4 /*yield*/, this.entityController.authenticate()];
                    case 1:
                        //this.database.test();
                        //await this.entityController.testConnectQuery();
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerApplication.prototype.start = function () {
        var _this = this;
        var port = (process === null || process === void 0 ? void 0 : process.env['PORT']) || '10000';
        this.app.listen(port, function () {
            _this.logger.logSpecial("Node Express server listening on port ".concat(port));
        });
    };
    ServerApplication.prototype.getApp = function () {
        return this.app;
    };
    return ServerApplication;
}());
exports.ServerApplication = ServerApplication;
