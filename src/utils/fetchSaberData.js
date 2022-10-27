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
exports.__esModule = true;
exports.getSaberData = void 0;
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var rpcUtils_1 = require("../rpcUtils");
var saberList_1 = require("./saberList");
var web3Utils_1 = require("./web3Utils");
var cross_fetch_1 = require("cross-fetch");
var getSaberData = function (marginPK) { return __awaiter(void 0, void 0, void 0, function () {
    var requests, i, pool, i, pool, i, pool, quarryAccount, minerAccount, minerVault, baseRequestsData, supplyTokens, reserveBalances, remaining, parsedData, reserveBalancesChunks, last3s, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requests = [];
                for (i = 0; i < saberList_1.SABER_LP_LIST.length; i++) {
                    pool = saberList_1.SABER_LP_LIST[i];
                    requests.push((0, rpcUtils_1.buildGetTokenSupply)(new web3_js_1.PublicKey(pool.lpToken.address)));
                }
                for (i = 0; i < saberList_1.SABER_LP_LIST.length; i++) {
                    pool = saberList_1.SABER_LP_LIST[i];
                    requests.push((0, rpcUtils_1.buildGetTokenAccountBalance)(pool.swap.state.tokenA.reserve));
                    requests.push((0, rpcUtils_1.buildGetTokenAccountBalance)(pool.swap.state.tokenB.reserve));
                }
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < saberList_1.SABER_LP_LIST.length)) return [3 /*break*/, 5];
                pool = saberList_1.SABER_LP_LIST[i];
                quarryAccount = new web3_js_1.PublicKey(pool.quarry);
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from('Miner'), quarryAccount.toBuffer(), marginPK.toBuffer()], constants_1.quarryProgramId)];
            case 2:
                minerAccount = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(minerAccount[0], new web3_js_1.PublicKey(pool.lpToken.address))];
            case 3:
                minerVault = _a.sent();
                requests.push((0, rpcUtils_1.buildGetAccountInfo)(quarryAccount));
                // await connection.getTokenAccountBalance(minerVault, 'processed')
                requests.push((0, rpcUtils_1.buildGetTokenAccountBalance)(minerVault.toBase58()));
                requests.push((0, rpcUtils_1.buildGetAccountInfo)(minerAccount[0]));
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 1];
            case 5: return [4 /*yield*/, (0, cross_fetch_1["default"])('https://ssc-dao.genesysgo.net', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requests)
                })];
            case 6: return [4 /*yield*/, (_a.sent()).json()];
            case 7:
                baseRequestsData = _a.sent();
                supplyTokens = baseRequestsData
                    .slice(0, saberList_1.SABER_LP_LIST.length)
                    .map(function (f) { return (0, rpcUtils_1.decodeTokenSupplyResponse)(f); });
                reserveBalances = baseRequestsData
                    .slice(saberList_1.SABER_LP_LIST.length, saberList_1.SABER_LP_LIST.length * 3)
                    .map(function (f) { return (0, rpcUtils_1.decodeTokenAccountBalanceResponse)(f); });
                remaining = baseRequestsData.slice(saberList_1.SABER_LP_LIST.length * 3);
                parsedData = [];
                reserveBalancesChunks = (0, rpcUtils_1.splitToChunks)(reserveBalances, 3);
                last3s = (0, rpcUtils_1.splitToChunks)(remaining, 3);
                for (i = 0; i < saberList_1.SABER_LP_LIST.length; i++) {
                    parsedData.push({
                        lpTokenSupply: supplyTokens[i],
                        tokenAReserveBalance: reserveBalancesChunks[i][0],
                        tokenBReserveBalance: reserveBalancesChunks[i][1],
                        quarryAccountInfo: (0, rpcUtils_1.decodeAccountInfoResponse)(last3s[i][0]),
                        minerVaultBalance: (0, rpcUtils_1.decodeTokenAccountBalanceResponse)(last3s[i][1]),
                        minerAccountInfo: (0, rpcUtils_1.decodeAccountInfoResponse)(last3s[i][2])
                    });
                }
                return [2 /*return*/, parsedData];
        }
    });
}); };
exports.getSaberData = getSaberData;
