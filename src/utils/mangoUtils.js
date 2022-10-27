"use strict";
exports.__esModule = true;
exports.mapOrderType = void 0;
var mapOrderType = function (type) {
    switch (type) {
        case 'limit':
            return 0;
        case 'ioc':
            return 1;
        case 'postOnly':
            return 2;
        case 'market':
            return 3;
        case 'postOnlySlide':
            return 4;
        default:
            return 0;
    }
};
exports.mapOrderType = mapOrderType;
