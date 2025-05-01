"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageData = void 0;
var PageData = /** @class */ (function () {
    function PageData(pageNumber, pageSize) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
    PageData.default = function () {
        return new PageData(0, 0);
    };
    return PageData;
}());
exports.PageData = PageData;
