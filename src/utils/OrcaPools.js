"use strict";
exports.__esModule = true;
exports.ORCA_POOLS_LIST = exports.mainnetPoolList = void 0;
var isMainnet_1 = require("../isMainnet");
var devnetPoolList = [
    {
        address: "5Z66YYYaTmmx1R4mATAGLSc8aV4Vfy5tNdJQzk1GP9RF",
        whitelisted: true,
        tokenMintA: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
        tokenMintB: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        tokenASymbol: 'WSOL',
        tokenBSymbol: 'USDC',
        tickSpacing: 64,
        lpsFeeRate: 0.003,
        protocolFeeRate: 0.03
    }
];
exports.mainnetPoolList = [
    {
        address: "5Z66YYYaTmmx1R4mATAGLSc8aV4Vfy5tNdJQzk1GP9RF",
        whitelisted: true,
        tokenMintA: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
        tokenMintB: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        tokenASymbol: 'WSOL',
        tokenBSymbol: 'USDC',
        tickSpacing: 64,
        lpsFeeRate: 0.003,
        protocolFeeRate: 0.03
    }
];
exports.ORCA_POOLS_LIST = isMainnet_1.isMainnet
    ? exports.mainnetPoolList
    : devnetPoolList;
