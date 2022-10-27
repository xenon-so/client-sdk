"use strict";
/*
  A sample template for liquidating accounts
*/
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.closeAllPositionsAndSellAllAssets = void 0;
var web3_js_1 = require("@solana/web3.js");
var bs58_1 = require("bs58");
var index_1 = require("../index");
var WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY ||
    'xxxx';
var USER_PRIVATE_KEY = bs58_1["default"].decode(WALLET_PRIVATE_KEY);
var USER_KEYPAIR = web3_js_1.Keypair.fromSecretKey(USER_PRIVATE_KEY);
// const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(process.env.WALLET_PRIVATE_KEY || '')))
console.log(process.env.WALLET_PRIVATE_KEY);
var connection = new web3_js_1.Connection('https://ssc-dao.genesysgo.net', 'processed');
var sendTransactions = function (transactions) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(transactions.map(function (f) {
                    return (0, web3_js_1.sendAndConfirmTransaction)(connection, f, [USER_KEYPAIR], {
                        skipPreflight: true,
                        maxRetries: 3
                    }).then(function (sign) {
                        return console.log('signature tx url:: ', "https://explorer.solana.com/tx/".concat(sign));
                    });
                }))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var closePositionsLinearly = function (liquidatorClient, xenonTraderClient) { return __awaiter(void 0, void 0, void 0, function () {
    var quarryTransactions, saberTransactions, solendTransactions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, liquidatorClient.closeAllQuarryPositions({
                    marginAccount: xenonTraderClient.marginPDA
                })];
            case 1:
                quarryTransactions = _a.sent();
                return [4 /*yield*/, sendTransactions(quarryTransactions)];
            case 2:
                _a.sent();
                return [4 /*yield*/, liquidatorClient.closeAllSaberPositions({
                        marginAccount: xenonTraderClient.marginPDA
                    })];
            case 3:
                saberTransactions = _a.sent();
                return [4 /*yield*/, sendTransactions(saberTransactions)];
            case 4:
                _a.sent();
                return [4 /*yield*/, liquidatorClient.closeAllSolendPositions({
                        marginAccount: xenonTraderClient.marginPDA
                    })];
            case 5:
                solendTransactions = _a.sent();
                return [4 /*yield*/, sendTransactions(solendTransactions)];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var closeAllMangoAndSettle = function (liquidatorClient, xenonTraderClient) { return __awaiter(void 0, void 0, void 0, function () {
    var mangoTransactions, mangoGroup, mangoAccount, cache, totalUsdcValue, mangoWithdrawTransaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!xenonTraderClient.mangoAccount) return [3 /*break*/, 9];
                return [4 /*yield*/, liquidatorClient.closeAllMangoPositions(xenonTraderClient)];
            case 1:
                mangoTransactions = _a.sent();
                return [4 /*yield*/, sendTransactions(__spreadArray([], mangoTransactions, true))];
            case 2:
                _a.sent();
                // settle all mango pnls, these directly send the transactions
                return [4 /*yield*/, xenonTraderClient.mangoSettleAll(USER_KEYPAIR)];
            case 3:
                // settle all mango pnls, these directly send the transactions
                _a.sent();
                return [4 /*yield*/, xenonTraderClient.mangoClient.getMangoGroup(index_1.MANGO_GROUP_ACCOUNT_V3)];
            case 4:
                mangoGroup = _a.sent();
                return [4 /*yield*/, xenonTraderClient.mangoClient.getMangoAccount(xenonTraderClient.mangoCheckAccountData.mango_account, index_1.SERUM_PROGRAM_ID_V3)];
            case 5:
                mangoAccount = _a.sent();
                return [4 /*yield*/, mangoGroup.loadCache(connection)];
            case 6:
                cache = _a.sent();
                totalUsdcValue = mangoAccount
                    .getAssetsVal(mangoGroup, cache)
                    .toNumber();
                mangoWithdrawTransaction = new web3_js_1.Transaction();
                return [4 /*yield*/, xenonTraderClient.mangoWithdraw(mangoWithdrawTransaction, 0, totalUsdcValue)];
            case 7:
                _a.sent();
                return [4 /*yield*/, sendTransactions([mangoWithdrawTransaction])];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };
var closeAllPositionsAndSellAllAssets = function (userPublicKey, liquidatorClient) { return __awaiter(void 0, void 0, void 0, function () {
    var xenonTraderClient, _a, withdrawInstructions, convertToUSDCTransactions, _i, convertToUSDCTransactions_1, tr, _b, tr_1, t, sign;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                xenonTraderClient = new index_1.XenonTraderClient(connection, userPublicKey);
                return [4 /*yield*/, xenonTraderClient.load()];
            case 1:
                _c.sent();
                return [4 /*yield*/, xenonTraderClient.loadMangoAdaptor()];
            case 2:
                _c.sent();
                return [4 /*yield*/, Promise.all([
                        closePositionsLinearly(liquidatorClient, xenonTraderClient),
                        closeAllMangoAndSettle(liquidatorClient, xenonTraderClient),
                    ])];
            case 3:
                _c.sent();
                return [4 /*yield*/, liquidatorClient.withdrawAllAssets(true)];
            case 4:
                _a = _c.sent(), withdrawInstructions = _a.withdrawInstructions, convertToUSDCTransactions = _a.convertToUSDCTransactions;
                return [4 /*yield*/, Promise.all([sendTransactions(withdrawInstructions)])];
            case 5:
                _c.sent();
                _i = 0, convertToUSDCTransactions_1 = convertToUSDCTransactions;
                _c.label = 6;
            case 6:
                if (!(_i < convertToUSDCTransactions_1.length)) return [3 /*break*/, 11];
                tr = convertToUSDCTransactions_1[_i];
                _b = 0, tr_1 = tr;
                _c.label = 7;
            case 7:
                if (!(_b < tr_1.length)) return [3 /*break*/, 10];
                t = tr_1[_b];
                return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, t, [USER_KEYPAIR], { skipPreflight: true })];
            case 8:
                sign = _c.sent();
                console.log('signature tx url:: ', "https://solscan.io/tx/".concat(sign));
                _c.label = 9;
            case 9:
                _b++;
                return [3 /*break*/, 7];
            case 10:
                _i++;
                return [3 /*break*/, 6];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.closeAllPositionsAndSellAllAssets = closeAllPositionsAndSellAllAssets;
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, marginAccounts, _i, marginAccounts_1, marginAccount, transaction, simulate, hash, sign, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = new index_1.XenonLiquidatorClient(connection, USER_KEYPAIR.publicKey);
                return [4 /*yield*/, client.load()];
            case 1:
                _a.sent();
                return [4 /*yield*/, client.getAllMarginAccounts()];
            case 2:
                marginAccounts = _a.sent();
                _i = 0, marginAccounts_1 = marginAccounts;
                _a.label = 3;
            case 3:
                if (!(_i < marginAccounts_1.length)) return [3 /*break*/, 12];
                marginAccount = marginAccounts_1[_i];
                transaction = new web3_js_1.Transaction();
                transaction.feePayer = USER_KEYPAIR.publicKey;
                return [4 /*yield*/, client.liquidateMarginAccount({
                        marginAccount: marginAccount.pubkey,
                        transaction: transaction
                    })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                _a.trys.push([5, 10, , 11]);
                return [4 /*yield*/, connection.simulateTransaction(transaction)];
            case 6:
                simulate = _a.sent();
                if (!(simulate.value.err == null &&
                    !JSON.stringify(simulate.value.logs).includes('cache price stale'))) return [3 /*break*/, 9];
                return [4 /*yield*/, connection.getLatestBlockhash()];
            case 7:
                hash = _a.sent();
                transaction.recentBlockhash = hash.blockhash;
                return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [USER_KEYPAIR], { skipPreflight: true })];
            case 8:
                sign = _a.sent();
                console.log('signature tx url:: ', "https://solscan.io/tx/".concat(sign, "?cluster=devnet"));
                (0, exports.closeAllPositionsAndSellAllAssets)(USER_KEYPAIR.publicKey, client);
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_1 = _a.sent();
                console.error('could not liquidate ::: ', error_1);
                return [3 /*break*/, 11];
            case 11:
                _i++;
                return [3 /*break*/, 3];
            case 12: return [2 /*return*/];
        }
    });
}); };
// setInterval(() => {
//   main()
// }, 1 * 60 * 1000);
