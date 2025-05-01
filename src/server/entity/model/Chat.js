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
exports.Chat = void 0;
var sequelize_typescript_1 = require("sequelize-typescript");
var Entity_1 = require("./Entity");
var User_1 = require("./User");
var Chat = function () {
    var _classDecorators = [(0, sequelize_typescript_1.Table)({
            modelName: 'Chat',
            tableName: 'Chat',
            freezeTableName: true,
            timestamps: false
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = Entity_1.Entity;
    var _instanceExtraInitializers = [];
    var _User_decorators;
    var _User_initializers = [];
    var _User_extraInitializers = [];
    var _get_Id_decorators;
    var _get_UserId_decorators;
    var _get_Text_decorators;
    var _get_Date_decorators;
    var _get_Flagged_decorators;
    var _get_FlaggedComments_decorators;
    var Chat = _classThis = /** @class */ (function (_super) {
        __extends(Chat_1, _super);
        function Chat_1() {
            var _this = _super.call(this) || this;
            _this.User = (__runInitializers(_this, _instanceExtraInitializers), __runInitializers(_this, _User_initializers, void 0));
            __runInitializers(_this, _User_extraInitializers);
            return _this;
        }
        Chat_1.prototype.ctor = function () {
            return new Chat();
        };
        Object.defineProperty(Chat_1.prototype, "Id", {
            get: function () { return this.getDataValue('Id'); },
            set: function (value) { this.setDataValue('Id', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Chat_1.prototype, "UserId", {
            get: function () { return this.getDataValue('UserId'); },
            set: function (value) { this.setDataValue('UserId', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Chat_1.prototype, "Text", {
            get: function () { return this.getDataValue('Text'); },
            set: function (value) { this.setDataValue('Text', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Chat_1.prototype, "Date", {
            get: function () { return this.getDataValue('Date'); },
            set: function (value) { this.setDataValue('Date', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Chat_1.prototype, "Flagged", {
            get: function () { return this.getDataValue('Flagged'); },
            set: function (value) { this.setDataValue('Flagged', value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Chat_1.prototype, "FlaggedComments", {
            get: function () { return this.getDataValue('FlaggedComments'); },
            set: function (value) { this.setDataValue('FlaggedComments', value); },
            enumerable: false,
            configurable: true
        });
        return Chat_1;
    }(_classSuper));
    __setFunctionName(_classThis, "Chat");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _User_decorators = [(0, sequelize_typescript_1.BelongsTo)(function () { return User_1.User; }, "UserId")];
        _get_Id_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                autoIncrementIdentity: true,
                allowNull: false,
            })];
        _get_UserId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.NUMBER,
                allowNull: false,
            }), (0, sequelize_typescript_1.ForeignKey)(function () { return User_1.User; })];
        _get_Text_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: true
            })];
        _get_Date_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false
            })];
        _get_Flagged_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false
            })];
        _get_FlaggedComments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false
            })];
        __esDecorate(_classThis, null, _get_Id_decorators, { kind: "getter", name: "Id", static: false, private: false, access: { has: function (obj) { return "Id" in obj; }, get: function (obj) { return obj.Id; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_UserId_decorators, { kind: "getter", name: "UserId", static: false, private: false, access: { has: function (obj) { return "UserId" in obj; }, get: function (obj) { return obj.UserId; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_Text_decorators, { kind: "getter", name: "Text", static: false, private: false, access: { has: function (obj) { return "Text" in obj; }, get: function (obj) { return obj.Text; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_Date_decorators, { kind: "getter", name: "Date", static: false, private: false, access: { has: function (obj) { return "Date" in obj; }, get: function (obj) { return obj.Date; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_Flagged_decorators, { kind: "getter", name: "Flagged", static: false, private: false, access: { has: function (obj) { return "Flagged" in obj; }, get: function (obj) { return obj.Flagged; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get_FlaggedComments_decorators, { kind: "getter", name: "FlaggedComments", static: false, private: false, access: { has: function (obj) { return "FlaggedComments" in obj; }, get: function (obj) { return obj.FlaggedComments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _User_decorators, { kind: "field", name: "User", static: false, private: false, access: { has: function (obj) { return "User" in obj; }, get: function (obj) { return obj.User; }, set: function (obj, value) { obj.User = value; } }, metadata: _metadata }, _User_initializers, _User_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Chat = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Chat = _classThis;
}();
exports.Chat = Chat;
