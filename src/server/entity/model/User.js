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
exports.User = void 0;
var sequelize_typescript_1 = require("sequelize-typescript");
var Entity_1 = require("./Entity");
var User = function () {
    var _classDecorators = [(0, sequelize_typescript_1.Table)({
            modelName: 'User',
            tableName: 'User',
            freezeTableName: true,
            timestamps: false
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = Entity_1.Entity;
    var _instanceExtraInitializers = [];
    var _get_Id_decorators;
    var _get_Name_decorators;
    var _get_Email_decorators;
    var _get_EmailVisible_decorators;
    var _get_CreatedDate_decorators;
    var _get_PictureUrl_decorators;
    var _get_ShortDescription_decorators;
    var _get_LongDescription_decorators;
    var _get_PersonRoleId_decorators;
    var _get_UserRoleId_decorators;
    var User = _classThis = /** @class */ (function (_super) {
        __extends(User_1, _super);
        function User_1() {
            var _this = _super.call(this) || this;
            __runInitializers(_this, _instanceExtraInitializers);
            return _this;
        }
        User_1.prototype.ctor = function () {
            return new User();
        };
        Object.defineProperty(User_1.prototype, "Id", {
            get: function () { return this.getDataValue('Id'); },
            set: function (value) { this.setDataValue('Id', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(User_1.prototype, "Name", {
            get: function () { return this.getDataValue('Name'); },
            set: function (value) { this.setDataValue('Name', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(User_1.prototype, "Email", {
            get: function () { return this.getDataValue('Email'); },
            set: function (value) { this.setDataValue('Email', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(User_1.prototype, "EmailVisible", {
            get: function () { return this.getDataValue('EmailVisible'); },
            set: function (value) { this.setDataValue('EmailVisible', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(User_1.prototype, "CreatedDate", {
            get: function () { return this.getDataValue('CreatedDate'); },
            set: function (value) { this.setDataValue('CreatedDate', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(User_1.prototype, "PictureUrl", {
            get: function () { return this.getDataValue('PictureUrl'); },
            set: function (value) { this.setDataValue('PictureUrl', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(User_1.prototype, "ShortDescription", {
            get: function () { return this.getDataValue('ShortDescription'); },
            set: function (value) { this.setDataValue('ShortDescription', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(User_1.prototype, "LongDescription", {
            get: function () { return this.getDataValue('LongDescription'); },
            set: function (value) { this.setDataValue('LongDescription', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(User_1.prototype, "PersonRoleId", {
            get: function () { return this.getDataValue('PersonRoleId'); },
            set: function (value) { this.setDataValue('PersonRoleId', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(User_1.prototype, "UserRoleId", {
            get: function () { return this.getDataValue('UserRoleId'); },
            set: function (value) { this.setDataValue('UserRoleId', value); },
            enumerable: false,
            configurable: true
        });
        return User_1;
    }(_classSuper));
    __setFunctionName(_classThis, "User");
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
        _get_Name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
            })];
        _get_Email_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
            })];
        _get_EmailVisible_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
            })];
        _get_CreatedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _get_PictureUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: true
            })];
        _get_ShortDescription_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false
            })];
        _get_LongDescription_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: true
            })];
        _get_PersonRoleId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false
            })];
        _get_UserRoleId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false
            })];
        __esDecorate(_classThis, null, _get_Id_decorators, { kind: "getter", name: "Id", static: false, private: false, access: { has: function (obj) { return "Id" in obj; }, get: function (obj) { return obj.Id; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_Name_decorators, { kind: "getter", name: "Name", static: false, private: false, access: { has: function (obj) { return "Name" in obj; }, get: function (obj) { return obj.Name; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_Email_decorators, { kind: "getter", name: "Email", static: false, private: false, access: { has: function (obj) { return "Email" in obj; }, get: function (obj) { return obj.Email; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_EmailVisible_decorators, { kind: "getter", name: "EmailVisible", static: false, private: false, access: { has: function (obj) { return "EmailVisible" in obj; }, get: function (obj) { return obj.EmailVisible; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_CreatedDate_decorators, { kind: "getter", name: "CreatedDate", static: false, private: false, access: { has: function (obj) { return "CreatedDate" in obj; }, get: function (obj) { return obj.CreatedDate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_PictureUrl_decorators, { kind: "getter", name: "PictureUrl", static: false, private: false, access: { has: function (obj) { return "PictureUrl" in obj; }, get: function (obj) { return obj.PictureUrl; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_ShortDescription_decorators, { kind: "getter", name: "ShortDescription", static: false, private: false, access: { has: function (obj) { return "ShortDescription" in obj; }, get: function (obj) { return obj.ShortDescription; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_LongDescription_decorators, { kind: "getter", name: "LongDescription", static: false, private: false, access: { has: function (obj) { return "LongDescription" in obj; }, get: function (obj) { return obj.LongDescription; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_PersonRoleId_decorators, { kind: "getter", name: "PersonRoleId", static: false, private: false, access: { has: function (obj) { return "PersonRoleId" in obj; }, get: function (obj) { return obj.PersonRoleId; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_UserRoleId_decorators, { kind: "getter", name: "UserRoleId", static: false, private: false, access: { has: function (obj) { return "UserRoleId" in obj; }, get: function (obj) { return obj.UserRoleId; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
}();
exports.User = User;
