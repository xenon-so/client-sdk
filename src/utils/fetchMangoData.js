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
exports.fetchMangoPositions = void 0;
var mango_client_1 = require("@blockworks-foundation/mango-client");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var isMainnet_1 = require("../isMainnet");
var perpMarkets_1 = require("./perpMarkets");
var fetchMangoPositions = function (publicKey, mangoAccPubKey, client, mangoGroup, xenonClient) { return __awaiter(void 0, void 0, void 0, function () {
    var mangoAccount, openPositions, pendingOpenOrders, _loop_1, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.getMangoAccount(mangoAccPubKey, constants_1.SERUM_PROGRAM_ID_V3)];
            case 1:
                mangoAccount = _a.sent();
                openPositions = [];
                pendingOpenOrders = [];
                _loop_1 = function (i) {
                    var perpMarketInfo, index, perpAccount, perpMarket, openOrders, ids, _loop_2, index_1, side, positionSize, _b, nativePrice, nativeQuantity;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                perpMarketInfo = perpMarkets_1.PERP_MARKETS[i];
                                index = perpMarkets_1.PERP_MARKETS[i].marketIndex;
                                perpAccount = mangoAccount.perpAccounts[index];
                                return [4 /*yield*/, client.getPerpMarket(new web3_js_1.PublicKey(perpMarketInfo.publicKey), perpMarketInfo.baseDecimals, perpMarketInfo.quoteDecimals)];
                            case 1:
                                perpMarket = _c.sent();
                                return [4 /*yield*/, perpMarket.loadOrdersForAccount(xenonClient.connection, mangoAccount)];
                            case 2:
                                openOrders = _c.sent();
                                ids = mango_client_1.IDS['groups'][isMainnet_1.isMainnet ? 0 : 2];
                                _loop_2 = function (index_1) {
                                    var openOrder = openOrders[index_1];
                                    var perpMarket_1 = ids.perpMarkets.find(function (f) { return f.marketIndex === perpMarketInfo.marketIndex; });
                                    pendingOpenOrders.push({
                                        cancelOrder: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            var transaction;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        transaction = new web3_js_1.Transaction();
                                                        return [4 /*yield*/, xenonClient.mangoCancelOrder(transaction, perpMarket_1.marketIndex, openOrder.clientId.toNumber())];
                                                    case 1:
                                                        _a.sent();
                                                        transaction.feePayer = publicKey;
                                                        return [2 /*return*/, transaction];
                                                }
                                            });
                                        }); }
                                    });
                                };
                                for (index_1 = 0; index_1 < openOrders.length; index_1++) {
                                    _loop_2(index_1);
                                }
                                side = perpAccount.getBasePositionUi(perpMarket) < 0 ? 'buy' : 'sell';
                                positionSize = perpAccount.getBasePositionUi(perpMarket) * (side === 'sell' ? 1 : -1);
                                _b = perpMarket.uiToNativePriceQuantity(1, positionSize), nativePrice = _b[0], nativeQuantity = _b[1];
                                if (positionSize === 0)
                                    return [2 /*return*/, "continue"];
                                openPositions.push({
                                    closePosition: function () { return __awaiter(void 0, void 0, void 0, function () {
                                        var perpMarketInfoA, transaction;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    perpMarketInfoA = perpMarkets_1.PERP_MARKETS.find(function (i) { return i.baseSymbol === perpMarketInfo.baseSymbol; });
                                                    transaction = new web3_js_1.Transaction();
                                                    transaction.feePayer = publicKey;
                                                    return [4 /*yield*/, xenonClient.mangoPlaceOrder(transaction, 1, side, perpMarketInfoA.marketIndex, 'market', nativeQuantity.toNumber(), 1)];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/, transaction];
                                            }
                                        });
                                    }); }
                                });
                                return [2 /*return*/];
                        }
                    });
                };
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < perpMarkets_1.PERP_MARKETS.length)) return [3 /*break*/, 5];
                return [5 /*yield**/, _loop_1(i)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, { openPositions: openPositions, pendingOpenOrders: pendingOpenOrders }];
        }
    });
}); };
exports.fetchMangoPositions = fetchMangoPositions;
