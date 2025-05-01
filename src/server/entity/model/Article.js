"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
var sequelize_typescript_1 = require("sequelize-typescript");
var Entity_1 = require("./Entity");
var Article = function () {
    var _classDecorators = [(0, sequelize_typescript_1.Table)({
            modelName: 'Article',
            tableName: 'Article',
            freezeTableName: true,
            timestamps: false
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = Entity_1.Entity;
    var _instanceExtraInitializers = [];
    var _get_Id_decorators;
    var _get_UserId_decorators;
    var _get_Date_decorators;
    var _get_Title_decorators;
    var _get_Description_decorators;
    var _get_Body_decorators;
    var _get_BannerImageUrl_decorators;
    var _get_BannerYoutubeSourceId_decorators;
    var _get_BannerLinkTypeId_decorators;
    var Article = _classThis = /** @class */ (function (_super) {
        __extends(Article_1, _super);
        function Article_1() {
            var _this = _super.call(this) || this;
            __runInitializers(_this, _instanceExtraInitializers);
            _this.Id = 0;
            _this.UserId = 0;
            _this.Date = new Date();
            _this.Title = '';
            _this.Description = '';
            _this.Body = undefined;
            _this.BannerImageUrl = undefined;
            _this.BannerYoutubeSourceId = undefined;
            _this.BannerLinkTypeId = 0;
            return _this;
        }
        Article_1.prototype.ctor = function () {
            return new Article();
        };
        Object.defineProperty(Article_1.prototype, "Id", {
            /*
                type: DataType
                unique?: boolean | string | {
                    name: string
                    msg: string
                }
                primaryKey?: boolean
                autoIncrement?: boolean
                autoIncrementIdentity?: boolean
                comment?: string
                references?: string | ModelAttributeColumnReferencesOptions
                onUpdate?: string
                onDelete?: string
                validate?: ModelValidateOptions
                values?: readonly string[]
                get?(this: M): unknown
                set?(this: M, val: unknown): void
             */
            get: function () { return this.getDataValue('Id'); },
            set: function (value) { this.setDataValue('Id', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Article_1.prototype, "UserId", {
            get: function () { return this.getDataValue('UserId'); },
            set: function (value) { this.setDataValue('UserId', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Article_1.prototype, "Date", {
            get: function () { return this.getDataValue('Date'); },
            set: function (value) { this.setDataValue('Date', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Article_1.prototype, "Title", {
            get: function () { return this.getDataValue('Title'); },
            set: function (value) { this.setDataValue('Title', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Article_1.prototype, "Description", {
            get: function () { return this.getDataValue('Description'); },
            set: function (value) { this.setDataValue('Description', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Article_1.prototype, "Body", {
            get: function () { return this.getDataValue('Body'); },
            set: function (value) { this.setDataValue('Body', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Article_1.prototype, "BannerImageUrl", {
            get: function () { return this.getDataValue('BannerImageUrl'); },
            set: function (value) { this.setDataValue('BannerImageUrl', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Article_1.prototype, "BannerYoutubeSourceId", {
            get: function () { return this.getDataValue('BannerYoutubeSourceId'); },
            set: function (value) { this.setDataValue('BannerYoutubeSourceId', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Article_1.prototype, "BannerLinkTypeId", {
            get: function () { return this.getDataValue('BannerLinkTypeId'); },
            set: function (value) { this.setDataValue('BannerLinkTypeId', value); },
            enumerable: false,
            configurable: true
        });
        return Article_1;
    }(_classSuper));
    __setFunctionName(_classThis, "Article");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _get_Id_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                autoIncrementIdentity: true,
                allowNull: false,
            })];
        _get_UserId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
            })];
        _get_Date_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _get_Title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
            })];
        _get_Description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
            })];
        _get_Body_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true
            })];
        _get_BannerImageUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: true
            })];
        _get_BannerYoutubeSourceId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: true
            })];
        _get_BannerLinkTypeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false
            })];
        __esDecorate(_classThis, null, _get_Id_decorators, { kind: "getter", name: "Id", static: false, private: false, access: { has: function (obj) { return "Id" in obj; }, get: function (obj) { return obj.Id; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_UserId_decorators, { kind: "getter", name: "UserId", static: false, private: false, access: { has: function (obj) { return "UserId" in obj; }, get: function (obj) { return obj.UserId; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_Date_decorators, { kind: "getter", name: "Date", static: false, private: false, access: { has: function (obj) { return "Date" in obj; }, get: function (obj) { return obj.Date; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_Title_decorators, { kind: "getter", name: "Title", static: false, private: false, access: { has: function (obj) { return "Title" in obj; }, get: function (obj) { return obj.Title; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_Description_decorators, { kind: "getter", name: "Description", static: false, private: false, access: { has: function (obj) { return "Description" in obj; }, get: function (obj) { return obj.Description; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_Body_decorators, { kind: "getter", name: "Body", static: false, private: false, access: { has: function (obj) { return "Body" in obj; }, get: function (obj) { return obj.Body; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_BannerImageUrl_decorators, { kind: "getter", name: "BannerImageUrl", static: false, private: false, access: { has: function (obj) { return "BannerImageUrl" in obj; }, get: function (obj) { return obj.BannerImageUrl; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_BannerYoutubeSourceId_decorators, { kind: "getter", name: "BannerYoutubeSourceId", static: false, private: false, access: { has: function (obj) { return "BannerYoutubeSourceId" in obj; }, get: function (obj) { return obj.BannerYoutubeSourceId; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_BannerLinkTypeId_decorators, { kind: "getter", name: "BannerLinkTypeId", static: false, private: false, access: { has: function (obj) { return "BannerLinkTypeId" in obj; }, get: function (obj) { return obj.BannerLinkTypeId; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Article = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Article = _classThis;
}();
exports.Article = Article;
