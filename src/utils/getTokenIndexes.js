"use strict";
exports.__esModule = true;
exports.getLocalAdapterTokenIndexHelper = exports.getMarginPDATokenIndexHelper = exports.getXenonPDATokenIndexHelper = void 0;
var getXenonPDATokenIndexHelper = function (xenonPdaData, mint) {
    if (!xenonPdaData) {
        throw 'Error : xenonPdaData undefined';
    }
    for (var i = 0; i < xenonPdaData.token_list.length; i++) {
        if (xenonPdaData.token_list[i].mint.toBase58() === mint.toBase58()) {
            return i;
        }
    }
    return -1;
};
exports.getXenonPDATokenIndexHelper = getXenonPDATokenIndexHelper;
//if you want to use stored marginPdaData then do not pass marginPdaData
var getMarginPDATokenIndexHelper = function (mint, xenonPdaData, marginPdaData) {
    if (!xenonPdaData) {
        throw 'Error : xenonPdaData undefined';
    }
    if (xenonPdaData.token_list)
        for (var i = 0; i < marginPdaData.tokens.length; i++) {
            if (marginPdaData.tokens[i].is_active &&
                xenonPdaData.token_list[marginPdaData.tokens[i].index].mint.toBase58() === mint.toBase58()) {
                return i;
            }
        }
    return -1;
};
exports.getMarginPDATokenIndexHelper = getMarginPDATokenIndexHelper;
var getLocalAdapterTokenIndexHelper = function (mint, localAdapterPDAData) {
    if (!localAdapterPDAData) {
        throw 'Error : localAdapterPDAData undefined';
    }
    for (var i = 0; i < localAdapterPDAData.mints.length; i++) {
        if (localAdapterPDAData.mints[i].toBase58() === mint.toBase58()) {
            return i;
        }
    }
    return -1;
};
exports.getLocalAdapterTokenIndexHelper = getLocalAdapterTokenIndexHelper;
